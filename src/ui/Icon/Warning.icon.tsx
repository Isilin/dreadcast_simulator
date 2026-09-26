interface Props {
  className?: string;
}

/** Warning triangle in the current text color. */
export const WarningIcon = ({ className }: Props) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M10.4 3.9c.74-1.28 2.46-1.28 3.2 0l8.06 14c.71 1.23-.18 2.76-1.6 2.76H3.94c-1.42 0-2.31-1.53-1.6-2.76l8.06-14z" />
    <path d="M12 8.5v5" />
    <circle cx="12" cy="16.5" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
