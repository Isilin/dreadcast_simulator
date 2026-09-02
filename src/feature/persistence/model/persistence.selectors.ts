import type {
  BuildSnapshot,
  BuildStorageMode,
} from '../services/persistence.service';
import {
  AUTHENTICATED_FREE_SLOTS,
  GUEST_SLOTS,
  getDefaultBuildName,
} from '../services/persistence.service';

interface SubscriptionState {
  status: 'pending' | 'validated';
  endsAt: string;
}

export const hasValidSubscription = (
  subscriptions: ReadonlyArray<SubscriptionState>,
  now = Date.now(),
): boolean =>
  subscriptions.some((subscription) => {
    if (subscription.status !== 'validated') return false;
    const endTimestamp = new Date(subscription.endsAt).getTime();
    return Number.isFinite(endTimestamp) && endTimestamp >= now;
  });

interface GetBuildSlotsParams {
  mode: BuildStorageMode;
  hasUnlimitedSlots: boolean;
  builds: Record<string, BuildSnapshot>;
}

export const getBuildSlots = ({
  mode,
  hasUnlimitedSlots,
  builds,
}: GetBuildSlotsParams): string[] => {
  if (mode === 'local' || !hasUnlimitedSlots) {
    const slotCount = mode === 'local' ? GUEST_SLOTS : AUTHENTICATED_FREE_SLOTS;
    return Array.from({ length: slotCount }, (_, index) => String(index + 1));
  }

  const existingSlotNumbers = Object.keys(builds)
    .map((slot) => Number.parseInt(slot, 10))
    .filter((slot) => Number.isInteger(slot) && slot > 0);
  const maxExistingSlot =
    existingSlotNumbers.length > 0 ? Math.max(...existingSlotNumbers) : 0;
  const totalVisibleSlots = Math.max(
    AUTHENTICATED_FREE_SLOTS,
    maxExistingSlot + 1,
  );

  return Array.from({ length: totalVisibleSlots }, (_, index) =>
    String(index + 1),
  );
};

export const getBuildNameForSlot = (
  builds: Record<string, BuildSnapshot>,
  slot: string,
): string => {
  const persistedName = builds[slot]?.name?.trim();
  return persistedName && persistedName.length > 0
    ? persistedName
    : getDefaultBuildName(slot);
};

export const areBuildsEqual = (
  previousBuild: BuildSnapshot | null | undefined,
  nextBuild: BuildSnapshot | null | undefined,
): boolean => {
  if (!previousBuild || !nextBuild) return previousBuild === nextBuild;

  return (
    JSON.stringify({
      profile: previousBuild.profile,
      implants: previousBuild.implants,
      items: previousBuild.items,
      kits: previousBuild.kits,
      drug: previousBuild.drug,
    }) ===
    JSON.stringify({
      profile: nextBuild.profile,
      implants: nextBuild.implants,
      items: nextBuild.items,
      kits: nextBuild.kits,
      drug: nextBuild.drug,
    })
  );
};
