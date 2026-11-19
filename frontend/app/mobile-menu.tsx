"use client";
import { useRef, type ReactNode } from "react";

export function MobileMenu({ children }: { children: ReactNode }) {
  const menu = useRef<HTMLDetailsElement>(null);
  return (
    <details
      className="mobileMenu"
      ref={menu}
      onKeyDown={(event) => {
        if (event.key === "Escape" && menu.current?.open) {
          menu.current.open = false;
          menu.current.querySelector("summary")?.focus();
        }
      }}
    >
      <summary aria-label="Menu">☰</summary>
      <nav
        aria-label="Mobile navigation"
        onClick={(event) => {
          if (
            event.target instanceof Element &&
            event.target.closest("a") &&
            menu.current
          )
            menu.current.open = false;
        }}
      >
        {children}
      </nav>
    </details>
  );
}
