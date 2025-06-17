"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

type AnimatedCounterProps = {
  from?: number;
  to: number;
};

export default function AnimatedCounter({ from = 0, to }: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(from, to, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = Math.round(value).toLocaleString();
      },
    });

    return () => controls.stop();
  }, [from, to]);

  return <span ref={nodeRef}>{from}</span>;
}