import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export interface CreatePublicUserInput {
  id: string; // UUID obligatorio obtenido de Supabase Auth (auth.users.id)
  name: string;
  email: string;
  uniCode?: string | null;
  phone?: string | null;
  role?: Role;
  isLeader?: boolean;
  teamId?: string | null;
}

/**
 * Registra un usuario en la tabla pública `users` asignando explícitamente
 * el UUID generado por Supabase Auth (`data.user.id`).
 *
 * Esto garantiza que el ID público coincida con `auth.users.id`, permitiendo
 * la correcta integración con Supabase Auth SSR y las políticas RLS en PostgreSQL.
 */
export async function createPublicUser(input: CreatePublicUserInput) {
  if (!input.id) {
    throw new Error("El UUID de Supabase Auth es obligatorio para crear el usuario.");
  }

  return await prisma.user.create({
    data: {
      id: input.id,
      name: input.name,
      email: input.email,
      uniCode: input.uniCode,
      phone: input.phone,
      role: input.role ?? Role.POSTULANTE,
      isLeader: input.isLeader ?? false,
      teamId: input.teamId,
    },
  });
}
