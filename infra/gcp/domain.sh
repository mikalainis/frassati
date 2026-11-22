#!/usr/bin/env bash
# Frassati Fellowship website: point frassatinj.org (and www) at Cloud Run.
#
# Run in Cloud Shell AFTER the first successful deploy (the "frassati" service must exist):
#   PROJECT_ID=<your project id> bash infra/gcp/domain.sh
#
# Uses Cloud Run domain mappings: free, with a Google-managed HTTPS certificate. (Google labels
# them Preview; a load balancer is the alternative, about $18+/month, not worth it for this site.)
#
# Before the first run, the domain must be verified for the signed-in Google account, once:
#   gcloud domains verify frassatinj.org
# (adds a TXT record at GoDaddy). Then this script prints the DNS records to enter at GoDaddy.

set -euo pipefail

PROJECT_ID="${PROJECT_ID:?Set PROJECT_ID}"
REGION="${REGION:-us-east4}"
SERVICE="frassati"
DOMAINS=(${DOMAINS:-frassatinj.org www.frassatinj.org})

gcloud config set project "$PROJECT_ID" >/dev/null

for d in "${DOMAINS[@]}"; do
  if ! gcloud beta run domain-mappings describe --domain "$d" --region "$REGION" >/dev/null 2>&1; then
    gcloud beta run domain-mappings create --service "$SERVICE" --domain "$d" --region "$REGION"
  fi
  printf '\n\033[1m== DNS records for %s (enter these at GoDaddy)\033[0m\n' "$d"
  gcloud beta run domain-mappings describe --domain "$d" --region "$REGION" \
    --format='table(status.resourceRecords[].type,status.resourceRecords[].name,status.resourceRecords[].rrdata)'
done

cat <<'MSG'

At GoDaddy (DNS for frassatinj.org): remove the old Vercel records (A 76.76.21.21 and the www
CNAME to Vercel), then add the records above. "Name" blank or @ means the bare domain.
The HTTPS certificate is issued automatically, usually within 15-60 minutes of DNS updating.
Check progress with:
  gcloud beta run domain-mappings describe --domain frassatinj.org --region us-east4
MSG
