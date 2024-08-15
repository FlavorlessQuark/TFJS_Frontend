import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncate(text: string, maxLength: number)  {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};