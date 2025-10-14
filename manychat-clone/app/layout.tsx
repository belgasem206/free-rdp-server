import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ManyChat Clone",
  description: "A minimal ManyChat-like builder and chat UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <div className="min-h-screen flex flex-col">
          <nav className="border-b bg-gray-50/60 backdrop-blur supports-[backdrop-filter]:bg-gray-50/40">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
              <span className="font-semibold">ManyChat Clone</span>
              <div className="ms-auto flex items-center gap-4 text-sm">
                <Link href="/" className="hover:underline">الرئيسية</Link>
                <Link href="/flows" className="hover:underline">التدفقات</Link>
                <Link href="/chat" className="hover:underline">الدردشة</Link>
              </div>
            </div>
          </nav>
          <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
