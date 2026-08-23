"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const stickyGutter = 24;

export default function StickyTextPanel({ children }: { children: ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [topOffset, setTopOffset] = useState(0);

  useEffect(() => {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    const updateTopOffset = (height: number) => {
      setTopOffset(
        Math.min(stickyGutter, window.innerHeight - height - stickyGutter),
      );
    };
    const handleWindowResize = () => {
      updateTopOffset(panel.getBoundingClientRect().height);
    };

    updateTopOffset(panel.getBoundingClientRect().height);

    const resizeObserver = new ResizeObserver(([entry]) => {
      updateTopOffset(entry.contentRect.height);
    });

    resizeObserver.observe(panel);
    window.addEventListener("resize", handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div
      ref={panelRef}
      className="sticky self-start"
      style={{ top: topOffset }}
    >
      {children}
    </div>
  );
}
