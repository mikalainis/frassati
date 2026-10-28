import Script from "next/script";

/**
 * Google Analytics 4 (gtag.js).
 *
 * Renders nothing unless NEXT_PUBLIC_GA_ID is set (e.g. "G-XXXXXXXXXX"),
 * so local dev and preview builds stay untracked until the ID is added
 * in Vercel → Project → Settings → Environment Variables.
 *
 * Page views on client-side navigation are captured by GA4's
 * Enhanced Measurement ("Page changes based on browser history events"),
 * which is on by default for new web streams.
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
