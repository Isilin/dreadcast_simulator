export const WarningIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Attention"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="g-warning" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#FF9F1C" />
        <stop offset="100%" stopColor="#FF7B00" />
      </linearGradient>
    </defs>
    <path
      d="M10.4 3.9c.74-1.28 2.46-1.28 3.2 0l8.06 14c.71 1.23-.18 2.76-1.6 2.76H3.94c-1.42 0-2.31-1.53-1.6-2.76l8.06-14z"
      stroke="url(#g-warning)"
    />
    <path d="M12 8.5v5" fill="url(#g-warning)" />
    <circle cx="12" cy="16.5" r="1.1" fill="url(#g-warning)" />
  </svg>
);

export default WarningIcon;
