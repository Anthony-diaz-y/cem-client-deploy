import type { Metadata } from "next";
import GlobalProviders from "./providers";
import { DemoBanner, ScrollToTop } from "@shared/components";
import ConditionalNavbar from "@shared/components/navigation/ConditionalNavbar";
import ConditionalFooter from "@shared/components/navigation/ConditionalFooter";
import "../index.css";

export const metadata: Metadata = {
  title: "E-Learning Platform",
  description: "Learn new skills today",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <GlobalProviders>
          <div className="w-full min-h-screen bg-white text-cem-neutral-gray-900 flex flex-col font-inter">
            <ConditionalNavbar />

            {/* ScrollToTop logic will be handled here or inside a client component */}
            <ScrollToTop />

            {children}

            <ConditionalFooter />

            {/* Demo Mode Banner */}
            <DemoBanner />
          </div>
        </GlobalProviders>
      </body>
    </html>
  );
}
