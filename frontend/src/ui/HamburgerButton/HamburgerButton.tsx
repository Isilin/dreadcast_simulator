import styles from './HamburgerButton.module.css';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${isOpen ? styles.open : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
      aria-expanded={isOpen}
    >
      <span className={styles.line}></span>
      <span className={styles.line}></span>
      <span className={styles.line}></span>
    </button>
  );
}
