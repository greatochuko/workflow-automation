import { useEffect, useRef } from "react";

export default function useClickOutside(cb: () => void) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(ev: MouseEvent) {
      if (
        elementRef.current &&
        !elementRef.current.contains(ev.target as Node)
      ) {
        cb();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cb]);
  return [elementRef];
}
