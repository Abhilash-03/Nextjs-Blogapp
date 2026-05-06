import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BloX - Share Your Story With The World",
    template: "%s | BloX",
  },
  description: "BloX - Share your story with the world. Create beautiful articles, grow your audience, and join a community of passionate writers and readers.",
  keywords: ["blog", "writing", "articles", "stories", "content creation", "blogging platform", "BloX"],
  authors: [{ name: "BloX Team" }],
  creator: "Abhilash",
  metadataBase: new URL("https://blox-xi.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blox-xi.vercel.app",
    siteName: "BloX",
    title: "BloX - Share Your Story With The World",
    description: "Create beautiful articles, grow your audience, and join a community of passionate writers and readers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BloX - Share Your Story With The World",
    description: "Create beautiful articles, grow your audience, and join a community of passionate writers and readers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
          <Header />
          <main className="h-full">
          {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  );
}
