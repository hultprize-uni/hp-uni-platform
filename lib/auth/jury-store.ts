import "server-only";
import type { JuryUserStore } from "./jury-registration";

// Intentionally disabled: the checked-out Prisma schema has NO User model.
// The published BD branch has User, but no unique authUserId yet (#10).
// Replace this provider with a typed Prisma adapter after BD publishes the
// agreed schema. Never create an Auth account while the link is unavailable.
export function getJuryUserStore(): JuryUserStore | null {
  return null;
}
