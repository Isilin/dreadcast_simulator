import type {
  Drug,
  Implant,
  Item,
  Kit,
  Race,
  Title,
} from './catalog.schema.js';

/** Public reference data (no session). */
export interface CatalogRepo {
  readonly items: () => Promise<ReadonlyArray<Item>>;
  readonly kits: () => Promise<ReadonlyArray<Kit>>;
  readonly implants: () => Promise<ReadonlyArray<Implant>>;
  readonly races: () => Promise<ReadonlyArray<Race>>;
  readonly titles: () => Promise<ReadonlyArray<Title>>;
  readonly drugs: () => Promise<ReadonlyArray<Drug>>;
  /** Fails with PGRST116 when the drug does not exist. */
  readonly drug: (id: string) => Promise<Drug>;
}
