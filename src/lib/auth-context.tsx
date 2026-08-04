"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: DemoUser | null;
  isSignedIn: boolean;
  signIn: (email: string) => void;
  register: (email: string) => void;
  signOut: () => void;
}

const STORAGE_KEY = "gearswap-demo-user";

function makeUser(email: string): DemoUser {
  const localPart = email.split("@")[0] || "User";
  return {
    id: `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: localPart,
    email,
  };
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
  }, []);

  function persist(next: DemoUser | null) {
    setUser(next);
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }

  function signIn(email: string) {
    persist(makeUser(email));
  }

  function register(email: string) {
    persist(makeUser(email));
  }

  function signOut() {
    persist(null);
  }

  return (
    <AuthContext.Provider value={{ user, isSignedIn: user !== null, signIn, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
