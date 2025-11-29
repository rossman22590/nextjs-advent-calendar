import { fontSans } from "@/config/fonts";
import "@/styles/globals.css";
import dynamic from "next/dynamic";

const AuthBar = dynamic(
  () => import("@/components/AuthBar") as any,
  {
    ssr: true,
    loading: () => <div className="h-8" />,
  }
) as any;

import BackgroundEffects from "@/components/BackgroundEffects";

import { faSnowflake } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    default: "Advent Calendar",
    template: `%s - Advent Calendar`,
  },
  description: "Your advent calendar for this year.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-slate-950 font-sans antialiased",
          fontSans.variable,
        )}
      >
        <div className="relative flex flex-col h-screen">
          {/* 3D GridScan Background */}
          <div className="absolute inset-0 z-0">
            <BackgroundEffects />
          </div>
          
          {/* Main Content */}
          <div className="relative z-10 flex flex-col h-screen">
            <main className="container w-full max-w-4xl mx-auto pt-16 px-6 flex-grow">
              <AuthBar />
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-screen gap-2">
                    <p className="text-primary">
                      <FontAwesomeIcon
                        icon={faSnowflake}
                        className="mr-2 w-6 h-6"
                      />
                    </p>
                    <p className="text-primary">Loading...</p>
                  </div>
                }
              >
                {children}
              </Suspense>
            </main>
            <footer className="w-full flex items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://getmytsi.org"
                title="TSI"
              >
                <span className="text-default-600">Powered by</span>
                <p className="text-primary">TSI</p>
              </Link>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
