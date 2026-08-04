export interface Listing {
  id: string;
  title: string;
  description: string;
  category: GearCategory;
  condition: Condition;
  price: number;
  location: string;
  imageUrl: string;
  contactEmail: string;
  createdAt: string;
  userId: string;
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  username: string | null;
}

export type GearCategory =
  | "Guitars"
  | "Bass"
  | "Drums"
  | "Keyboards"
  | "Amplifiers"
  | "Effects & Pedals"
  | "DJ Equipment"
  | "Recording"
  | "Accessories"
  | "Other";

export type Condition = "New" | "Like New" | "Good" | "Fair" | "Poor";

export const CATEGORIES: GearCategory[] = [
  "Guitars",
  "Bass",
  "Drums",
  "Keyboards",
  "Amplifiers",
  "Effects & Pedals",
  "DJ Equipment",
  "Recording",
  "Accessories",
  "Other",
];

export const CONDITIONS: Condition[] = [
  "New",
  "Like New",
  "Good",
  "Fair",
  "Poor",
];

export type Location = "Bangalore" | "Delhi" | "Mumbai";

export const LOCATIONS: Location[] = ["Bangalore", "Delhi", "Mumbai"];

export interface Filters {
  search: string;
  category: GearCategory | "All";
  minPrice: string;
  maxPrice: string;
  location: Location | "All";
}
