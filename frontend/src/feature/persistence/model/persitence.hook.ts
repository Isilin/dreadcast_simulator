import { useEffect, useMemo, useRef, useState } from 'react';

import type { BuildSnapshot } from '../services/persistence.service';
import {
  DEFAULT_SLOTS,
  readBuilds,
  writeBuilds,
} from '../services/persistence.service';

import type { ImplantsState } from '@/feature/implant';
import { initialState as implantsInitialState } from '@/feature/implant/model/implant.actions';
import type { ItemsState } from '@/feature/item';
import { initialState as itemsInitialState } from '@/feature/item/model/item.actions';
import type { KitsState } from '@/feature/kit';
import { initialState as kitsInitialState } from '@/feature/kit/model/kit.actions';
import type { ProfileState } from '@/feature/profile';
import { initialState as profileInitialState } from '@/feature/profile/model/profile.actions';

interface HookParams {
  profile: ProfileState;
  implants: ImplantsState;
  items: ItemsState;
  kits: KitsState;
  profileDispatch: { replaceProfile: (profile: ProfileState) => void };
  implantsDispatch: { replaceImplants: (implants: ImplantsState) => void };
  itemsDispatch: { replaceItems: (items: ItemsState) => void };
  kitsDispatch: { replaceKits: (kits: KitsState) => void };
}

export function useBuildPersistence({
  profile,
  implants,
  items,
  kits,
  profileDispatch,
  implantsDispatch,
  itemsDispatch,
  kitsDispatch,
}: HookParams) {
  const [active, setActive] = useState<string>('1');
  const [builds, setBuilds] = useState<Record<string, BuildSnapshot>>({});
  const isRestoringRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setBuilds(readBuilds());
  }, []);

  const slots = useMemo(() => {
    const arr: string[] = [];
    for (let i = 1; i <= DEFAULT_SLOTS; i++) arr.push(String(i));
    return arr;
  }, []);

  useEffect(() => {
    isRestoringRef.current = true;
    const b = readBuilds()[active];
    if (b) {
      const data = b as BuildSnapshot;
      profileDispatch.replaceProfile(data.profile as ProfileState);
      implantsDispatch.replaceImplants(data.implants as ImplantsState);
      itemsDispatch.replaceItems(data.items as ItemsState);
      kitsDispatch.replaceKits(data.kits as KitsState);
    } else {
      // Reset to initial state for empty build slots
      profileDispatch.replaceProfile(profileInitialState);
      implantsDispatch.replaceImplants(implantsInitialState);
      itemsDispatch.replaceItems(itemsInitialState);
      kitsDispatch.replaceKits(kitsInitialState);
    }
    setTimeout(() => {
      isRestoringRef.current = false;
    }, 0);
  }, [active, implantsDispatch, itemsDispatch, kitsDispatch, profileDispatch]);

  useEffect(() => {
    if (isRestoringRef.current) return;
    const saved = readBuilds()[active] as BuildSnapshot | undefined;
    const snapshot: BuildSnapshot = {
      profile,
      implants,
      items,
      kits,
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

  return { active, setActive, builds, slots };
}
