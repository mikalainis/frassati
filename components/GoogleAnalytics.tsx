/**
 * Google Analytics 4 (gtag.js) — rendered in <head> as Google's standard
 * snippet so it appears in the raw HTML (Google's tag checker looks for it).
 *
 * Uses the fellowship's GA4 property (G-VM4C7W7Q2D). NEXT_PUBLIC_GA_ID can
 * override it if the property ever changes. Skipped during local dev
 * (`npm run dev`) so testing doesn't skew the numbers.
 *
 * Page views on client-side navigation are captured by GA4's
 * Enhanced Measurement ("Page changes based on browser history events"),
 * which is on by default for new web streams.
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-VM4C7W7Q2D";
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`
        }}
      />
    </>
  );
}
