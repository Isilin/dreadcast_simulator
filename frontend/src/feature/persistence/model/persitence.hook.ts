import { useEffect, useMemo, useRef, useState } from 'react';

import type { BuildSnapshot } from '../services/persistence.service';
import {
  DEFAULT_SLOTS,
  readBuilds,
  restoreItems,
  restoreKits,
  serializeItems,
  serializeKits,
  writeBuilds,
} from '../services/persistence.service';

import type { DrugsState } from '@/feature/drug';
import { initialState as drugsInitialState } from '@/feature/drug/model/drug.actions';
import type { ImplantsState } from '@/feature/implant';
import { initialState as implantsInitialState } from '@/feature/implant/model/implant.actions';
import type { Item, ItemsState } from '@/feature/item';
import { initialState as itemsInitialState } from '@/feature/item/model/item.actions';
import type { Kit, KitsState } from '@/feature/kit';
import { initialState as kitsInitialState } from '@/feature/kit/model/kit.actions';
import type { ProfileState } from '@/feature/profile';
import { initialState as profileInitialState } from '@/feature/profile/model/profile.actions';

interface HookParams {
  profile: ProfileState;
  implants: ImplantsState;
  items: ItemsState;
  kits: KitsState;
  drug: DrugsState;
  allItems: Item[] | undefined;
  allKits: Kit[] | undefined;
  profileDispatch: { replaceProfile: (profile: ProfileState) => void };
  implantsDispatch: { replaceImplants: (implants: ImplantsState) => void };
  itemsDispatch: { replaceItems: (items: ItemsState) => void };
  kitsDispatch: { replaceKits: (kits: KitsState) => void };
  drugsDispatch: { replaceDrug: (state: DrugsState) => void };
}

export function useBuildPersistence({
  profile,
  implants,
  items,
  kits,
  drug,
  allItems,
  allKits,
  profileDispatch,
  implantsDispatch,
  itemsDispatch,
  kitsDispatch,
  drugsDispatch,
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
    if (!allItems || !allKits) return;
    isRestoringRef.current = true;
    const b = readBuilds()[active];
    if (b) {
      profileDispatch.replaceProfile(b.profile);
      implantsDispatch.replaceImplants(b.implants);
      itemsDispatch.replaceItems(restoreItems(b.items, allItems));
      kitsDispatch.replaceKits(restoreKits(b.kits, allKits));
      drugsDispatch.replaceDrug(b.drug ?? drugsInitialState);
    } else {
      profileDispatch.replaceProfile(profileInitialState);
      implantsDispatch.replaceImplants(implantsInitialState);
      itemsDispatch.replaceItems(itemsInitialState);
      kitsDispatch.replaceKits(kitsInitialState);
      drugsDispatch.replaceDrug(drugsInitialState);
    }
    setTimeout(() => {
      isRestoringRef.current = false;
    }, 0);
  }, [
    active,
    allItems,
    allKits,
    drugsDispatch,
    implantsDispatch,
    itemsDispatch,
    kitsDispatch,
    profileDispatch,
  ]);

  useEffect(() => {
    if (isRestoringRef.current) return;
    const saved = readBuilds()[active] as BuildSnapshot | undefined;
    const serializedItems = serializeItems(items);
    const serializedKits = serializeKits(kits);
    const savedComparable = saved
      ? JSON.stringify({
          profile: saved.profile,
          implants: saved.implants,
          items: saved.items,
          kits: saved.kits,
          drug: saved.drug,
        })
      : null;
    const currentComparable = JSON.stringify({
      profile,
      implants,
      items: serializedItems,
      kits: serializedKits,
      drug,
    });
    if (savedComparable === currentComparable) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const toWrite: BuildSnapshot = {
        profile,
        implants,
        items: serializedItems,
        kits: serializedKits,
        drug,
        savedAt: Date.now(),
      };
      const next = { ...readBuilds(), [active]: toWrite };
      writeBuilds(next);
      setBuilds(next);
    }, 250);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [active, drug, implants, items, kits, profile]);

  return { active, setActive, builds, slots };
}
