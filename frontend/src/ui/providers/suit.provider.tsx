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

import { useRaces } from '@/data/race';
import type { Gender, Kit, Race, Skill } from '@/domain';
import { ItemSpotValue, type ItemSpot } from '@/domain/suit';
import {
  StatValues,
  useImplants,
  useImplantsState,
  type Stat,
} from '@/feature/implant';
import { useItemsEffect, useItemsState } from '@/feature/item';

export interface KitSelection {
  kit: Kit;
  number: number;
}

interface SuitState {
  race?: Race;
  gender?: Gender;
  head?: KitSelection[];
  chest?: KitSelection[];
  legs?: KitSelection[];
  feet?: KitSelection[];
  secondary?: KitSelection[];
  leftArm?: KitSelection[];
  rightArm?: KitSelection[];
}

interface SuitActions {
  setRace: Dispatch<SetStateAction<Race | undefined>>;
  setGender: Dispatch<SetStateAction<Gender>>;
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

  const [kits, setKits] = useState<Record<ItemSpot, KitSelection[]>>({
    head: [],
    chest: [],
    legs: [],
    feet: [],
    secondary: [],
    leftArm: [],
    rightArm: [],
  });

  const items = useItemsState();

  const { data: implants } = useImplants();
  const implantations = useImplantsState();

  const itemEffects = useItemsEffect();

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
        (itemEffects[stat] || 0) +
        (ItemSpotValue.reduce((acc, k) => {
          const kitsCurr =
            kits[k].reduce((kitAcc, kitCurr) => {
              return (
                kitAcc +
                kitCurr.kit.effects.reduce(
                  (effAcc, effCurr) =>
                    effAcc +
                    (effCurr.property === stat
                      ? effCurr.value * kitCurr.number
                      : 0),
                  0,
                )
              );
            }, 0) || 0;

          return acc + kitsCurr;
        }, 0) || 0) -
        (items['leftArm']?.hands && items['leftArm']?.hands > 1
          ? items['rightArm']?.effects?.find(
              (val) => val?.property === (stat as Stat),
            )?.value || 0
          : 0)
      );
    },
    [implantations, implants, itemEffects, items, kits, race],
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
    setKits((previous) => {
      const slot = previous[spot];
      const existingIndex = slot.findIndex?.((k) => k.kit.id === kit.id);

      let kits: KitSelection[];
      if (!newKit && existingIndex !== -1) {
        kits = slot.map?.((k, i) =>
          i === existingIndex ? { ...k, number: k.number + 1 } : k,
        );
      } else {
        kits = [...slot, { kit, number: 1 }];
      }

      return { ...previous, [spot]: kits };
    });
  }, []);

  const setKit = useCallback((spot: ItemSpot, kit: Kit, index: number) => {
    setKits((previous) => {
      const slot = previous[spot];
      if (!slot || slot.length <= index) return previous;

      const kits = slot.map?.((k, i) => (i === index ? { ...k, kit } : k));

      return { ...previous, [spot]: kits };
    });
  }, []);

  const removeKit = useCallback((spot: ItemSpot, index: number) => {
    setKits((previous) => {
      const slot = previous[spot];
      if (!slot || index < 0 || index >= slot.length) return previous;

      const target = slot[index];
      let kits: typeof slot;

      if (target.number > 1) {
        kits = slot.map?.((k, i) =>
          i === index ? { ...k, number: k.number - 1 } : k,
        );
      } else {
        kits = slot.filter?.((_, i) => i !== index);
      }
      return {
        ...previous,
        [spot]: kits,
      };
    });
  }, []);

  const setKitNumber = useCallback(
    (spot: ItemSpot, index: number, number: number) => {
      setKits((previous) => {
        const slot = previous[spot];
        if (!slot || slot.length <= index) return previous;

        const kits = slot.map((k, i) => (i === index ? { ...k, number } : k));

        return { ...previous, [spot]: kits };
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
        ...kits,
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
