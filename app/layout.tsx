import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Scroller } from "./components/ui/scroller";
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
  title: "SmartHire | AI-Powered Hiring Partner",
  description: "SmartHire helps you streamline your recruitment process with AI-powered tools and insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth scrollbar-hide">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Scroller color="#0F387A" width={5} opacity={0.4} />
        {children}
      </body>
    </html>
  );
}
