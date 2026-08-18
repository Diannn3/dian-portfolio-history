import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(year: string | number | undefined): string {
  if (!year) return 'TO VERIFY';
  return String(year);
}