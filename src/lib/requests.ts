import { OFFICIAL_USER_ID } from "@/lib/listings-data";

export type RequestStatus = "pending" | "accepted" | "declined";

export interface InterestRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerId: string;
  sellerEmail: string;
  sellerPhone?: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  phone?: string;
  message?: string;
  status: RequestStatus;
  createdAt: string;
  acceptedAt?: string;
}

const STORAGE_KEY = "gearswap-interest-requests";

const OFFICIAL_PHONE = "+91 98765 00000";

export const SEED_REQUESTS: InterestRequest[] = [
  {
    id: "seed-req-1",
    listingId: "fender-stratocaster-american-pro-ii",
    listingTitle: "Fender Stratocaster American Pro II",
    sellerId: OFFICIAL_USER_ID,
    sellerEmail: "official@gearswap.com",
    sellerPhone: OFFICIAL_PHONE,
    buyerId: "demo-buyer-rahul",
    buyerName: "rahul.sharma",
    buyerEmail: "rahul.sharma@example.com",
    phone: "+91 98123 45678",
    message: "Hi! Love the Strat. Is the price negotiable for pickup in Bangalore?",
    status: "pending",
    createdAt: "2026-07-25T11:30:00.000Z",
  },
  {
    id: "seed-req-2",
    listingId: "roland-td-17kvx-electronic-drum-kit",
    listingTitle: "Roland TD-17KVX Electronic Drum Kit",
    sellerId: OFFICIAL_USER_ID,
    sellerEmail: "official@gearswap.com",
    sellerPhone: OFFICIAL_PHONE,
    buyerId: "demo-buyer-priya",
    buyerName: "priya",
    buyerEmail: "priya.venkat@example.com",
    phone: "+91 90876 54321",
    message: "Is the kit still available? I can pick up this weekend in Delhi.",
    status: "pending",
    createdAt: "2026-07-26T09:15:00.000Z",
  },
  {
    id: "seed-req-3",
    listingId: "focusrite-scarlett-2i2-4th-gen-audio-interface",
    listingTitle: "Focusrite Scarlett 2i2 4th Gen Audio Interface",
    sellerId: OFFICIAL_USER_ID,
    sellerEmail: "official@gearswap.com",
    sellerPhone: OFFICIAL_PHONE,
    buyerId: "demo-buyer-arjun",
    buyerName: "arjun",
    buyerEmail: "arjun.mehta@example.com",
    phone: "+91 95432 10987",
    message: "Interested! Does it come with the Pro Tools activation?",
    status: "accepted",
    createdAt: "2026-07-24T15:45:00.000Z",
    acceptedAt: "2026-07-24T18:20:00.000Z",
  },
];

export function getUserRequests(): InterestRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as InterestRequest[]) : [];
  } catch {
    return [];
  }
}

function persist(requests: InterestRequest[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // ignore storage errors
  }
}

export function getAllRequests(): InterestRequest[] {
  return [...getUserRequests(), ...SEED_REQUESTS];
}

export function getRequestsForSeller(sellerId: string): InterestRequest[] {
  return getAllRequests().filter((r) => r.sellerId === sellerId);
}

export function getRequestsByBuyer(buyerId: string): InterestRequest[] {
  return getAllRequests().filter((r) => r.buyerId === buyerId);
}

export function findRequest(listingId: string, buyerId: string): InterestRequest | undefined {
  return getAllRequests().find((r) => r.listingId === listingId && r.buyerId === buyerId);
}

export function addInterestRequest(input: {
  listingId: string;
  listingTitle: string;
  sellerId: string;
  sellerEmail: string;
  sellerPhone?: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  phone?: string;
  message?: string;
}): InterestRequest {
  const request: InterestRequest = {
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...input,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  persist([request, ...getUserRequests()]);
  return request;
}

export function setRequestStatus(id: string, status: RequestStatus) {
  const requests = getUserRequests();
  const existing = requests.find((r) => r.id === id);
  if (!existing) return;

  persist(
    requests.map((r) =>
      r.id === id
        ? { ...r, status, acceptedAt: status === "accepted" ? new Date().toISOString() : r.acceptedAt }
        : r
    )
  );
}
