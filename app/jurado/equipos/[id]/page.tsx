import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamEvaluationWorkspace } from "@/components/jurado/team-evaluation-workspace";
import { assignedTeams } from "@/lib/jurado/mock-data";

export const metadata: Metadata = {
  title: "Evaluacion de equipo",
};

export default async function TeamEvaluationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = assignedTeams.find((assignedTeam) => assignedTeam.id === id);

  if (!team) notFound();

  return <TeamEvaluationWorkspace key={team.id} team={team} />;
}
