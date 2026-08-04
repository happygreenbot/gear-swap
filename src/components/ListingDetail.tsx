"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Listing } from "@/lib/types";
import { getAllListings, removeUserListing } from "@/lib/local-listings";
import { useAuth } from "@/lib/auth-context";
import { InterestRequest, addInterestRequest, findRequest } from "@/lib/requests";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ListingDetail({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null | undefined>(undefined);
  const [existing, setExisting] = useState<InterestRequest | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setListing(getAllListings().find((l) => l.id === id) ?? null);
  }, [id]);

  useEffect(() => {
    setExisting(user ? findRequest(id, user.id) : undefined);
  }, [id, user]);

  if (listing === undefined) {
    return (
      <div className="text-center py-20 text-gray-400">
        Loading listing...
      </div>
    );
  }

  if (listing === null) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h1>
        <p className="text-gray-500 mb-6">
          This listing may have been removed, or the link is incorrect.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to browse
        </Link>
      </div>
    );
  }

  const currentListing = listing;
  const isOwner = user !== null && user.id === currentListing.userId;
  const listingId = currentListing.id;

  function handleDelete() {
    if (!confirm("Delete this listing?")) return;
    removeUserListing(listingId);
    router.push("/");
  }

  function handleSendInterest(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    addInterestRequest({
      listingId: currentListing.id,
      listingTitle: currentListing.title,
      sellerId: currentListing.userId,
      sellerEmail: currentListing.contactEmail,
      sellerPhone: currentListing.phone,
      buyerId: user.id,
      buyerName: user.name,
      buyerEmail: user.email,
      phone: phone.trim() || undefined,
      message: message.trim() || undefined,
    });

    setExisting(findRequest(currentListing.id, user.id));
    setShowForm(false);
    setMessage("");
    setPhone("");
  }

  function renderBuyerSection() {
    if (isOwner || !user) return null;

    if (existing?.status === "accepted") {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-medium text-green-800 mb-1">
            The seller accepted your request — contact info shared
          </p>
          <p className="text-sm text-green-700">
            {currentListing.contactEmail}
            {currentListing.phone ? ` · ${currentListing.phone}` : ""}
          </p>
        </div>
      );
    }

    if (existing?.status === "pending") {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between gap-3">
          <p className="text-sm text-blue-700">Request sent — awaiting the seller.</p>
          <Link href="/requests" className="text-sm text-blue-600 hover:underline whitespace-nowrap">
            View in Requests
          </Link>
        </div>
      );
    }

    if (existing?.status === "declined") {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-600">The seller declined your request.</p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="text-sm text-blue-600 hover:underline whitespace-nowrap"
          >
            Send again
          </button>
        </div>
      );
    }

    if (showForm) {
      return (
        <form onSubmit={handleSendInterest} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-gray-900">Express interest</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Optional message to the seller..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your phone (optional)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send request
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      );
    }

    return (
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        I&apos;m Interested
      </button>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to browse
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {listing.title}
            </h1>
            <span className="text-2xl text-blue-600 font-bold whitespace-nowrap">
              ₹{listing.price.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
              {listing.category}
            </span>
            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
              {listing.condition}
            </span>
            <span>{listing.location}</span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(listing.createdAt)}</span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">
            {listing.description}
          </p>

          {!user && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-3">
                Want to express interest? Sign in to send the seller a request.
              </p>
              <Link
                href="/signin"
                className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign in
              </Link>
            </div>
          )}

          {renderBuyerSection()}

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <a
              href={`mailto:${listing.contactEmail}`}
              className="text-blue-600 text-sm font-medium hover:underline"
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
    </div>
  );
}
