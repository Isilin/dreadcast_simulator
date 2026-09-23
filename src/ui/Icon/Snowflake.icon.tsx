export const SnowflakeIcon = (props: React.ComponentProps<'svg'>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2v20" />
      <path d="M3.3 7l17.4 10" />
      <path d="M3.3 17L20.7 7" />
      <path d="M9 4l3 2 3-2" />
      <path d="M9 20l3-2 3 2" />
    </svg>
  );
};
