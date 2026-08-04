"use client";

import { Filters, CATEGORIES, LOCATIONS, GearCategory, Location } from "@/lib/types";

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function FilterBar({ filters, onChange }: Props) {
  function update(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="lg:col-span-2">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            placeholder="Search gear..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>

        <div>
          <select
            value={filters.category}
            onChange={(e) => update("category", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            placeholder="Min ₹"
            className="w-1/2 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            placeholder="Max ₹"
            className="w-1/2 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>

        <div>
          <select
            value={filters.location}
            onChange={(e) => update("location", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm"
          >
            <option value="All">All Locations</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
