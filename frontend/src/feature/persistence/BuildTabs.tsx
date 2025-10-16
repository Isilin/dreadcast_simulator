import { Tabs } from '@base-ui-components/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { ItemSpot } from '@/domain';
import { ItemSpotValue } from '@/domain';
import type { ImplantName } from '@/feature/implant';
import { useImplantsDispatch, useImplantsState } from '@/feature/implant';
import { ImplantNameValues } from '@/feature/implant/model/implant.types';
import type { Item } from '@/feature/item';
import { useItemsDispatch, useItemsState } from '@/feature/item';
import { useKitsDispatch, useKitsState } from '@/feature/kit';
import type { KitSelection } from '@/feature/kit/model/kit.types';
import type { Gender, RaceType } from '@/feature/profile';
import { usePRofileDispatch, useProfileState } from '@/feature/profile';

const BUILDS_KEY = 'dreadcast.builds.v1';
const DEFAULT_SLOTS = 10;

interface BuildSnapshot {
  profile: unknown;
  implants: unknown;
  items: unknown;
  kits: unknown;
  savedAt?: number;
}

const readBuilds = (): Record<string, BuildSnapshot> => {
  try {
    const raw = localStorage.getItem(BUILDS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, BuildSnapshot>;
  } catch {
    return {};
  }
};

const writeBuilds = (s: Record<string, BuildSnapshot>) =>
  localStorage.setItem(BUILDS_KEY, JSON.stringify(s));

export const BuildTabs = () => {
  const profile = useProfileState();
  const profileDispatch = usePRofileDispatch();

  const implants = useImplantsState();
  const implantsDispatch = useImplantsDispatch();

  const items = useItemsState();
  const itemsDispatch = useItemsDispatch();

  const kits = useKitsState();
  const kitsDispatch = useKitsDispatch();

  const [active, setActive] = useState<string>('1');
  const [builds, setBuilds] = useState<Record<string, BuildSnapshot>>({});

  useEffect(() => {
    setBuilds(readBuilds());
  }, []);

  const slots = useMemo(() => {
    const arr: string[] = [];
    for (let i = 1; i <= DEFAULT_SLOTS; i++) arr.push(String(i));
    return arr;
  }, []);

  // Prevent auto-save during restore
  const isRestoringRef = useRef(false);

  // Restore state when active tab changes
  useEffect(() => {
    isRestoringRef.current = true;
    const b = readBuilds()[active];
    if (b) {
      const data = b as BuildSnapshot;
      const prof = data.profile as Record<string, unknown> | undefined;
      if (prof) {
        const g = prof.gender as Gender | undefined;
        const r = prof.race as RaceType | undefined;
        if (g && r) {
          profileDispatch.replaceProfile({ gender: g, race: r });
        }
      }
      const imps = data.implants as Record<ImplantName, number> | undefined;
      if (imps) {
        implantsDispatch.replaceImplants(imps);
      }
      const its = data.items as Record<ItemSpot, Item | null> | undefined;
      if (its) {
        itemsDispatch.replaceItems(its);
      }
      const kts = data.kits as Record<ItemSpot, KitSelection[]> | undefined;
      if (kts) {
        kitsDispatch.replaceKits(kts);
      }
    } else {
      // Restore initial empty state if no build exists for this slot
      profileDispatch.replaceProfile({ gender: 'male', race: 'Humain' });
      implantsDispatch.replaceImplants(
        Object.fromEntries(
          ImplantNameValues.map((name) => [name, 0]),
        ) as unknown as Record<ImplantName, number>,
      );
      itemsDispatch.replaceItems(
        Object.fromEntries(
          ItemSpotValue.map((spot) => [spot, null]),
        ) as unknown as Record<ItemSpot, Item | null>,
      );
      kitsDispatch.replaceKits(
        Object.fromEntries(
          ItemSpotValue.map((spot) => [spot, []]),
        ) as unknown as Record<ItemSpot, KitSelection[]>,
      );
    }
    // Release flag after restore
    setTimeout(() => {
      isRestoringRef.current = false;
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Auto-save when state changes, but only if not restoring
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    if (isRestoringRef.current) return;

    const saved = readBuilds()[active] as BuildSnapshot | undefined;
    const snapshot: BuildSnapshot = {
      profile,
      implants,
      items,
      kits,
      // don't include savedAt in equality check
    };

    const savedComparable = saved
      ? JSON.stringify({
          profile: saved.profile,
          implants: saved.implants,
          items: saved.items,
          kits: saved.kits,
        })
      : null;
    const currentComparable = JSON.stringify({
      profile: snapshot.profile,
      implants: snapshot.implants,
      items: snapshot.items,
      kits: snapshot.kits,
    });

    // If nothing changed compared to saved slot, don't write
    if (savedComparable === currentComparable) return;

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const toWrite: BuildSnapshot = {
        ...snapshot,
        savedAt: Date.now(),
      };
      const next = { ...readBuilds(), [active]: toWrite };
      writeBuilds(next);
      setBuilds(next);
    }, 250);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [active, implants, items, kits, profile]);

  return (
    <div
      style={{
        position: 'fixed',
        insetInline: 0,
        bottom: 0,
        background: 'var(--color-bg)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
        zIndex: 20,
      }}
    >
      <Tabs.Root value={active} onValueChange={(v: string) => setActive(v)}>
        <Tabs.List
          style={{
            display: 'flex',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 12,
            background: 'var(--color-panel)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          {slots.map((s) => (
            <Tabs.Tab
              key={s}
              value={s}
              style={{
                padding: '6px 18px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: 1,
                background:
                  active === s
                    ? 'var(--color-gray-100)'
                    : 'var(--color-gray-300)',
                color:
                  active === s
                    ? 'var(--color-on-primary)'
                    : 'var(--color-text)',
                boxShadow:
                  active === s ? '0 12px 32px rgba(0, 0, 0, 0.35)' : 'none',
                border:
                  active === s
                    ? '2px solid var(--color-primary-dark)'
                    : '2px solid transparent',
                transition: 'all 0.18s',
                cursor: 'pointer',
                outline:
                  active === s ? '2px solid var(--color-primary-dark)' : 'none',
              }}
            >
              {s}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {slots.map((s) => (
          <Tabs.Panel key={s} value={s}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '8px 16px',
                fontSize: 13,
                color: 'var(--color-text-secondary)',
              }}
            >
              {builds[s]?.savedAt ? (
                new Date(builds[s].savedAt).toLocaleString()
              ) : (
                <span style={{ opacity: 0.5 }}>Empty</span>
              )}
            </div>
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  );
};

export default BuildTabs;
