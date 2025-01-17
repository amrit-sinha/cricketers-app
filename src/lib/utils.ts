import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const typeMap = {
  none: "None",
  batsman: "Batsman",
  bowler: "Bowler",
  allRounder: "All Rounder",
  wicketKeeper: "Wicket Keeper",
};
