import { useEffect, RefObject } from "react";

// This hook detects clicks outside of the specified component and calls the provided handler function.
export default function useOnClickOutside(
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    // Define the listener function to be called on click/touch events
    const listener = (event: MouseEvent | TouchEvent) => {
      // If the click/touch event originated inside the ref element, do nothing
      if (
        !ref.current ||
        !event.target ||
        ref.current.contains(event.target as Node)
      ) {
        return;
      }
      // Otherwise, call the provided handler function
      handler(event);
    };

    // Add event listeners for mousedown and touchstart events on the document
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // Cleanup function to remove the event listeners when the component unmounts or when the ref/handler dependencies change
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]); // Only run this effect when the ref or handler function changes
}
