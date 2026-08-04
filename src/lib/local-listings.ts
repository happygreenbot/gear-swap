import { Listing } from "@/lib/types";
import { SEED_LISTINGS } from "@/lib/listings-data";

const STORAGE_KEY = "gearswap-user-listings";

export function getUserListings(): Listing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Listing[]) : [];
  } catch {
    return [];
  }
}

function persist(listings: Listing[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  } catch {
    // ignore storage errors
  }
}

export function getAllListings(): Listing[] {
  return [...getUserListings(), ...SEED_LISTINGS];
}

export function addUserListing(input: {
  title: string;
  description: string;
  category: Listing["category"];
  condition: Listing["condition"];
  price: number;
  location: string;
  imageUrl: string;
  contactEmail: string;
  phone?: string;
  userId: string;
}): Listing {
  const listing: Listing = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...input,
    createdAt: new Date().toISOString(),
  };
  persist([listing, ...getUserListings()]);
  return listing;
}

export function removeUserListing(id: string) {
  persist(getUserListings().filter((l) => l.id !== id));
}
