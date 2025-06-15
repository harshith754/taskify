import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/store-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taskify",
  description:
    "Taskify is a modern bug and task tracking app designed for developers and managers. Track issues, manage workflows, log time, and streamline team productivity — all in one intuitive dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <header className="flex justify-end items-center p-4 gap-4 h-16">
                <Navbar />
              </header>
              {children}
              <Toaster />
            </Providers>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
