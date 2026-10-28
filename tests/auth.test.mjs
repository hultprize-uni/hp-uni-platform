import test from "node:test";
import assert from "node:assert/strict";
import { accessRedirect, parseRole, requiredPanelRole } from "../lib/auth/roles.ts";
import { validateLogin, loginErrorMessage } from "../lib/auth/validation.ts";
import { registerJury, validateNewJury, DuplicateJuryError } from "../lib/auth/jury-registration.ts";

for (const path of ["/admin", "/admin/", "/admin/nested", "/jurado", "/jurado/", "/jurado/nested"]) {
  test(`anonymous is denied at ${path}`, () => assert.equal(accessRedirect(path, null), "/login"));
  test(`missing/unknown role is denied at ${path}`, () => {
    assert.equal(accessRedirect(path, { role: null }), "/login?error=unauthorized");
    assert.equal(accessRedirect(path, { role: parseRole("admin") }), "/login?error=unauthorized");
  });
}

test("role boundaries and cross-role redirects", () => {
  assert.equal(accessRedirect("/admin/nested", { role: "ADMIN" }), null);
  assert.equal(accessRedirect("/jurado/nested", { role: "JURADO" }), null);
  assert.equal(accessRedirect("/admin", { role: "JURADO" }), "/jurado");
  assert.equal(accessRedirect("/jurado", { role: "ADMIN" }), "/admin");
  assert.equal(requiredPanelRole("/administrator"), null);
  assert.equal(requiredPanelRole("/jurados"), null);
});
test("login never redirects to itself; POSTULANTE is recognized without a panel", () => {
  assert.equal(parseRole("POSTULANTE"), "POSTULANTE");
  assert.equal(accessRedirect("/login", null), null);
  assert.equal(accessRedirect("/login", { role: null }), null);
  assert.equal(accessRedirect("/login", { role: "POSTULANTE" }), null);
  assert.equal(accessRedirect("/login", { role: "ADMIN" }), "/admin");
  assert.equal(accessRedirect("/login", { role: "JURADO" }), "/jurado");
  assert.equal(accessRedirect("/admin", { role: "POSTULANTE" }), "/login?error=unauthorized");
  assert.equal(accessRedirect("/entregables", { role: "POSTULANTE" }), null);
});
test("roles are exact and user_metadata cannot become a role", () => {
  for (const value of [undefined, null, "admin", "jurado", "OWNER", {}, { user_metadata: { role: "ADMIN" } }])
    assert.equal(parseRole(value), null);
});
test("login validation accepts existing short passwords but rejects missing/invalid inputs", () => {
  assert.deepEqual(validateLogin("", ""), { email: "Ingresa tu correo electrónico.", password: "Ingresa tu contraseña." });
  assert.ok(validateLogin("invalid", "secret").email);
  assert.deepEqual(validateLogin("user@example.invalid", "x"), {});
  assert.ok(validateLogin("user@example.invalid", "x".repeat(1025)).password);
});
test("invalid credentials never reveal whether an email exists; network errors are safe", () => {
  assert.equal(loginErrorMessage({ status: 400, code: "invalid_credentials" }),
    loginErrorMessage({ status: 422, code: "user_not_found" }));
  assert.match(loginErrorMessage({ name: "AuthRetryableFetchError" }), /conexión/);
  assert.match(loginErrorMessage({ status: 503 }), /conexión/);
  assert.match(loginErrorMessage({ status: 429 }), /Demasiados/);
});

const input = { name: "Test Jury", email: "jury@example.invalid", temporaryPassword: "test-only-password" };
function adapters(fail = "") {
  const calls = [];
  return {
    calls,
    store: {
      async existsByEmail() { calls.push("exists"); if (fail === "lookup") throw Error(); return fail === "duplicate"; },
      async createLinked(value) { calls.push("link"); assert.equal(value.role, "JURADO"); if (fail === "link" || fail === "delete") throw Error(); },
      async deleteLinked(id) { calls.push("delete-link"); assert.equal(id, "new-id"); },
    },
    auth: {
      async createWithoutRole() { calls.push("create"); if (fail === "auth-duplicate") throw new DuplicateJuryError(); if (fail === "network") throw Error(); return { id: "new-id" }; },
      async grantJuryRole() { calls.push("grant"); if (fail === "grant") throw Error(); },
      async deleteCreatedUser(id) { calls.push("delete-auth"); assert.equal(id, "new-id"); if (fail === "delete") throw Error(); },
    },
  };
}
test("jury input rejects invalid values and never accepts a caller-supplied role", () => {
  for (const invalid of [null, {}, { ...input, name: " " }, { ...input, email: "bad" }, { ...input, temporaryPassword: "short" }])
    assert.equal(validateNewJury(invalid), null);
  const valid = validateNewJury({ ...input, email: " JURY@EXAMPLE.INVALID ", role: "ADMIN" });
  assert.equal(valid.email, "jury@example.invalid");
  assert.equal("role" in valid, false);
});
test("jury grants role only after DB linking", async () => {
  const a = adapters();
  assert.deepEqual(await registerJury(input, a.store, a.auth), { ok: true, authUserId: "new-id" });
  assert.deepEqual(a.calls, ["exists", "create", "link", "grant"]);
});
for (const failure of ["duplicate", "auth-duplicate", "network", "link", "grant", "delete"]) {
  test(`jury creation handles ${failure} without false success`, async () => {
    const a = adapters(failure);
    const result = await registerJury(input, a.store, a.auth);
    assert.equal(result.ok, false);
    if (failure.includes("duplicate")) {
      assert.equal(result.code, "DUPLICATE");
      assert.equal(a.calls.includes("grant"), false);
      assert.equal(a.calls.includes("delete-auth"), false);
    } else if (failure === "network" || failure === "delete") {
      assert.equal(result.code, "RECONCILIATION_REQUIRED");
      assert.equal(a.calls.includes("delete-link"), false);
    } else {
      assert.equal(result.code, "ROLLED_BACK");
      assert.deepEqual(a.calls.slice(-2), ["delete-auth", "delete-link"]);
    }
  });
}
test("invalid jury input makes no external calls", async () => {
  const a = adapters();
  assert.equal((await registerJury({ ...input, email: "bad" }, a.store, a.auth)).code, "INVALID_INPUT");
  assert.deepEqual(a.calls, []);
});
test("DB lookup failure makes no Auth calls and can be retried", async () => {
  const a = adapters("lookup");
  assert.equal((await registerJury(input, a.store, a.auth)).code, "UNAVAILABLE");
  assert.deepEqual(a.calls, ["exists"]);
});
