#!/usr/bin/env bash
# Frassati Fellowship website: one-time Google Cloud setup.
#
# Run in Google Cloud Shell (https://shell.cloud.google.com), signed in as the account that
# should own the site, after creating a project and linking billing:
#   git clone https://github.com/mikalainis/frassati && cd frassati
#   PROJECT_ID=<your project id> bash infra/gcp/bootstrap.sh
#
# Safe to re-run: every step checks before creating. It only creates resources inside
# PROJECT_ID and no long-lived keys: GitHub Actions signs in through Workload Identity
# Federation, limited to the mikalainis/frassati repository's main branch.
#
# Creates:
#   - required APIs
#   - Artifact Registry repo "frassati" (container images; keeps the newest 5)
#   - service accounts: frassati-run (the site at runtime, no permissions),
#     frassati-deployer (GitHub Actions)
#   - Workload Identity pool "github" + provider "github-actions"
# Then prints the lines to paste into infra/gcp/production.env.

set -euo pipefail

PROJECT_ID="${PROJECT_ID:?Set PROJECT_ID, e.g. PROJECT_ID=frassatinj-site}"
REGION="${REGION:-us-east4}"              # Northern Virginia, closest to NJ; supports domain mapping
GITHUB_REPO="${GITHUB_REPO:-mikalainis/frassati}"
AR_REPO="frassati"
RUN_SA="frassati-run"
DEPLOY_SA="frassati-deployer"
POOL="github"
PROVIDER="github-actions"

say() { printf '\n\033[1m== %s\033[0m\n' "$*"; }
exists() { "$@" >/dev/null 2>&1; }

gcloud config set project "$PROJECT_ID" >/dev/null
PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
RUN_SA_EMAIL="${RUN_SA}@${PROJECT_ID}.iam.gserviceaccount.com"
DEPLOY_SA_EMAIL="${DEPLOY_SA}@${PROJECT_ID}.iam.gserviceaccount.com"

say "Checking billing is linked"
if [[ "$(gcloud billing projects describe "$PROJECT_ID" --format='value(billingEnabled)')" != "True" ]]; then
  echo "Billing is not enabled on $PROJECT_ID. Link a billing account in the console, then re-run." >&2
  exit 1
fi

say "Enabling APIs (takes a minute the first time)"
gcloud services enable \
  run.googleapis.com artifactregistry.googleapis.com iam.googleapis.com \
  iamcredentials.googleapis.com sts.googleapis.com cloudresourcemanager.googleapis.com

say "Artifact Registry repository: $AR_REPO ($REGION)"
exists gcloud artifacts repositories describe "$AR_REPO" --location "$REGION" ||
  gcloud artifacts repositories create "$AR_REPO" --repository-format=docker --location "$REGION" \
    --description="Frassati Fellowship website images"
# Keep storage inside the free tier: delete all but the newest 5 images.
policy="$(mktemp)"
cat >"$policy" <<'JSON'
[
  {"name": "keep-newest-5", "action": {"type": "Keep"}, "mostRecentVersions": {"keepCount": 5}},
  {"name": "delete-older", "action": {"type": "Delete"}, "condition": {"tagState": "ANY"}}
]
JSON
gcloud artifacts repositories set-cleanup-policies "$AR_REPO" --location "$REGION" \
  --policy="$policy" --no-dry-run >/dev/null
rm -f "$policy"

say "Service accounts"
exists gcloud iam service-accounts describe "$RUN_SA_EMAIL" ||
  gcloud iam service-accounts create "$RUN_SA" --display-name="Frassati website runtime"
exists gcloud iam service-accounts describe "$DEPLOY_SA_EMAIL" ||
  gcloud iam service-accounts create "$DEPLOY_SA" --display-name="Frassati GitHub Actions deployer"

say "Roles: deployer can deploy Cloud Run and push images; the runtime account gets none"
for role in roles/run.admin roles/artifactregistry.writer; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:${DEPLOY_SA_EMAIL}" \
    --role="$role" --condition=None >/dev/null
done
# The deployer may run the service *as* the runtime account (and nothing else).
gcloud iam service-accounts add-iam-policy-binding "$RUN_SA_EMAIL" \
  --member="serviceAccount:${DEPLOY_SA_EMAIL}" --role=roles/iam.serviceAccountUser >/dev/null

say "Workload Identity Federation for GitHub Actions (only $GITHUB_REPO, branch main)"
exists gcloud iam workload-identity-pools describe "$POOL" --location=global ||
  gcloud iam workload-identity-pools create "$POOL" --location=global --display-name="GitHub Actions"
exists gcloud iam workload-identity-pools providers describe "$PROVIDER" --location=global --workload-identity-pool="$POOL" ||
  gcloud iam workload-identity-pools providers create-oidc "$PROVIDER" --location=global \
    --workload-identity-pool="$POOL" --display-name="GitHub Actions OIDC" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
    --attribute-condition="assertion.repository == '${GITHUB_REPO}' && assertion.ref == 'refs/heads/main'"
gcloud iam service-accounts add-iam-policy-binding "$DEPLOY_SA_EMAIL" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL}/attribute.repository/${GITHUB_REPO}" >/dev/null

say "Done. Paste these lines into infra/gcp/production.env (or send them to Claude):"
cat <<OUT
GCP_PROJECT_ID=${PROJECT_ID}
GCP_REGION=${REGION}
GCP_WIF_PROVIDER=projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL}/providers/${PROVIDER}
GCP_DEPLOYER_SA=${DEPLOY_SA_EMAIL}
GCP_RUNTIME_SA=${RUN_SA_EMAIL}
OUT
