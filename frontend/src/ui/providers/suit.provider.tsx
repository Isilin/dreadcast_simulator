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
import { ItemSpotValue, type Gender, type Race, type Skill } from '@/domain';
import {
  StatValues,
  useImplants,
  useImplantsState,
  type Stat,
} from '@/feature/implant';
import { useItemsEffect, useItemsState } from '@/feature/item';
import { useKitsState } from '@/feature/kit';

interface SuitState {
  race?: Race;
  gender?: Gender;
}

interface SuitActions {
  setRace: Dispatch<SetStateAction<Race | undefined>>;
  setGender: Dispatch<SetStateAction<Gender>>;
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

  const items = useItemsState();

  const { data: implants } = useImplants();
  const implantations = useImplantsState();

  const itemEffects = useItemsEffect();
  const kits = useKitsState();

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
          ? items['rightArm']?.effects?.find((val) => val?.property === stat)
              ?.value || 0
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

  return (
    <SuitContext.Provider
      value={{
        race,
        setRace,
        gender,
        setGender,
        ...stats,
      }}
    >
      {children}
    </SuitContext.Provider>
  );
};
