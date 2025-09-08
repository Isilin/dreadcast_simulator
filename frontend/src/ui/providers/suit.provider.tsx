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

import type { Gender } from '@/data/gender';
import { useImplants } from '@/data/implant/implant.queries';
import { useRaces } from '@/data/race/race.queries';
import { ImplantNameValues, type ImplantName } from '@/domain/implant';
import type { Item } from '@/domain/item';
import type { Kit } from '@/domain/kit';
import type { Race } from '@/domain/race';
import { StatValues, type Skill, type Stat } from '@/domain/skill';

interface SuitPiece {
  item: Item;
  kits: Kit[];
}

interface SuitState {
  race?: Race;
  gender?: Gender;
  head?: SuitPiece;
  chest?: SuitPiece;
  legs?: SuitPiece;
  feet?: SuitPiece;
  secondary?: SuitPiece;
  implantations?: Record<ImplantName, number>;
}

interface SuitActions {
  setRace: Dispatch<SetStateAction<Race | undefined>>;
  setGender: Dispatch<SetStateAction<Gender>>;
  setImplant: (implant: ImplantName, level: number) => void;
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

  const getStat = useCallback(
    (stat: Stat) => {
      return (
        (race?.[stat as Skill] || 0) +
        (implants
          ?.filter((i) => i.attributes.includes(stat))
          .reduce((acc, k) => {
            const curr = implantations[k.name] - 1;
            return acc + (curr === -1 ? 0 : k.valuePerLevel[curr]);
          }, 0) || 0)
      );
    },
    [implantations, implants, race],
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
        implantations,
        setImplant,
      }}
    >
      {children}
    </SuitContext.Provider>
  );
};
