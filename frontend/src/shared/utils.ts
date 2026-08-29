import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} tons`;
  }
  return `${kg.toLocaleString()} kg`;
}

export function formatCurrency(mmk: number): string {
  return `${mmk.toLocaleString()} MMK`;
}
