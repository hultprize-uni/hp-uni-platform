import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Jurado | Hult Prize at UNI",
    template: "%s | Hult Prize at UNI",
  },
};

export default function JuryLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh bg-brand-ink text-white selection:bg-brand-pink selection:text-white">
      {children}
    </main>
  );
}
