
import * as React from "react";

// Minimal and clean logo for BloX, suitable for blog applications
export default function BloXLogo({ size = 36, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`} style={{ fontFamily: 'Inter, sans-serif' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="rounded-lg border border-neutral-200 bg-white shadow-sm"
      >
        <rect x="2" y="2" width="32" height="32" rx="8" fill="#fff" />
        <rect x="8" y="8" width="20" height="20" rx="4" fill="#2563eb" fillOpacity="0.08" />
        <rect x="13" y="13" width="10" height="10" rx="2" fill="#2563eb" fillOpacity="0.18" />
        <rect x="16" y="16" width="4" height="4" rx="1" fill="#2563eb" />
      </svg>
      <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white" style={{ letterSpacing: '-0.03em' }}>
        BloX
      </span>
    </span>
  );
}
