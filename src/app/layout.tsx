import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { headers } from "next/headers";
import FloatingButtons from "@/components/ui/FloatingButtons";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emlak Yönetim",
  description: "Türkiye'nin güvenilir emlak platformu",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const heads = await headers();
  const isAdmin = heads.get("x-admin-route") === "1";

  if (isAdmin) {
    return (
      <html lang="tr">
        <body className={inter.className}>{children}</body>
      </html>
    );
  }

  return (
    <html lang="tr">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600">
              EmlakYönetim
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/ilanlar" className="text-gray-600 hover:text-blue-600 transition-colors">
                İlanlar
              </Link>
              <Link
                href="/ilanlar/yeni"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                İlan Ver
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-gray-200 bg-white py-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} EmlakYönetim. Tüm hakları saklıdır.
        </footer>
        <FloatingButtons />
      </body>
    </html>
  );
}
