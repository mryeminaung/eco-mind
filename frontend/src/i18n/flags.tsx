import React, { useId } from "react";

export function FlagUnitedKingdom({ className }: { className?: string }) {
  const clipId = useId().replace(/:/g, "");

  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true" focusable="false">
      <clipPath id={clipId}>
        <rect width="60" height="40" rx="3" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect width="60" height="40" fill="#012169" />
        <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
        <path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="5" />
        <path d="M30 0 V40 M0 20 H60" stroke="#fff" strokeWidth="13" />
        <path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="8" />
      </g>
    </svg>
  );
}

export function FlagMyanmar({ className }: { className?: string }) {
  const clipId = useId().replace(/:/g, "");

  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true" focusable="false">
      <clipPath id={clipId}>
        <rect width="60" height="40" rx="3" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect width="60" height="13.33" fill="#FECB00" />
        <rect y="13.33" width="60" height="13.34" fill="#34B233" />
        <rect y="26.67" width="60" height="13.33" fill="#EA2839" />
        <path
          fill="#fff"
          d="M30 7.6 33.1 17.2H43.2L35 23.1 38.1 32.7 30 26.8 21.9 32.7 25 23.1 16.8 17.2H26.9Z"
        />
      </g>
    </svg>
  );
}
