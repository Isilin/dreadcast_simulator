import styles from './ModeTab.module.css';

interface ModeTabProps<T extends string> {
  activeMode: T;
  mode: T;
  children: string;
  onChange: (mode: T) => void;
}

export const ModeTab = <T extends string>({
  activeMode,
  mode,
  children,
  onChange,
}: ModeTabProps<T>) => (
  <button
    type="button"
    role="tab"
    aria-selected={activeMode === mode}
    className={styles.tab}
    data-active={activeMode === mode}
    onClick={() => onChange(mode)}
  >
    {children}
  </button>
);
