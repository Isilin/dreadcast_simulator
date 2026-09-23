import { Link } from '@tanstack/react-router';
import { useId, useMemo, useState } from 'react';

import styles from './AdvancedFilters.module.css';
import type { CommunityFilters } from '../../model';

import { StatValues, type Stat } from '@/domain';
import { useDrugs } from '@/feature/drug';
import { useImplants } from '@/feature/implant';
import { useItems } from '@/feature/item';
import Routes from '@/utils/routes';

interface AdvancedFiltersProps {
  filters: CommunityFilters;
  onChange: (changes: Partial<CommunityFilters>) => void;
  isSubscriber: boolean;
}

/**
 * Filters reading the publication content: stat thresholds, implants, drug,
 * equipment and favorites. Subscribers only.
 */
export const AdvancedFilters = ({
  filters,
  onChange,
  isSubscriber,
}: AdvancedFiltersProps) => {
  if (!isSubscriber) {
    return (
      <section className={styles.locked} aria-label="Filtres avancés">
        <p className={styles.title}>Filtres avancés</p>
        <p className={styles.muted}>
          Seuils de statistiques, implants, drogue, équipement précis et favoris
          sont réservés aux abonnés.
        </p>
        <Link to={Routes.subscription} className={styles.link}>
          Voir les abonnements
        </Link>
      </section>
    );
  }

  return <SubscriberAdvancedFilters filters={filters} onChange={onChange} />;
};

const STAT_KEYS = Object.keys(StatValues) as Stat[];

const SubscriberAdvancedFilters = ({
  filters,
  onChange,
}: Omit<AdvancedFiltersProps, 'isSubscriber'>) => {
  const idPrefix = useId();
  const { data: implants = [] } = useImplants();
  const { data: drugs = [] } = useDrugs();
  const { data: items = [] } = useItems();
  const [statDraft, setStatDraft] = useState<Stat>('medicine');
  const [thresholdDraft, setThresholdDraft] = useState('');
  const [itemDraft, setItemDraft] = useState('');

  const itemNames = useMemo(
    () => new Map(items.map((item) => [item.id, item.name])),
    [items],
  );
  const drugNames = useMemo(
    () => new Map(drugs.map((drug) => [drug.id, drug.name])),
    [drugs],
  );

  const addThreshold = () => {
    const threshold = Number(thresholdDraft);
    if (!thresholdDraft || !Number.isFinite(threshold)) return;
    onChange({ minStats: { ...filters.minStats, [statDraft]: threshold } });
    setThresholdDraft('');
  };

  const removeThreshold = (stat: Stat) => {
    const next = { ...filters.minStats };
    delete next[stat];
    onChange({ minStats: next });
  };

  const addItem = (name: string) => {
    const item = items.find(
      (candidate) => candidate.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (!item || filters.items.includes(item.id)) return;
    onChange({ items: [...filters.items, item.id] });
    setItemDraft('');
  };

  return (
    <section className={styles.advanced} aria-label="Filtres avancés">
      <p className={styles.title}>Filtres avancés</p>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={filters.favoritesOnly}
          onChange={(event) =>
            onChange({ favoritesOnly: event.target.checked })
          }
        />
        Mes favoris uniquement
      </label>

      <div className={styles.group}>
        <span className={styles.label}>Seuils de statistiques</span>
        <div className={styles.row}>
          <select
            aria-label="Statistique"
            className={styles.input}
            value={statDraft}
            onChange={(event) => setStatDraft(event.target.value as Stat)}
          >
            {STAT_KEYS.map((stat) => (
              <option key={stat} value={stat}>
                {StatValues[stat].tag} · {StatValues[stat].label}
              </option>
            ))}
          </select>
          <input
            aria-label="Valeur minimale"
            type="number"
            inputMode="numeric"
            className={styles.number}
            placeholder="≥"
            value={thresholdDraft}
            onChange={(event) => setThresholdDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addThreshold();
              }
            }}
          />
          <button type="button" className={styles.add} onClick={addThreshold}>
            Ajouter
          </button>
        </div>
        <ul className={styles.tags}>
          {STAT_KEYS.filter((stat) => filters.minStats[stat] !== undefined).map(
            (stat) => (
              <li key={stat}>
                <button
                  type="button"
                  className={styles.tag}
                  onClick={() => removeThreshold(stat)}
                  aria-label={`Retirer le seuil ${StatValues[stat].label}`}
                >
                  {StatValues[stat].tag} ≥ {filters.minStats[stat]} ✕
                </button>
              </li>
            ),
          )}
        </ul>
      </div>

      <div className={styles.group}>
        <label htmlFor={`${idPrefix}-implant`} className={styles.label}>
          Implants utilisés
        </label>
        <select
          id={`${idPrefix}-implant`}
          className={styles.input}
          value=""
          onChange={(event) => {
            const name = event.target.value;
            if (name && !filters.implants.includes(name)) {
              onChange({ implants: [...filters.implants, name] });
            }
          }}
        >
          <option value="">Ajouter un implant…</option>
          {implants.map((implant) => (
            <option key={implant.name} value={implant.name}>
              {implant.name}
            </option>
          ))}
        </select>
        <ul className={styles.tags}>
          {filters.implants.map((name) => (
            <li key={name}>
              <button
                type="button"
                className={styles.tag}
                onClick={() =>
                  onChange({
                    implants: filters.implants.filter(
                      (entry) => entry !== name,
                    ),
                  })
                }
                aria-label={`Retirer l'implant ${name}`}
              >
                {name} ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.group}>
        <label htmlFor={`${idPrefix}-drug`} className={styles.label}>
          Drogue
        </label>
        <select
          id={`${idPrefix}-drug`}
          className={styles.input}
          value=""
          onChange={(event) => {
            const id = event.target.value;
            if (id && !filters.drugs.includes(id)) {
              onChange({ drugs: [...filters.drugs, id] });
            }
          }}
        >
          <option value="">Ajouter une drogue…</option>
          {drugs.map((drug) => (
            <option key={drug.id} value={drug.id}>
              {drug.name}
            </option>
          ))}
        </select>
        <ul className={styles.tags}>
          {filters.drugs.map((id) => (
            <li key={id}>
              <button
                type="button"
                className={styles.tag}
                onClick={() =>
                  onChange({
                    drugs: filters.drugs.filter((entry) => entry !== id),
                  })
                }
                aria-label={`Retirer la drogue ${drugNames.get(id) ?? id}`}
              >
                {drugNames.get(id) ?? id} ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.group}>
        <label htmlFor={`${idPrefix}-item`} className={styles.label}>
          Équipement précis
        </label>
        <input
          id={`${idPrefix}-item`}
          className={styles.input}
          list={`${idPrefix}-items`}
          placeholder="Nom de l'objet"
          value={itemDraft}
          onChange={(event) => {
            setItemDraft(event.target.value);
            if (itemNames.size > 0) addItem(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addItem(itemDraft);
            }
          }}
        />
        <datalist id={`${idPrefix}-items`}>
          {items.map((item) => (
            <option key={item.id} value={item.name} />
          ))}
        </datalist>
        <ul className={styles.tags}>
          {filters.items.map((id) => (
            <li key={id}>
              <button
                type="button"
                className={styles.tag}
                onClick={() =>
                  onChange({
                    items: filters.items.filter((entry) => entry !== id),
                  })
                }
                aria-label={`Retirer ${itemNames.get(id) ?? id}`}
              >
                {itemNames.get(id) ?? id} ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
