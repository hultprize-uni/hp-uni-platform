// Framework-independent orchestration. The only public Server Action checks
// requireRole("ADMIN") before calling this service with server-owned adapters.
import { EMAIL_PATTERN } from "./validation.ts";

export type NewJury = { name: string; email: string; temporaryPassword: string };
export type JuryRegistrationResult =
  | { ok: true; authUserId: string }
  | { ok: false; code: "INVALID_INPUT" | "DUPLICATE" | "UNAVAILABLE" | "ROLLED_BACK" | "RECONCILIATION_REQUIRED"; authUserId?: string };

// BD must implement these operations with Prisma after #10 is integrated.
// authUserId and email must each be unique. createLinked must be atomic.
export interface JuryUserStore {
  existsByEmail(email: string): Promise<boolean>;
  createLinked(input: { authUserId: string; email: string; name: string; role: "JURADO" }): Promise<void>;
  // Idempotent; only deletes the exact newly-created JURADO identified by authUserId.
  deleteLinked(authUserId: string): Promise<void>;
}

export interface JuryAuthAdmin {
  createWithoutRole(input: NewJury): Promise<{ id: string }>;
  grantJuryRole(authUserId: string): Promise<void>;
  deleteCreatedUser(authUserId: string): Promise<void>;
}

export class DuplicateJuryError extends Error {}

export function validateNewJury(input: unknown): NewJury | null {
  if (!input || typeof input !== "object") return null;
  const candidate = input as Record<string, unknown>;
  if (typeof candidate.name !== "string" || typeof candidate.email !== "string" ||
      typeof candidate.temporaryPassword !== "string") return null;
  const name = candidate.name.trim();
  const email = candidate.email.trim().toLowerCase();
  const temporaryPassword = candidate.temporaryPassword;
  if (!name || name.length > 120 || email.length > 254 || !EMAIL_PATTERN.test(email) ||
      temporaryPassword.length < 8 || temporaryPassword.length > 128) return null;
  return { name, email, temporaryPassword };
}

export async function registerJury(
  input: NewJury,
  store: JuryUserStore,
  auth: JuryAuthAdmin,
): Promise<JuryRegistrationResult> {
  // Validate even when invoked by another server module, not just the action.
  const valid = validateNewJury(input);
  if (!valid) return { ok: false, code: "INVALID_INPUT" };
  let id: string;
  try {
    if (await store.existsByEmail(valid.email)) return { ok: false, code: "DUPLICATE" };
  } catch {
    return { ok: false, code: "UNAVAILABLE" };
  }
  try {
    // No panel role is granted before the DB link exists.
    ({ id } = await auth.createWithoutRole(valid));
  } catch (error) {
    // A network failure during creation may have committed remotely. Do not
    // automatically retry, adopt or delete accounts found later by email.
    return { ok: false, code: error instanceof DuplicateJuryError ? "DUPLICATE" : "RECONCILIATION_REQUIRED" };
  }
  try {
    await store.createLinked({ authUserId: id, email: valid.email, name: valid.name, role: "JURADO" });
    await auth.grantJuryRole(id);
    return { ok: true, authUserId: id };
  } catch {
    try {
      // Revoke Auth access first; never remove the DB link while an account
      // might still have a role. Delete only the UUID created by this call.
      await auth.deleteCreatedUser(id);
      await store.deleteLinked(id);
      return { ok: false, code: "ROLLED_BACK" };
    } catch {
      // Preserve evidence for a manual reconciliation. Never report success.
      return { ok: false, code: "RECONCILIATION_REQUIRED", authUserId: id };
    }
  }
}
