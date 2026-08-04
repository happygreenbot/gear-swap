"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Listing, Filters } from "@/lib/types";
import FilterBar from "@/components/FilterBar";
import ListingCard from "@/components/ListingCard";
import { getAllListings, removeUserListing } from "@/lib/local-listings";

const DEFAULT_FILTERS: Filters = {
  search: "",
  category: "All",
  minPrice: "",
  maxPrice: "",
  location: "All",
};

export default function Home() {
  const { user } = useAuth();
  const [listings, setListings] = useState<(Listing & { user?: { id: string; username: string | null; name: string | null } })[]>([]);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUserId = user?.id;

  useEffect(() => {
    setMounted(true);
    setListings(getAllListings());
    setLoading(false);
  }, []);

  function handleDelete(id: string) {
    removeUserListing(id);
    setListings(getAllListings());
  }

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !l.title.toLowerCase().includes(q) &&
          !l.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (filters.category !== "All" && l.category !== filters.category) return false;
      if (filters.minPrice && l.price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && l.price > parseFloat(filters.maxPrice)) return false;
      if (filters.location !== "All" && l.location !== filters.location) {
        return false;
      }
      return true;
    });
  }, [listings, filters]);

  if (!mounted || loading) {
    return (
      <div className="text-center py-20 text-gray-400">Loading...</div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Browse Gear</h1>
        <p className="text-gray-500">
          Find your next instrument or sell what you have.
        </p>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">
            {listings.length === 0
              ? "No listings yet. Be the first to post!"
              : "No listings match your filters."}
          </p>
          {listings.length === 0 && (
            <Link
              href="/listings/new"
              className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create a Listing
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {filtered.length} listing{filtered.length !== 1 && "s"} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                currentUserId={currentUserId}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
