// Orquestación del registro de equipos (Issue #3, deuda saldada en #11) independiente del framework.
// User.id debe ser el UUID de Supabase Auth (lib/auth/AGENTS.md §3.3): por eso primero se crean las
// cuentas en Auth y luego Team + Users en una sola escritura de Prisma, con compensación si algo falla.
import type { TeamRegistrationFormValues } from "../validations/team-schema.ts";

export type RegistrationMember = { name: string; email: string; universityCode?: string; phone: string };

export interface PostulanteAuthAdmin {
  // Crea la cuenta sin contraseña y con app_metadata.role = "POSTULANTE" (sin acceso a paneles).
  createPostulante(member: RegistrationMember): Promise<{ id: string }>;
  deleteCreatedUser(authUserId: string): Promise<void>;
}

export interface TeamRegistrationStore {
  findExistingEmails(emails: string[]): Promise<string[]>;
  // Debe ser atómico (una sola escritura anidada o transacción).
  createTeamWithMembers(input: {
    teamName: string;
    members: (RegistrationMember & { authUserId: string; isLeader: boolean })[];
  }): Promise<{ teamId: string }>;
}

export class DuplicateEmailError extends Error {}

export type TeamRegistrationResult =
  | { ok: true; teamId: string; teamName: string }
  | { ok: false; code: "DUPLICATE"; emails: string[] }
  | { ok: false; code: "UNAVAILABLE" | "ROLLED_BACK" | "RECONCILIATION_REQUIRED" };

export function teamNameFor(data: TeamRegistrationFormValues): string {
  return data.registrationType === "TEAM" && data.teamName
    ? data.teamName.trim()
    : `Postulación individual de ${data.members[0].fullName.trim()}`;
}

export async function registerTeam(
  data: TeamRegistrationFormValues, // ya validado con teamRegistrationSchema
  store: TeamRegistrationStore,
  auth: PostulanteAuthAdmin,
): Promise<TeamRegistrationResult> {
  const members: RegistrationMember[] = data.members.map((member) => ({
    name: member.fullName.trim(),
    email: member.email.trim().toLowerCase(),
    universityCode: member.universityCode ? member.universityCode.trim().toUpperCase() : undefined,
    phone: member.phone.trim(),
  }));

  try {
    const existing = await store.findExistingEmails(members.map((member) => member.email));
    if (existing.length) return { ok: false, code: "DUPLICATE", emails: existing };
  } catch {
    return { ok: false, code: "UNAVAILABLE" };
  }

  const created: string[] = [];
  const rollback = async (): Promise<boolean> => {
    try {
      for (const id of created) await auth.deleteCreatedUser(id);
      return true;
    } catch {
      return false;
    }
  };

  const linked: (RegistrationMember & { authUserId: string; isLeader: boolean })[] = [];
  for (const [index, member] of members.entries()) {
    try {
      const { id } = await auth.createPostulante(member);
      created.push(id);
      linked.push({ ...member, authUserId: id, isLeader: index === 0 });
    } catch (error) {
      const cleaned = await rollback();
      if (!cleaned) return { ok: false, code: "RECONCILIATION_REQUIRED" };
      return error instanceof DuplicateEmailError
        ? { ok: false, code: "DUPLICATE", emails: [member.email] }
        : { ok: false, code: "UNAVAILABLE" };
    }
  }

  const teamName = teamNameFor(data);
  try {
    const { teamId } = await store.createTeamWithMembers({ teamName, members: linked });
    return { ok: true, teamId, teamName };
  } catch (error) {
    const cleaned = await rollback();
    if (!cleaned) return { ok: false, code: "RECONCILIATION_REQUIRED" };
    if (error instanceof DuplicateEmailError) return { ok: false, code: "DUPLICATE", emails: [] };
    return { ok: false, code: "ROLLED_BACK" };
  }
}
