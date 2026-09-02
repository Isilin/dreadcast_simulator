import styles from '../SubscriptionPage/SubscriptionPage.module.css';

export const SubscriptionHero = () => {
  return (
    <section className={styles.hero}>
      <p className={styles.overline}>Plans Premium</p>
      <h1 className={styles.title}>Abonnement</h1>
      <p className={styles.subtitle}>
        Choisissez une durée, activez-la instantanément, et gardez un historique
        clair de vos périodes. 1 an ingame correspond à 1 mois IRL.
      </p>
    </section>
  );
};
