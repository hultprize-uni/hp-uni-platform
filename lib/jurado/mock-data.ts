export type DeliveryStatus = "received" | "missing";
export type EvaluationStatus = "pending" | "in-progress" | "completed";

export const evaluationRubric = [
  {
    id: "feasibility",
    category: "Viabilidad",
    title: "Viabilidad del modelo",
    description: "Evalua la sostenibilidad operativa y financiera de la propuesta.",
    weight: 35,
  },
  {
    id: "impact",
    category: "Impacto",
    title: "Alcance del impacto",
    description: "Considera la magnitud del problema y el impacto potencial medible.",
    weight: 35,
  },
  {
    id: "innovation",
    category: "Innovacion",
    title: "Diferenciacion de la solucion",
    description: "Valora la originalidad y la ventaja frente a alternativas existentes.",
    weight: 30,
  },
] as const;

export type CriterionAnswer = {
  criterionId: string;
  weight: number;
  score: number | null;
  feedback: string;
};

export type EvaluationDraft = {
  teamId: string;
  answers: CriterionAnswer[];
  updatedAt: string;
};

export type EvaluationSubmission = EvaluationDraft & {
  submittedAt: string;
};

export type AssignedTeam = {
  id: string;
  name: string;
  project: string;
  category: string;
  members: number;
  evaluationStatus: EvaluationStatus;
  proposalStatus: DeliveryStatus;
  pitchStatus: DeliveryStatus;
};

export const assignedTeams: AssignedTeam[] = [
  {
    id: "bio-circular",
    name: "BioCircular",
    project: "Empaques compostables a partir de residuos agricolas.",
    category: "Clima y sostenibilidad",
    members: 4,
    evaluationStatus: "pending",
    proposalStatus: "received",
    pitchStatus: "received",
  },
  {
    id: "aqua-sensor",
    name: "AquaSensor",
    project: "Monitoreo de calidad de agua para comunidades rurales.",
    category: "Agua y saneamiento",
    members: 3,
    evaluationStatus: "in-progress",
    proposalStatus: "received",
    pitchStatus: "received",
  },
  {
    id: "nexo-salud",
    name: "Nexo Salud",
    project: "Orientacion preventiva en salud mediante herramientas digitales.",
    category: "Salud y bienestar",
    members: 5,
    evaluationStatus: "completed",
    proposalStatus: "received",
    pitchStatus: "received",
  },
  {
    id: "raiz-urbana",
    name: "Raiz Urbana",
    project: "Huertos modulares para espacios urbanos de baja disponibilidad.",
    category: "Seguridad alimentaria",
    members: 3,
    evaluationStatus: "pending",
    proposalStatus: "received",
    pitchStatus: "missing",
  },
];
