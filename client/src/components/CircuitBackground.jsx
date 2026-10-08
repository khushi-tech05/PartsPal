function CircuitBackground() {
  return (
    <svg
      className="circuit"
      viewBox="0 0 320 450"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* circuit lines */}
      <g fill="none" stroke="#1b3560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 50H60L86 76H170L196 50H320" />
        <path d="M0 120H34L60 146H120" />
        <path d="M320 130H270L246 154H196" />
        <path d="M0 390H50L76 364H140" />
        <path d="M320 410H240L216 386H170" />
        <path d="M70 450V420L96 394" />
        <path d="M250 450V430L276 404" />
        <path d="M120 0V24L146 50" />
      </g>

      {/* glowing connection dots */}
      <g fill="#0d1a33" stroke="#22d3ee" strokeWidth="2" opacity="0.75">
        <circle cx="60" cy="50" r="4" />
        <circle cx="196" cy="50" r="4" />
        <circle cx="120" cy="146" r="4" />
        <circle cx="196" cy="154" r="4" />
        <circle cx="140" cy="364" r="4" />
        <circle cx="170" cy="386" r="4" />
        <circle cx="96" cy="394" r="4" />
        <circle cx="276" cy="404" r="4" />
      </g>

      {/* two gears */}
      <circle cx="268" cy="326" r="30" fill="none" stroke="#1b3560" strokeWidth="12" strokeDasharray="9 7" />
      <circle cx="268" cy="326" r="13" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.5" />
      <circle cx="48" cy="268" r="20" fill="none" stroke="#1b3560" strokeWidth="9" strokeDasharray="7 5" />
      <circle cx="48" cy="268" r="8" fill="none" stroke="#8b5cf6" strokeWidth="2" opacity="0.7" />

      {/* a chip */}
      <rect x="228" y="176" width="64" height="48" rx="6" fill="#0f2142" stroke="#2a4a80" strokeWidth="2" />
      <rect x="242" y="188" width="36" height="24" rx="3" fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.6" />
      <path
        d="M240 170V176M256 170V176M272 170V176M284 170V176M240 224V230M256 224V230M272 224V230M284 224V230"
        stroke="#2a4a80"
        strokeWidth="2"
      />
    </svg>
  );
}

export default CircuitBackground;