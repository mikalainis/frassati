export function SummitMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      <path d="M12 33 L22 17 L27 25 L31 19 L37 33 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
      <circle cx="24" cy="12.5" r="2.4" fill="currentColor" />
    </svg>
  );
}

/* Signature graphic: concentric summit contours */
export function Contours({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 600"
      fill="none"
      aria-hidden
    >
      {[70, 120, 175, 235, 300].map((r) => (
        <circle
          key={r}
          cx="300"
          cy="300"
          r={r}
          stroke="#C99A3C"
          strokeOpacity={0.12}
          strokeWidth="1"
        />
      ))}
      <circle cx="300" cy="300" r="30" stroke="#E4C77E" strokeOpacity="0.25" strokeWidth="1" />
    </svg>
  );
}

/* Signature divider: a thin gold ridgeline */
export function Ridgeline({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 60" fill="none" preserveAspectRatio="none" aria-hidden>
      <path
        d="M0 50 L180 42 L320 18 L420 34 L560 8 L640 26 L780 14 L900 40 L1050 30 L1200 46"
        stroke="#C99A3C"
        strokeOpacity="0.45"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="560" cy="8" r="3" fill="#E4C77E" className="summit-glow" />
    </svg>
  );
}
