import styles from './tech-badge.module.css';

interface Props {
  value: number;
}

export const TechBadge = ({ value }: Props) => {
  return <span className={styles.badge}>T{value}</span>;
};
