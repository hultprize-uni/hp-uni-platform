import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DuplicateJuryError, type JuryUserStore } from "./jury-registration";

const prismaJuryUserStore: JuryUserStore = {
  async existsByEmail(email: string): Promise<boolean> {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return existing !== null;
  },

  async createLinked(input): Promise<void> {
    try {
      await prisma.user.create({
        data: {
          id: input.authUserId,
          email: input.email,
          name: input.name,
          role: input.role,
          isLeader: false,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new DuplicateJuryError();
      }
      throw error;
    }
  },

  async deleteLinked(authUserId: string): Promise<void> {
    await prisma.user.deleteMany({
      where: {
        id: authUserId,
        role: "JURADO",
      },
    });
  },
};

export function getJuryUserStore(): JuryUserStore {
  return prismaJuryUserStore;
}
