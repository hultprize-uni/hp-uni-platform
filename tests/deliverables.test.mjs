import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_FILE_BYTES,
  buildStoragePath,
  checkFile,
  deliverableKeySchema,
  isStoragePath,
  isWithinDeadline,
  parseDeadline,
  videoLinkSchema,
} from "../lib/deliverables/rules.ts";

const PDF_HEAD = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
const ZIP_HEAD = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0, 0, 0, 0]);
const EXE_HEAD = new Uint8Array([0x4d, 0x5a, 0x90, 0, 0, 0, 0, 0]);
const PDF_MIME = "application/pdf";
const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

test("acepta PDF y DOCX válidos", () => {
  const pdf = checkFile({ name: "Plan.PDF", size: 1000, type: PDF_MIME, head: PDF_HEAD }, ["PDF", "DOCX"]);
  assert.deepEqual(pdf, { ok: true, fileType: "PDF", extension: "pdf", contentType: PDF_MIME });
  const docx = checkFile({ name: "plan.docx", size: 1000, type: DOCX_MIME, head: ZIP_HEAD }, ["PDF", "DOCX"]);
  assert.equal(docx.ok, true);
});

test("rechaza archivos pesados o vacíos (RNF-03)", () => {
  assert.equal(checkFile({ name: "a.pdf", size: MAX_FILE_BYTES + 1, type: PDF_MIME, head: PDF_HEAD }, ["PDF"]).ok, false);
  assert.equal(checkFile({ name: "a.pdf", size: MAX_FILE_BYTES, type: PDF_MIME, head: PDF_HEAD }, ["PDF"]).ok, true);
  assert.equal(checkFile({ name: "a.pdf", size: 0, type: PDF_MIME, head: PDF_HEAD }, ["PDF"]).ok, false);
});

test("rechaza extensiones no permitidas y formatos que el entregable no acepta", () => {
  assert.equal(checkFile({ name: "virus.exe", size: 10, type: "", head: EXE_HEAD }, ["PDF", "DOCX"]).ok, false);
  assert.equal(checkFile({ name: "deck.docx", size: 10, type: DOCX_MIME, head: ZIP_HEAD }, ["PDF"]).ok, false);
});

test("rechaza archivos disfrazados (extensión o MIME que no coincide con el contenido)", () => {
  assert.equal(checkFile({ name: "virus.pdf", size: 10, type: PDF_MIME, head: EXE_HEAD }, ["PDF"]).ok, false);
  assert.equal(checkFile({ name: "doc.pdf", size: 10, type: DOCX_MIME, head: PDF_HEAD }, ["PDF"]).ok, false);
});

test("solo acepta enlaces https de plataformas de video", () => {
  assert.equal(videoLinkSchema.safeParse("https://www.youtube.com/watch?v=abc").success, true);
  assert.equal(videoLinkSchema.safeParse("https://youtu.be/abc").success, true);
  assert.equal(videoLinkSchema.safeParse("https://vimeo.com/123").success, true);
  assert.equal(videoLinkSchema.safeParse("http://youtube.com/watch?v=abc").success, false);
  assert.equal(videoLinkSchema.safeParse("https://evil.example/youtube.com").success, false);
  assert.equal(videoLinkSchema.safeParse("javascript:alert(1)").success, false);
});

test("solo reconoce los entregables configurados", () => {
  assert.equal(deliverableKeySchema.safeParse("pitch-deck").success, true);
  assert.equal(deliverableKeySchema.safeParse("../otro-equipo").success, false);
});

test("plazo de reemplazo (RF-26)", () => {
  const deadline = new Date("2026-12-15T23:59:59-05:00");
  assert.equal(isWithinDeadline(new Date("2026-12-15T23:59:59-05:00"), deadline), true);
  assert.equal(isWithinDeadline(new Date("2026-12-16T00:00:00-05:00"), deadline), false);
  assert.equal(isWithinDeadline(new Date(), null), true);
  assert.equal(parseDeadline(undefined), null);
  assert.throws(() => parseDeadline("mañana"));
});

test("rutas de Storage aisladas por equipo y sin sobrescritura", () => {
  const now = new Date(1700000000000);
  assert.equal(buildStoragePath("team-1", "pitch-deck", "pdf", now), "team-1/pitch-deck/1700000000000.pdf");
  assert.equal(isStoragePath("team-1/pitch-deck/1.pdf"), true);
  assert.equal(isStoragePath("https://youtu.be/abc"), false);
});
