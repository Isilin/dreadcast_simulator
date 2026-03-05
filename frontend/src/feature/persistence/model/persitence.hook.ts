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

import {
  useDrugStore,
  initialState as drugsInitialState,
} from '@/feature/drug/model/drug.store';
import {
  useImplantStore,
  initialState as implantsInitialState,
} from '@/feature/implant/model/implant.store';
import type { Item } from '@/feature/item';
import {
  useItemStore,
  initialState as itemsInitialState,
} from '@/feature/item/model/item.store';
import type { Kit } from '@/feature/kit';
import {
  useKitStore,
  initialState as kitsInitialState,
} from '@/feature/kit/model/kit.store';
import {
  useProfileStore,
  initialState as profileInitialState,
} from '@/feature/profile/model/profile.store';

interface HookParams {
  allItems: Item[] | undefined;
  allKits: Kit[] | undefined;
}

export function useBuildPersistence({ allItems, allKits }: HookParams) {
  const [active, setActive] = useState<string>('1');
  const [builds, setBuilds] = useState<Record<string, BuildSnapshot>>({});
  const isRestoringRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const activeRef = useRef(active);
  // Keep a mutable ref so the stable subscribe callback always reads the latest active slot
  activeRef.current = active;

  useEffect(() => {
    setBuilds(readBuilds());
  }, []);

  const slots = useMemo(() => {
    const arr: string[] = [];
    for (let i = 1; i <= DEFAULT_SLOTS; i++) arr.push(String(i));
    return arr;
  }, []);

  // Restore a build when the active slot or loaded data changes
  useEffect(() => {
    if (!allItems || !allKits) return;
    isRestoringRef.current = true;
    const b = readBuilds()[active];
    if (b) {
      useProfileStore.getState().replaceProfile(b.profile);
      useImplantStore.getState().replaceImplants(b.implants);
      useItemStore.getState().replaceItems(restoreItems(b.items, allItems));
      useKitStore.getState().replaceKits(restoreKits(b.kits, allKits));
      useDrugStore.getState().replaceDrug(b.drug ?? drugsInitialState);
    } else {
      useProfileStore.getState().replaceProfile(profileInitialState);
      useImplantStore.getState().replaceImplants(implantsInitialState);
      useItemStore.getState().replaceItems(itemsInitialState);
      useKitStore.getState().replaceKits(kitsInitialState);
      useDrugStore.getState().replaceDrug(drugsInitialState);
    }
    setTimeout(() => {
      isRestoringRef.current = false;
    }, 0);
  }, [active, allItems, allKits]);

  // Auto-save whenever any feature store changes (debounced)
  useEffect(() => {
    const doSave = () => {
      if (isRestoringRef.current) return;
      const profile = useProfileStore.getState().profile;
      const implants = useImplantStore.getState().implants;
      const items = useItemStore.getState().items;
      const kits = useKitStore.getState().kits;
      const drug = useDrugStore.getState().drug;
      const current = activeRef.current;

      const saved = readBuilds()[current] as BuildSnapshot | undefined;
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
        const next = { ...readBuilds(), [current]: toWrite };
        writeBuilds(next);
        setBuilds(next);
      }, 250);
    };

    const unsubscribers = [
      useProfileStore.subscribe(doSave),
      useImplantStore.subscribe(doSave),
      useItemStore.subscribe(doSave),
      useKitStore.subscribe(doSave),
      useDrugStore.subscribe(doSave),
    ];

    return () => {
      unsubscribers.forEach((fn) => fn());
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return { active, setActive, builds, slots };
}
