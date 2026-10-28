// Uses a locally installed browser. If Playwright is temporary, set
// AUTH_PLAYWRIGHT_MODULE to its absolute module directory before running.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
assert.equal(new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname, 'vkorjvgnamilszcnglkf.supabase.co', 'DEV project required');
const { chromium } = await import(process.env.AUTH_PLAYWRIGHT_MODULE
  ? pathToFileURL(path.join(process.env.AUTH_PLAYWRIGHT_MODULE, 'index.mjs')).href
  : 'playwright');

(async () => {
  const base = process.env.AUTH_TEST_BASE_URL || 'http://127.0.0.1:3101';
  assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    const pageErrors = [];
    let sensitiveConsoleOutput = false;
    page.on('pageerror', error => pageErrors.push(error.name));
    page.on('console', message => {
      if (/access_token|refresh_token|sb_secret_|service_role/i.test(message.text())) sensitiveConsoleOutput = true;
    });
    await page.goto(base + '/login');
    await page.getByRole('button', { name: 'Ingresar', exact: true }).click();
    await page.getByText('Ingresa tu correo electrónico.', { exact: true }).waitFor();
    await page.getByText('Ingresa tu contraseña.', { exact: true }).waitFor();
    assert.equal(await page.locator('#email').evaluate(el => el === document.activeElement), true);
    console.log('PASS blank validation and focus on email');

    await page.getByLabel('Correo electrónico').fill('invalid');
    await page.getByLabel('Contraseña', { exact: true }).fill('test-invalid-password');
    await page.getByRole('button', { name: 'Ingresar', exact: true }).click();
    await page.getByText('Ingresa un correo electrónico válido.', { exact: true }).waitFor();
    console.log('PASS invalid email validation');

    await page.getByLabel('Correo electrónico').fill(`auth-check-${Date.now()}@example.invalid`);
    await page.getByLabel('Contraseña', { exact: true }).fill('');
    await page.getByRole('button', { name: 'Ingresar', exact: true }).click();
    assert.equal(await page.locator('#password').evaluate(el => el === document.activeElement), true);
    await page.getByLabel('Contraseña', { exact: true }).fill('test-invalid-password');
    // Delay the REAL Server Action request, without replacing its response.
    await page.route('**/login', async route => {
      if (route.request().method() === 'POST') await new Promise(resolve => setTimeout(resolve, 700));
      await route.continue();
    });
    await page.getByRole('button', { name: 'Ingresar', exact: true }).click();
    await page.getByRole('button', { name: 'Ingresando...' }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Ingresando...' }).isDisabled(), true);
    assert.equal(await page.getByLabel('Correo electrónico').isDisabled(), true);
    await page.getByText('Correo o contraseña incorrectos.', { exact: true }).waitFor({ timeout: 20000 });
    assert.equal(await page.getByRole('button', { name: 'Ingresar', exact: true }).isEnabled(), true);
    console.log('PASS pending/disabled state and generic error for nonexistent DEV account');

    await context.setOffline(true);
    await page.getByRole('button', { name: 'Ingresar', exact: true }).click();
    await page.getByText('No pudimos conectar con el servicio. Revisa tu conexión e inténtalo de nuevo.', { exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Ingresar', exact: true }).isEnabled(), true);
    await context.setOffline(false);
    console.log('PASS offline error and retry enabled');

    await page.unroute('**/login');
    await page.goto(base + '/login');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('#email').evaluate(el => el === document.activeElement), true);
    await page.keyboard.type('invalid');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('#password').evaluate(el => el === document.activeElement), true);
    await page.keyboard.type('test');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.getByText('Ingresa un correo electrónico válido.', { exact: true }).waitFor();
    assert.equal(await page.locator('[aria-live="polite"]').count(), 1);
    console.log('PASS Tab/Enter submission, error focus and aria-live presence (no screen reader test)');

    const artifacts = path.join(process.cwd(), '.auth-artifacts');
    fs.mkdirSync(artifacts, { recursive: true });
    for (const [label, width, height] of [['desktop', 1280, 800], ['mobile', 375, 812]]) {
      await page.setViewportSize({ width, height });
      await page.goto(base + '/login');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      assert.equal(await page.getByRole('button', { name: 'Ingresar', exact: true }).isVisible(), true);
      await page.screenshot({ path: path.join(artifacts, `login-${label}.png`), fullPage: true });
      console.log(`PASS ${label}: visible form, no horizontal overflow; screenshot saved`);
    }
    for (const route of ['/admin', '/jurado']) {
      await page.goto(base + route);
      assert.equal(new URL(page.url()).pathname, '/login');
    }
    assert.deepEqual(pageErrors, []);
    assert.equal(sensitiveConsoleOutput, false);
    console.log('PASS anonymous browser redirects; no uncaught page exceptions');
  } finally { await browser.close(); }
})().catch(error => { console.error('Browser check failed:', error.message); process.exitCode = 1; });
