import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import LogoutButton from "@/components/LogoutButton";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scolrly Admin Dashboard",
  description: "Admin dashboard for Scolrly NEET prep app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-screen flex bg-bg">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-16 border-b border-border-dark bg-card flex items-center justify-between px-6 shrink-0">
            <h2 className="text-lg font-semibold text-text-primary">Admin Dashboard</h2>
            <div className="flex items-center gap-4">
              <LogoutButton />
              <div className="w-9 h-9 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold text-sm">
                SK
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
