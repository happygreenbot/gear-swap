"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useState } from "react";

export default function AuthButton() {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) {
    return (
      <Link
        href="/signin"
        className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Sign in
      </Link>
    );
  }

  const displayName = user.name || user.email || "U";
  const initials = displayName[0].toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
      >
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
          {initials}
        </div>
        <span className="hidden sm:inline">{displayName}</span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.name || "User"}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={() => {
                setShowMenu(false);
                signOut();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
