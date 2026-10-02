interface SiteBrandProps {
  className?: string;
}

export function SiteBrand({ className = '' }: SiteBrandProps) {
  return (
    <a className={`brand ${className}`.trim()} href="#top" aria-label="AI Radar">
      <span className="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="11.5" />
          <path d="M16 4.5v23M4.5 16h23M7.9 7.9l16.2 16.2" />
          <circle className="brand__dot" cx="20.8" cy="11.2" r="2.4" />
        </svg>
      </span>
      <span>AI Radar</span>
    </a>
  );
}
