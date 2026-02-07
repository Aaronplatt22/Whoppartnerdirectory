"use client";

import { useState, useEffect } from "react";
import { Button } from "frosted-ui";
import { ArrowUpIcon } from "@radix-ui/react-icons";

const SHOW_AFTER_PX = 400;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Button
      size="2"
      variant="soft"
      color="gray"
      className="fixed bottom-6 right-6 z-40 rounded-full w-10 h-10 p-0 shadow-lg btn-press"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUpIcon width={18} height={18} />
    </Button>
  );
}
