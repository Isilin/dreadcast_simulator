import { Tabs } from '@base-ui-components/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import kesslerLogo from '@/assets/kessler.png';
import kofiLogo from '@/assets/kofi.png';
import vertigoLogo from '@/assets/vertigo.png';
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
import { UiImage } from '@/ui/UiImage/UiImage';

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
      {/* Top-right icon bar */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          display: 'flex',
          gap: 8,
          zIndex: 40,
        }}
      >
        <a
          href="https://www.dreadcast.net/Forum/2-157189-k24---essler-industries?1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Support on Ko-fi"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            color: 'var(--text)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <UiImage
            width={174}
            height={48}
            src={kesslerLogo}
            alt={'Logo Kessler'}
          />
        </a>

        <a
          href="https://www.dreadcast.net/Forum/2-155085--le-vertigo-?1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Support on Ko-fi"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            color: 'var(--text)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <UiImage
            width={87}
            height={48}
            src={vertigoLogo}
            alt={'Logo Vertigo'}
          />
        </a>

        <a
          href="https://github.com/Isilin/dreadcast_simulator"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open project on GitHub"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 8,
            color: 'var(--text)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.699-2.782.604-3.369-1.342-3.369-1.342-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.607.069-.607 1.004.071 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.111-4.555-4.945 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.648 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.202 2.395.099 2.648.64.698 1.03 1.591 1.03 2.682 0 3.842-2.338 4.688-4.567 4.936.359.309.679.92.679 1.855 0 1.338-.012 2.419-.012 2.749 0 .269.18.58.688.482C19.136 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              fill="currentColor"
            />
          </svg>
        </a>

        <a
          href="https://ko-fi.com/isilin"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Support on Ko-fi"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            color: 'var(--text)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <UiImage width={60} height={48} src={kofiLogo} alt={'Logo Ko-fi'} />
        </a>
      </div>
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
