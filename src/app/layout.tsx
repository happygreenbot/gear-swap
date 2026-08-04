import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import AuthButton from "@/components/AuthButton";

export const metadata: Metadata = {
  title: "Gear Swap",
  description: "Buy and sell used music gear",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <a href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                Gear Swap
              </a>
              <div className="flex items-center gap-4">
                <a
                  href="/listings/new"
                  className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + New Listing
                </a>
                <AuthButton />
              </div>
            </div>
          </header>
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
