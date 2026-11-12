import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/logout-button";

export const metadata: Metadata = {
  title: "Panel de jurado | Hult Prize at UNI",
  robots: { index: false, follow: false },
};

export default async function JuradoLayout({ children }: LayoutProps<"/jurado">) {
  await requireRole("JURADO");
  return <><header className="flex justify-end px-4 pt-4"><LogoutButton /></header>{children}</>;
}
