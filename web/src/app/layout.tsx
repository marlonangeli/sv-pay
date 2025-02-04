import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "@/app/globals.css";
import React from "react";
import {cn} from "@/lib/utils";
import {Toaster} from "@/components/ui/sonner";
import AppQueryClient from "@/components/app-query-client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SV Pay",
  description: "Payments management system",
};

export default function RootLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
      className={cn(`${geistSans.variable} ${geistMono.variable} antialiased`)}
    >
    <AppQueryClient>
      {children}
    </AppQueryClient>
    <Toaster/>
    </body>
    </html>
  );
}
