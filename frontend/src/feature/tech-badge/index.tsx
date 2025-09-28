import styles from './tech-badge.module.css';

interface Props {
  tech: number;
}

export const TechBadge = ({ tech }: Props) => {
  return <span className={styles.badge}>T{tech}</span>;
};
