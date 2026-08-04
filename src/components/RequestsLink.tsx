"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getRequestsForSeller } from "@/lib/requests";

export default function RequestsLink() {
  const { user } = useAuth();
  const [pending, setPending] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    setPending(getRequestsForSeller(user.id).filter((r) => r.status === "pending").length);
  }, [user]);

  if (!user || !mounted) return null;

  return (
    <Link
      href="/requests"
      className="relative text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
    >
      Requests
      {pending > 0 && (
        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
          {pending}
        </span>
      )}
    </Link>
  );
}
