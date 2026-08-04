"use client";

import { Listing } from "@/lib/types";

interface Props {
  listing: Listing & { user?: { id: string; username: string | null; name: string | null } };
  currentUserId?: string;
  onDelete: (id: string) => void;
}

export default function ListingCard({ listing, currentUserId, onDelete }: Props) {
  const isOwner = currentUserId && listing.userId === currentUserId;

  function handleDelete() {
    if (!confirm("Delete this listing?")) return;
    onDelete(listing.id);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/600x400?text=No+Image";
          }}
        />
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-medium px-2.5 py-1 rounded-full text-gray-700">
          {listing.condition}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 leading-tight">{listing.title}</h3>
          <span className="text-blue-600 font-bold whitespace-nowrap">
            ₹{listing.price.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">{listing.category}</span>
          <span>{listing.location}</span>
        </div>

        {listing.user && (
          <p className="text-xs text-gray-400 mb-2">
            Listed by @{listing.user.username || listing.user.name || "unknown"}
          </p>
        )}

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{listing.description}</p>

        <div className="flex items-center justify-between">
          <a
            href={`mailto:${listing.contactEmail}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Contact Seller
          </a>
          {isOwner && (
            <button
              onClick={handleDelete}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
