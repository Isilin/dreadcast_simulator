import styles from './ImplantsListSkeleton.module.css';

interface Props {
  count?: number;
}

export function ImplantsListSkeleton({ count = 15 }: Props) {
  return (
    <ul className={styles.list} role="status" aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <li className={styles.card} key={i}>
          <div className={styles.title} aria-hidden />
          <div className={styles.thumbWrapper} aria-hidden>
            <div className={styles.thumb} aria-hidden />
          </div>
          <div className={styles.controls}>
            <span className={styles.btn} aria-hidden />
            <span className={styles.counter} aria-hidden />
            <span className={styles.btn} aria-hidden />
          </div>
        </li>
      ))}
      <span className="visuallyHidden">Chargement des implants…</span>
    </ul>
  );
}
