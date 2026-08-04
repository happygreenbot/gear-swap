"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  InterestRequest,
  getRequestsByBuyer,
  getRequestsForSeller,
  setRequestStatus,
} from "@/lib/requests";
import { getAllListings } from "@/lib/local-listings";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusChip({ status }: { status: InterestRequest["status"] }) {
  const styles: Record<InterestRequest["status"], string> = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-green-100 text-green-700",
    declined: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}

function ContactRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <p className="text-sm text-gray-700">
      <span className="text-gray-500">{label}:</span> {value}
    </p>
  );
}

export default function RequestsPage() {
  const { user } = useAuth();
  const [incoming, setIncoming] = useState<InterestRequest[]>([]);
  const [sent, setSent] = useState<InterestRequest[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    setIncoming(getRequestsForSeller(user.id));
    setSent(getRequestsByBuyer(user.id));
  }, [user]);

  function refresh() {
    if (!user) return;
    setIncoming(getRequestsForSeller(user.id));
    setSent(getRequestsByBuyer(user.id));
  }

  if (!mounted) {
    return <div className="text-center py-20 text-gray-400">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Requests</h1>
        <p className="text-gray-500 mb-6">
          Sign in to see interest requests on your listings and the requests you&apos;ve sent.
        </p>
        <Link
          href="/signin"
          className="inline-block bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const listingsById = new Map(getAllListings().map((l) => [l.id, l]));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Requests</h1>
        <p className="text-gray-500">
          Interest requests from buyers on your listings, and your own sent requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Incoming{" "}
            <span className="text-sm font-normal text-gray-500">
              ({incoming.filter((r) => r.status === "pending").length} pending)
            </span>
          </h2>

          {incoming.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
              No requests yet. Buyers will appear here when they express interest.
            </div>
          ) : (
            <ul className="space-y-4">
              {incoming.map((req) => {
                const listing = listingsById.get(req.listingId);
                return (
                  <li key={req.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <Link
                          href={`/listings/${req.listingId}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {listing?.title ?? req.listingTitle}
                        </Link>
                        <p className="text-sm text-gray-900 font-medium mt-1">{req.buyerName}</p>
                        <p className="text-xs text-gray-500">{req.buyerEmail}</p>
                      </div>
                      <StatusChip status={req.status} />
                    </div>

                    {req.message && (
                      <p className="text-sm text-gray-600 mt-2 italic">“{req.message}”</p>
                    )}

                    {req.status === "accepted" ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                        <p className="text-sm font-medium text-green-800 mb-1">
                          Accepted — buyer&apos;s contact shared
                        </p>
                        <ContactRow label="Email" value={req.buyerEmail} />
                        <ContactRow label="Phone" value={req.phone} />
                        {req.acceptedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Accepted on {formatDate(req.acceptedAt)}
                          </p>
                        )}
                      </div>
                    ) : (
                      req.status === "pending" && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => {
                              setRequestStatus(req.id, "accepted");
                              refresh();
                            }}
                            className="bg-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => {
                              setRequestStatus(req.id, "declined");
                              refresh();
                            }}
                            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-1.5"
                          >
                            Decline
                          </button>
                        </div>
                      )
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sent by you</h2>

          {sent.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
              You haven&apos;t expressed interest in anything yet.
            </div>
          ) : (
            <ul className="space-y-4">
              {sent.map((req) => {
                const listing = listingsById.get(req.listingId);
                return (
                  <li key={req.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <Link
                          href={`/listings/${req.listingId}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {listing?.title ?? req.listingTitle}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">Sent {formatDate(req.createdAt)}</p>
                      </div>
                      <StatusChip status={req.status} />
                    </div>

                    {req.status === "accepted" && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                        <p className="text-sm font-medium text-green-800 mb-1">
                          Seller accepted — contact info shared
                        </p>
                        <ContactRow label="Email" value={req.sellerEmail} />
                        <ContactRow label="Phone" value={req.sellerPhone} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
