// Read-only HTTP checks against an already-running production build. No login,
// credentials, Supabase writes, fake sessions or test-only application routes.
import assert from "node:assert/strict";
import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
assert.equal(new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname, "vkorjvgnamilszcnglkf.supabase.co", "DEV project required");
const base = process.env.AUTH_TEST_BASE_URL ?? "http://127.0.0.1:3101";
if (!["127.0.0.1", "localhost"].includes(new URL(base).hostname)) throw Error("Local server required");
for (const path of ["/admin", "/jurado", "/admin/nested", "/jurado/nested", "/admin/", "/jurado/"]) {
  let response = await fetch(base + path, { redirect: "manual" });
  // Next normalizes trailing slashes before Proxy.
  if (path.endsWith("/") && response.status === 308)
    response = await fetch(new URL(response.headers.get("location"), base), { redirect: "manual" });
  assert.equal(response.status, 307, path);
  assert.equal(new URL(response.headers.get("location"), base).pathname, "/login", path);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow", path);
  assert.match(response.headers.get("cache-control"), /no-store/, path);
  console.log(`PASS anonymous ${path}: redirect to /login; noindex header; no-store`);
}
const login = await fetch(base + "/login");
const html = await login.text();
assert.equal(login.status, 200);
assert.match(html, /<form/);
assert.match(html, /type="email"/);
assert.match(html, /type="password"/);
assert.match(html, /<html[^>]*lang="es"/);
assert.match(html, /name="robots" content="noindex, nofollow"/);
console.log("PASS /login: form, inputs, Spanish language and noindex HTML");
const project = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
const now = Math.floor(Date.now() / 1000);
const encode = value => Buffer.from(JSON.stringify(value)).toString("base64url");
const fakeToken = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({
  sub: "00000000-0000-0000-0000-000000000001", aud: "authenticated", role: "authenticated",
  exp: now + 3600, iat: now, app_metadata: { role: "ADMIN" },
})}.invalid-signature`;
const fakeSession = { access_token: fakeToken, refresh_token: "invalid-refresh-token", token_type: "bearer",
  expires_in: 3600, expires_at: now + 3600, user: { id: "00000000-0000-0000-0000-000000000001", app_metadata: { role: "ADMIN" } } };
const cookie = `sb-${project}-auth-token=base64-${encode(fakeSession)}`;
const invalid = await fetch(base + "/admin", { redirect: "manual", headers: { Cookie: cookie } });
assert.equal(invalid.status, 307);
assert.equal(new URL(invalid.headers.get("location"), base).pathname, "/login");
console.log("PASS forged ADMIN session cookie with invalid JWT signature cannot access /admin");
