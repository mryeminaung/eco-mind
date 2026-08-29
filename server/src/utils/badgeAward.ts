export function badgeAwardFromPoints(points: number): string {
  if (points >= 500) return "Eco Guardian";
  if (points >= 250) return "Zero-Waste Hero";
  if (points >= 100) return "Active Recycler";
  return "Green Starter";
}
