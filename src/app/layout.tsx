import type { Metadata } from "next";
import GlobalProviders from "./providers";
import Navbar from "@shared/components/Navbar";
import DemoBanner from "@shared/components/DemoBanner";
import ScrollToTop from "@shared/components/ScrollToTop"; // We'll need to create this or inline it
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
      <body>
        <GlobalProviders>
          <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
            <Navbar />

            {/* ScrollToTop logic will be handled here or inside a client component */}
            <ScrollToTop />

            {children}

            {/* Demo Mode Banner */}
            <DemoBanner />
          </div>
        </GlobalProviders>
      </body>
    </html>
  );
}
