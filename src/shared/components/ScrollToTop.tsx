"use client";

import { useEffect, useState } from "react";
import { HiArrowNarrowUp } from "react-icons/hi";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  const [showArrow, setShowArrow] = useState(false);

  // Scroll to the top of the page when the route changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // Go upward arrow - show, unshow
  const handleArrow = () => {
    if (typeof window !== "undefined" && window.scrollY > 500) {
      setShowArrow(true);
    } else {
      setShowArrow(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("scroll", handleArrow);
    return () => {
      window.removeEventListener("scroll", handleArrow);
    };
  }, [showArrow]);

  return (
    <button
      onClick={() => typeof window !== "undefined" && window.scrollTo(0, 0)}
      className={`bg-yellow-25 hover:bg-yellow-50 hover:scale-110 p-3 text-lg text-black rounded-2xl fixed right-3 z-10 duration-500 ease-in-out ${
        showArrow ? "bottom-6" : "-bottom-24"
      }`}
    >
      <HiArrowNarrowUp />
    </button>
  );
}
