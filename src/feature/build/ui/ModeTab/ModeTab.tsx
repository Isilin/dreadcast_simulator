import styles from './ModeTab.module.css';
import type { WorkbenchMode } from '../../model/workbench.types';

interface ModeTabProps {
  activeMode: WorkbenchMode;
  mode: WorkbenchMode;
  children: string;
  onChange: (mode: WorkbenchMode) => void;
}

export const ModeTab = ({ activeMode, mode, children, onChange }: ModeTabProps) => (
  <button
    type="button"
    className={styles.tab}
    data-active={activeMode === mode}
    onClick={() => onChange(mode)}
  >
    {children}
  </button>
);
