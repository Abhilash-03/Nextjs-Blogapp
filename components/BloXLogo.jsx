
import * as React from "react";

// Modern stacked layers logo for BloX
export default function BloXLogo({ size = 36, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`} style={{ fontFamily: 'Inter, sans-serif' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        {/* Bottom layer */}
        <rect x="6" y="14" width="24" height="18" rx="4" fill="url(#grad3)" />
        {/* Middle layer */}
        <rect x="4" y="10" width="24" height="18" rx="4" fill="url(#grad2)" />
        {/* Top layer */}
        <rect x="2" y="6" width="24" height="18" rx="4" fill="url(#grad1)" />
        {/* Pen/writing accent */}
        <path
          d="M10 12L18 12M10 16L16 16"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xl font-bold tracking-tight text-foreground" style={{ letterSpacing: '-0.03em' }}>
        BloX
      </span>
    </span>
  );
}
