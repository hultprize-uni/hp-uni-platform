import "server-only";
import { Prisma } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { getPublicSupabaseConfig } from "@/lib/supabase/config";
import {
  DuplicateEmailError,
  type PostulanteAuthAdmin,
  type TeamRegistrationStore,
} from "./team-registration-service";

export const prismaTeamRegistrationStore: TeamRegistrationStore = {
  async findExistingEmails(emails) {
    const rows = await prisma.user.findMany({ where: { email: { in: emails } }, select: { email: true } });
    return rows.map((row) => row.email);
  },

  async createTeamWithMembers({ teamName, members }) {
    try {
      // Escritura anidada: Prisma la ejecuta en una sola transacción.
      const team = await prisma.team.create({
        data: {
          name: teamName,
          members: {
            create: members.map((member) => ({
              id: member.authUserId,
              name: member.name,
              email: member.email,
              universityCode: member.universityCode ?? null,
              phone: member.phone,
              role: "POSTULANTE",
              isLeader: member.isLeader,
            })),
          },
        },
        select: { id: true },
      });
      return { teamId: team.id };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
        throw new DuplicateEmailError();
      throw error;
    }
  },
};

export function createPostulanteAuthAdmin(): PostulanteAuthAdmin {
  const { url } = getPublicSupabaseConfig();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Falta configuración de servidor para el registro.");
  const admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  }).auth.admin;

  return {
    async createPostulante(member) {
      const { data, error } = await admin.createUser({
        email: member.email,
        email_confirm: false,
        app_metadata: { role: "POSTULANTE" },
        user_metadata: { name: member.name },
      });
      if (error?.code === "email_exists" || error?.code === "user_already_exists") throw new DuplicateEmailError();
      if (error || !data.user) throw new Error("No se pudo crear la cuenta.");
      return { id: data.user.id };
    },
    async deleteCreatedUser(id) {
      const { error } = await admin.deleteUser(id);
      if (error) throw new Error("No se pudo revertir la cuenta.");
    },
  };
}
