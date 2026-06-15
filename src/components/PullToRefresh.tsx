"use client";

import { useState, useRef, useEffect } from "react";

export default function PullToRefresh({ onRefresh, children }: any) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);

  const MAX_PULL = 80;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleTouchStart = (e: any) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: any) => {
      if (startY.current === null) return;

      const distance = e.touches[0].clientY - startY.current;

      if (distance > 0) {
        e.preventDefault();
        setPull(Math.min(distance, MAX_PULL));
      }
    };

    const handleTouchEnd = async () => {
      if (pull > 60) {
        setRefreshing(true);
        await onRefresh();
        setRefreshing(false);
      }

      setPull(0);
      startY.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pull, onRefresh]);

  return (
    <div className="min-h-screen" style={{ touchAction: "pan-x" }}>
      <div
        className="flex justify-center items-center text-gray-400 transition-all"
        style={{
          height: pull,
          opacity: pull > 10 ? 1 : 0,
        }}
      >
        {!refreshing ? (
          <span className="text-sm">Pull to refresh…</span>
        ) : (
          <span className="text-sm animate-pulse">Refreshing…</span>
        )}
      </div>

      {children}
    </div>
  );
}
