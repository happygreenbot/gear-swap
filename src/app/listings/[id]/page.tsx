import type { Metadata } from "next";
import ListingDetail from "@/components/ListingDetail";
import { SEED_LISTINGS } from "@/lib/listings-data";

export function generateStaticParams() {
  return SEED_LISTINGS.map((listing) => ({ id: listing.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const listing = SEED_LISTINGS.find((l) => l.id === params.id);
  return {
    title: listing ? `${listing.title} · Gear Swap` : "Listing · Gear Swap",
  };
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  return <ListingDetail id={params.id} />;
}
