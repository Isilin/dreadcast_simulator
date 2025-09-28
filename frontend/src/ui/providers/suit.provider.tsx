import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react';

import { useImplants } from '@/data/implant';
import { useRaces } from '@/data/race';
import {
  ImplantNameValues,
  ItemSpotValue,
  StatValues,
  type Gender,
  type ImplantName,
  type Item,
  type ItemSpot,
  type Kit,
  type Property,
  type Race,
  type Skill,
  type Stat,
} from '@/domain';

export interface KitSelection {
  kit: Kit;
  number: number;
}

export interface SuitPiece {
  item: Item | null;
  kits: Array<KitSelection>;
}

interface SuitState {
  race?: Race;
  gender?: Gender;
  head?: SuitPiece;
  chest?: SuitPiece;
  legs?: SuitPiece;
  feet?: SuitPiece;
  secondary?: SuitPiece;
  leftArm?: SuitPiece;
  rightArm?: SuitPiece;
  implantations?: Record<ImplantName, number>;
}

interface SuitActions {
  setRace: Dispatch<SetStateAction<Race | undefined>>;
  setGender: Dispatch<SetStateAction<Gender>>;
  setImplant: (implant: ImplantName, level: number) => void;
  setItem: (item: Item, spot: ItemSpot) => void;
  addKit: (spot: ItemSpot, kit: Kit, newKit?: boolean) => void;
  setKit: (spot: ItemSpot, kit: Kit, index: number) => void;
  removeKit: (spot: ItemSpot, index: number) => void;
  setKitNumber: (spot: ItemSpot, index: number, number: number) => void;
}

interface SuitSelectors {
  strength: number;
  agility: number;
  robustness: number;
  perception: number;
  stealth: number;
  computing: number;
  medicine: number;
  engineering: number;
  health: number;
  stamina: number;
  speed: number;
  race_damage: number;
  hit_rating: number;
  team_heal: number;
  cac_damage: number;
  critical_cac_chance: number;
  critical_cac_damages: number;
  hit_damages: number;
  critical_hit_damages: number;
  implantsCount: number;
}

type SuitContextValues = SuitState & SuitActions & SuitSelectors;

const SuitContext = createContext<SuitContextValues | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSuitContext = () => {
  const ctx = useContext(SuitContext);
  if (!ctx) throw new Error('SuitContext missing provider');
  return ctx;
};

interface ProviderProps {}

export const SuitProvider = ({
  children,
}: PropsWithChildren<ProviderProps>) => {
  const { data: races } = useRaces();
  const [race, setRace] = useState<Race | undefined>(undefined);
  useEffect(() => {
    if (races && race === undefined) {
      setRace(races.find((r) => r.type === 'Humain'));
    }
  }, [race, races]);

  const [gender, setGender] = useState<Gender>('male');

  const { data: implants } = useImplants();
  const [implantations, setImplantations] = useState<
    Record<ImplantName, number>
  >(
    ImplantNameValues.reduce(
      (acc, k) => {
        acc[k] = 0;
        return acc;
      },
      {} as Record<ImplantName, number>,
    ),
  );
  const setImplant = useCallback((implant: ImplantName, level: number) => {
    setImplantations((prev) => ({ ...prev, [implant]: level }));
  }, []);
  const implantsCount = useMemo(() => {
    return Object.entries(implantations).reduce(
      (acc, curr) => acc + curr[1],
      0,
    );
  }, [implantations]);

  const [items, setItems] = useState<Record<ItemSpot, SuitPiece>>({
    head: { item: null, kits: [] },
    chest: { item: null, kits: [] },
    legs: { item: null, kits: [] },
    feet: { item: null, kits: [] },
    secondary: { item: null, kits: [] },
    leftArm: { item: null, kits: [] },
    rightArm: { item: null, kits: [] },
  });

  const setItem = useCallback((item: Item, spot: ItemSpot) => {
    setItems((previous) => {
      let next = { ...previous };
      next[spot] = { item, kits: previous[spot].kits };

      const other = spot === 'leftArm' ? 'rightArm' : 'leftArm';
      if (
        (spot === 'leftArm' || spot === 'rightArm') &&
        item.hands &&
        item.hands > 1
      ) {
        next[other] = next[spot];
      } else if (
        (spot === 'leftArm' || spot === 'rightArm') &&
        previous[spot].item?.hands &&
        previous[spot].item.hands > 1
      ) {
        next[other] = { ...next[spot], item: null };
      }
      return next;
    });
  }, []);

  const getStat = useCallback(
    (stat: Stat) => {
      return (
        (race?.[stat as Skill] || 0) +
        (implants
          ?.filter((i) => i.attributes.includes(stat))
          .reduce((acc, k) => {
            const curr = implantations[k.name] - 1;
            return acc + (curr === -1 ? 0 : k.valuePerLevel[curr]);
          }, 0) || 0) +
        (ItemSpotValue.reduce((acc, k) => {
          const curr =
            items[k]?.item?.effects?.find(
              (val) => val?.property === (stat as Property),
            )?.value || 0;
          const kitsCurr = items[k]?.kits.reduce((kitAcc, kitCurr) => {
            return (
              kitAcc +
              kitCurr.kit.effects.reduce((effAcc, effCurr) => {
                if (effCurr.property === (stat as Property)) {
                  return effAcc + effCurr.value * kitCurr.number;
                }
                return effAcc;
              }, 0)
            );
          }, 0);

          return acc + curr + kitsCurr;
        }, 0) || 0) -
        (items['leftArm']?.item?.hands && items['leftArm']?.item?.hands > 1
          ? items['rightArm']?.item?.effects?.find(
              (val) => val?.property === (stat as Property),
            )?.value || 0
          : 0)
      );
    },
    [implantations, implants, items, race],
  );
  const stats = useMemo(
    () =>
      StatValues.reduce(
        (acc, s) => {
          acc[s] = getStat(s);
          return acc;
        },
        {} as Record<Stat, number>,
      ),
    [getStat],
  );

  const addKit = useCallback((spot: ItemSpot, kit: Kit, newKit?: boolean) => {
    setItems((previous) => {
      const slot = previous[spot];
      const existingIndex = slot.kits.findIndex((k) => k.kit.id === kit.id);

      let kits: typeof slot.kits;
      if (!newKit && existingIndex !== -1) {
        kits = slot.kits.map((k, i) =>
          i === existingIndex ? { ...k, number: k.number + 1 } : k,
        );
      } else {
        kits = [...slot.kits, { kit, number: 1 }];
      }

      return { ...previous, [spot]: { ...slot, kits } };
    });
  }, []);

  const setKit = useCallback((spot: ItemSpot, kit: Kit, index: number) => {
    setItems((previous) => {
      const slot = previous[spot];
      if (!slot || slot.kits.length <= index) return previous;

      const kits = slot.kits.map((k, i) => (i === index ? { ...k, kit } : k));

      return { ...previous, [spot]: { ...slot, kits } };
    });
  }, []);

  const removeKit = useCallback((spot: ItemSpot, index: number) => {
    setItems((previous) => {
      const slot = previous[spot];
      if (!slot || index < 0 || index >= slot.kits.length) return previous;

      const target = slot.kits[index];
      let kits: typeof slot.kits;

      if (target.number > 1) {
        kits = slot.kits.map((k, i) =>
          i === index ? { ...k, number: k.number - 1 } : k,
        );
      } else {
        kits = slot.kits.filter((_, i) => i !== index);
      }
      return {
        ...previous,
        [spot]: { ...slot, kits },
      };
    });
  }, []);

  const setKitNumber = useCallback(
    (spot: ItemSpot, index: number, number: number) => {
      setItems((previous) => {
        const slot = previous[spot];
        if (!slot || slot.kits.length <= index) return previous;

        const kits = slot.kits.map((k, i) =>
          i === index ? { ...k, number } : k,
        );

        return { ...previous, [spot]: { ...slot, kits } };
      });
    },
    [],
  );

  return (
    <SuitContext.Provider
      value={{
        race,
        setRace,
        gender,
        setGender,
        ...stats,
        implantations,
        setImplant,
        implantsCount,
        ...items,
        setItem,
        addKit,
        setKit,
        removeKit,
        setKitNumber,
      }}
    >
      {children}
    </SuitContext.Provider>
  );
};
