import test from "node:test";
import assert from "node:assert/strict";
import { checkScores, weightedTotal } from "../lib/evaluations/rules.ts";
import {
  checkLogo,
  deliverableReviewSchema,
  evaluationSchema,
  homeContentSchema,
  reorderSchema,
  rubricSchema,
  timelineEventSchema,
} from "../lib/validations/cms-schema.ts";
import { isUniMember, teamRegistrationSchema } from "../lib/validations/team-schema.ts";
import { DuplicateEmailError, registerTeam } from "../lib/registration/team-registration-service.ts";

const criteria = [
  { id: "c1", name: "Impacto", maxScore: 10, weight: 2 },
  { id: "c2", name: "Viabilidad", maxScore: 5, weight: 1 },
];

// ------------------------------------------------------------ Calificaciones
test("el puntaje no puede superar el máximo del criterio (RF-31)", () => {
  assert.deepEqual(checkScores(criteria, [{ criterionId: "c1", score: 10 }], false), {});
  assert.ok(checkScores(criteria, [{ criterionId: "c1", score: 10.5 }], false).c1);
});

test("rechaza criterios ajenos a la rúbrica", () => {
  assert.ok(checkScores(criteria, [{ criterionId: "otro", score: 1 }], false).otro);
});

test("borrador parcial permitido; finalizar exige todos los criterios (RF-30)", () => {
  const partial = [{ criterionId: "c1", score: 8 }];
  assert.deepEqual(checkScores(criteria, partial, false), {});
  assert.ok(checkScores(criteria, partial, true).c2);
});

test("puntaje final ponderado sobre 100 (RF-39)", () => {
  assert.equal(weightedTotal(criteria, [{ criterionId: "c1", score: 10 }, { criterionId: "c2", score: 5 }]), 100);
  // (8/10)*2 + (2.5/5)*1 = 2.1 de 3 → 70
  assert.equal(weightedTotal(criteria, [{ criterionId: "c1", score: 8 }, { criterionId: "c2", score: 2.5 }]), 70);
  assert.equal(weightedTotal([], []), 0);
});

test("esquema de evaluación: sin negativos ni criterios repetidos", () => {
  const base = { teamId: "t1", rubricId: "r1", finalize: false };
  assert.equal(evaluationSchema.safeParse({ ...base, scores: [{ criterionId: "c1", score: -1 }] }).success, false);
  assert.equal(
    evaluationSchema.safeParse({ ...base, scores: [{ criterionId: "c1", score: 1 }, { criterionId: "c1", score: 2 }] }).success,
    false,
  );
});

// ------------------------------------------------------------------ Rúbricas
test("rúbrica: requiere criterios con puntaje y peso positivos, sin nombres repetidos", () => {
  const criterion = { name: "Impacto", maxScore: 10, weight: 1 };
  assert.equal(rubricSchema.safeParse({ title: "Final", criteria: [criterion] }).success, true);
  assert.equal(rubricSchema.safeParse({ title: "Final", criteria: [] }).success, false);
  assert.equal(rubricSchema.safeParse({ title: "Final", criteria: [{ ...criterion, weight: 0 }] }).success, false);
  assert.equal(rubricSchema.safeParse({ title: "Final", criteria: [criterion, { ...criterion, name: "impacto" }] }).success, false);
});

// ---------------------------------------------------------------------- CMS
test("Home: botón con ruta interna o https", () => {
  const home = { heroTitle: "Hult Prize UNI", heroSubtitle: "Sub", ctaLabel: "Postula", aboutText: "Texto", registrationOpen: true };
  assert.equal(homeContentSchema.safeParse({ ...home, ctaHref: "/registro" }).success, true);
  assert.equal(homeContentSchema.safeParse({ ...home, ctaHref: "https://hultprize.org" }).success, true);
  assert.equal(homeContentSchema.safeParse({ ...home, ctaHref: "javascript:alert(1)" }).success, false);
  assert.equal(homeContentSchema.safeParse({ ...home, ctaHref: "//evil.example" }).success, false);
});

test("Cronograma: fin no anterior al inicio; reordenar sin repetidos", () => {
  const event = { title: "Bootcamp", description: "Día 1", date: "2026-12-01" };
  assert.equal(timelineEventSchema.safeParse({ ...event, endDate: "2026-12-02" }).success, true);
  assert.equal(timelineEventSchema.safeParse({ ...event, endDate: "2026-11-30" }).success, false);
  assert.equal(reorderSchema.safeParse(["a", "b"]).success, true);
  assert.equal(reorderSchema.safeParse(["a", "a"]).success, false);
});

test("Aliados: logo PNG/JPG/WEBP real de hasta 2 MB; SVG no permitido", () => {
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert.equal(checkLogo({ name: "logo.png", size: 1000, head: png }).ok, true);
  assert.equal(checkLogo({ name: "logo.svg", size: 1000, head: png }).ok, false);
  assert.equal(checkLogo({ name: "logo.png", size: 3 * 1024 * 1024, head: png }).ok, false);
  assert.equal(checkLogo({ name: "logo.jpg", size: 1000, head: png }).ok, false);
});

test("Revisión de entregable: OBSERVADO exige comentario (RF-38)", () => {
  assert.equal(deliverableReviewSchema.safeParse({ deliverableId: "d1", decision: "VALIDO" }).success, true);
  assert.equal(deliverableReviewSchema.safeParse({ deliverableId: "d1", decision: "OBSERVADO" }).success, false);
  assert.equal(deliverableReviewSchema.safeParse({ deliverableId: "d1", decision: "OBSERVADO", notes: "Falta el anexo" }).success, true);
});

// ------------------------------------------------ Deuda Sprint 1: regla UNI
test("UNI: correo institucional o código UNI, ya no basta con escribir 'uni'", () => {
  assert.equal(isUniMember({ email: "ana@uni.pe" }), true);
  assert.equal(isUniMember({ email: "ana@gmail.com", universityCode: "20231234A" }), true);
  assert.equal(isUniMember({ email: "ana@gmail.com", universityCode: "unifé" }), false);
  assert.equal(isUniMember({ email: "ana@universidad.pe" }), false);
});

const member = (email, universityCode = "") => ({ fullName: "Ana Torres", email, universityCode, phone: "987654321" });

test("registro: rechaza correos repetidos dentro del mismo equipo", () => {
  const data = { registrationType: "TEAM", teamName: "Innova", members: [member("a@uni.pe"), member("A@uni.pe")] };
  assert.equal(teamRegistrationSchema.safeParse(data).success, false);
});

// ----------------------------------- Deuda Sprint 1: persistencia con compensación
function fakes({ existing = [], failAuthAt = -1, failStore = false } = {}) {
  const created = [];
  const deleted = [];
  const auth = {
    async createPostulante(m) {
      if (created.length === failAuthAt) throw new DuplicateEmailError();
      const id = `auth-${created.length}`;
      created.push({ id, email: m.email });
      return { id };
    },
    async deleteCreatedUser(id) {
      deleted.push(id);
    },
  };
  let saved = null;
  const store = {
    async findExistingEmails(emails) {
      return emails.filter((email) => existing.includes(email));
    },
    async createTeamWithMembers(input) {
      if (failStore) throw new Error("db down");
      saved = input;
      return { teamId: "team-1" };
    },
  };
  return { auth, store, created, deleted, get saved() { return saved; } };
}

const teamData = { registrationType: "TEAM", teamName: "Innova", members: [member("a@uni.pe"), member("b@gmail.com")] };

test("registro: crea cuentas Auth y guarda Team + Users con el UUID de Auth; el primero es líder", async () => {
  const f = fakes();
  const result = await registerTeam(teamData, f.store, f.auth);
  assert.deepEqual(result, { ok: true, teamId: "team-1", teamName: "Innova" });
  assert.deepEqual(f.saved.members.map((m) => [m.authUserId, m.isLeader]), [["auth-0", true], ["auth-1", false]]);
});

test("registro: si un correo ya existe no se crea nada", async () => {
  const f = fakes({ existing: ["b@gmail.com"] });
  assert.equal((await registerTeam(teamData, f.store, f.auth)).code, "DUPLICATE");
  assert.equal(f.created.length, 0);
});

test("registro: si falla Auth o la BD se borran las cuentas creadas (nunca éxito sin guardar)", async () => {
  const authFail = fakes({ failAuthAt: 1 });
  assert.equal((await registerTeam(teamData, authFail.store, authFail.auth)).ok, false);
  assert.deepEqual(authFail.deleted, ["auth-0"]);

  const dbFail = fakes({ failStore: true });
  assert.equal((await registerTeam(teamData, dbFail.store, dbFail.auth)).code, "ROLLED_BACK");
  assert.deepEqual(dbFail.deleted, ["auth-0", "auth-1"]);
});
