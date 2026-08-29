export const BADGE_TIERS = [
  { minPoints: 0, name: "Green Starter", key: "rewards.badge.starter" },
  { minPoints: 100, name: "Active Recycler", key: "rewards.badge.active" },
  { minPoints: 250, name: "Zero-Waste Hero", key: "rewards.badge.hero" },
  { minPoints: 500, name: "Eco Guardian", key: "rewards.badge.guardian" },
] as const;

export function badgeAwardFromPoints(points: number): string {
  for (let i = BADGE_TIERS.length - 1; i >= 0; i--) {
    if (points >= BADGE_TIERS[i].minPoints) return BADGE_TIERS[i].name;
  }
  return BADGE_TIERS[0].name;
}

export function badgeIndexFromPoints(points: number): number {
  let index = 0;
  for (let i = 0; i < BADGE_TIERS.length; i++) {
    if (points >= BADGE_TIERS[i].minPoints) index = i;
  }
  return index;
}

export function displayBadgeAward(user: { badgeAward?: string; points: number }): string {
  return user.badgeAward || badgeAwardFromPoints(user.points);
}
