import { test, expect } from '@playwright/test';
import { resetDb, pool } from './helpers/resetTestDb';
import { getRecommendationFromDb } from './helpers/dbAssert';

test.beforeEach(async () => {
  test.setTimeout(180_000);
  await resetDb();
});

test.describe("KI-Dringlichkeitsstufen Validierung", () => {

  test("Mittlere Dringlichkeit (Stufe 2-3) bei Nackenschmerzen mit Bewegungseinschränkung", async ({ page }) => {
    // 1. Starte Assessment
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

    await page.getByLabel("Keines davon trifft zu").check();
    await page.getByRole("button", { name: "Weiter" }).click();

    await page.getByPlaceholder("Zum Beispiel: 25").fill("42");
    await page.locator('select').nth(0).selectOption("Männlich");
    await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

    // rotate to back view
    await page.getByRole("button", { name: "Zur Rückseite" }).click();

    // click "Nacken" region on the SVG body map
    await page.getByRole("button", { name: "Nacken", exact: true }).first().click();

    // select "Nacken" as sub-region from quick-select
    await page.getByRole("button", { name: "Nacken", exact: true }).last().click();

    await page.getByRole("button", { name: "Weiter" }).last().click();

    // Verspannung & Bewegungsschmerz
    await page.getByRole("button", { name: /Verspannung & Bewegungsschmerz/ }).click();
    await page.getByLabel("Schmerzhafte Muskelverhärtung (Myogelose)").check();
    await page.locator('input[type="range"]').fill("5");
    await page.getByLabel("Eingeschränkte Drehung / Steifer Hals").check();
    await page.getByRole("button", { name: "Weiter" }).click();

    await page.getByRole("button", { name: "nein" }).click();
    await page.getByRole("button", { name: "weiter" }).click();
    await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

    // 2. Warte auf das KI-Ergebnis
    await expect(page.getByText(/Dringlichkeitsstufe/)).toBeVisible({ timeout: 150_000 });

    // 3. Extrahiere den Zugangscode
    const codeLocator = page.getByText(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    await expect(codeLocator).toBeVisible();
    const rawCode = await codeLocator.textContent();
    expect(rawCode).not.toBeNull();
    const accessCode = rawCode!.trim();

    // 4. Hole Empfehlung aus der DB und überprüfe die Dringlichkeit (Erwartet: 2 oder 3)
    const dbCaseResult = await pool.query(
      `SELECT case_id FROM cases WHERE access_code = $1`,
      [accessCode]
    );
    expect(dbCaseResult.rows.length).toBe(1);
    const caseId = dbCaseResult.rows[0].case_id;

    const recommendation = await getRecommendationFromDb(caseId);
    expect(recommendation).not.toBeNull();
    
    console.log(`[Test Medium Urgency] Empfangene Dringlichkeitsstufe: ${recommendation.urgency_level}`);
    expect(recommendation.urgency_level).toBeGreaterThanOrEqual(2);
    expect(recommendation.urgency_level).toBeLessThanOrEqual(3);
  });

  test("Hohe Dringlichkeit (Stufe 4-5) bei massiven Brustschmerzen (Red Flag)", async ({ page }) => {
    // 1. Starte Assessment
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

    await page.getByLabel("Keines davon trifft zu").check();
    await page.getByRole("button", { name: "Weiter" }).click();

    await page.getByPlaceholder("Zum Beispiel: 25").fill("55");
    await page.locator('select').nth(0).selectOption("Weiblich");
    await page.locator('select').nth(1).selectOption("Nein");
    await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

    // Brust -> Brust links
    await page.getByRole("button", { name: "Brust" }).click();
    await page.getByRole("button", { name: "Brust links", exact: true }).last().click();
    await page.getByRole("button", { name: "Weiter" }).last().click();

    // Engegefühl (Red Flag)
    await page.getByLabel("Engegefühl, massiver Druck oder Brennen (Red Flag)").check();
    await page.locator('input[type="range"]').fill("9");
    await page.getByRole("button", { name: "Weiter" }).click();

    await page.getByRole("button", { name: "nein" }).click();
    
    // Zusatzangaben: Beschwerden werden schlimmer
    await page.getByRole("combobox", { name: "Werden die Beschwerden stärker?" }).selectOption("Ja");
    await page.getByRole("button", { name: "weiter" }).click();
    await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

    // 2. Warte auf das KI-Ergebnis
    await expect(page.getByText(/Dringlichkeitsstufe/)).toBeVisible({ timeout: 150_000 });

    // 3. Extrahiere den Zugangscode
    const codeLocator = page.getByText(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    await expect(codeLocator).toBeVisible();
    const rawCode = await codeLocator.textContent();
    expect(rawCode).not.toBeNull();
    const accessCode = rawCode!.trim();

    // 4. Hole Empfehlung aus der DB und überprüfe die Dringlichkeit (Erwartet: 4 oder 5)
    const dbCaseResult = await pool.query(
      `SELECT case_id FROM cases WHERE access_code = $1`,
      [accessCode]
    );
    expect(dbCaseResult.rows.length).toBe(1);
    const caseId = dbCaseResult.rows[0].case_id;

    const recommendation = await getRecommendationFromDb(caseId);
    expect(recommendation).not.toBeNull();
    
    console.log(`[Test High Urgency] Empfangene Dringlichkeitsstufe: ${recommendation.urgency_level}`);
    expect(recommendation.urgency_level).toBeGreaterThanOrEqual(4);
    expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  });

  test("Geringe Dringlichkeit (Stufe 1-2) bei starkem Jucken im Gehörgang", async ({ page }) => {
    // 1. Starte Assessment
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

    await page.getByLabel("Keines davon trifft zu").check();
    await page.getByRole("button", { name: "Weiter" }).click();

    await page.getByPlaceholder("Zum Beispiel: 25").fill("25");
    await page.locator('select').nth(0).selectOption("Männlich");
    await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

    // Kopf & Gesicht -> Ohren
    await page.getByRole("button", { name: "Kopf & Gesicht" }).click();
    await page.getByRole("button", { name: "Ohren", exact: true }).last().click();
    await page.getByRole("button", { name: "Weiter" }).last().click();

    // Aussenohr -> Starkes Jucken im Gehörgang
    await page.getByRole("button", { name: /aussenohr/i }).click();
    await page.getByLabel("Starkes Jucken im Gehörgang").check();
    await page.getByRole("button", { name: "Weiter" }).click();

    await page.getByRole("button", { name: "nein" }).click();
    await page.getByRole("button", { name: "weiter" }).click();
    await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

    // 2. Warte auf das KI-Ergebnis
    await expect(page.getByText(/Dringlichkeitsstufe/)).toBeVisible({ timeout: 150_000 });

    // 3. Extrahiere den Zugangscode
    const codeLocator = page.getByText(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    await expect(codeLocator).toBeVisible();
    const rawCode = await codeLocator.textContent();
    expect(rawCode).not.toBeNull();
    const accessCode = rawCode!.trim();

    // 4. Hole Empfehlung aus der DB und überprüfe die Dringlichkeit (Erwartet: 1 oder 2)
    const dbCaseResult = await pool.query(
      `SELECT case_id FROM cases WHERE access_code = $1`,
      [accessCode]
    );
    expect(dbCaseResult.rows.length).toBe(1);
    const caseId = dbCaseResult.rows[0].case_id;

    const recommendation = await getRecommendationFromDb(caseId);
    expect(recommendation).not.toBeNull();
    
    console.log(`[Test Low Urgency] Empfangene Dringlichkeitsstufe: ${recommendation.urgency_level}`);
    expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
    expect(recommendation.urgency_level).toBeLessThanOrEqual(2);
  });

  test("Akuter lebensbedrohlicher Notfall (Stufe 4-5) bei explosionsartigem Vernichtungsschmerz", async ({ page }) => {
    // 1. Starte Assessment
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

    await page.getByLabel("Keines davon trifft zu").check();
    await page.getByRole("button", { name: "Weiter" }).click();

    await page.getByPlaceholder("Zum Beispiel: 25").fill("35");
    await page.locator('select').nth(0).selectOption("Divers");
    await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

    // Kopf & Gesicht -> Kopf
    await page.getByRole("button", { name: "Kopf & Gesicht" }).click();
    await page.getByRole("button", { name: "Kopf", exact: true }).last().click();
    await page.getByRole("button", { name: "Weiter" }).last().click();

    // Dringende Warnsignale (Kopf) -> Explosionsartiger Vernichtungsschmerz
    await page.getByRole("button", { name: /Dringende Warnsignale \(Kopf\)/ }).click();
    await page.getByLabel("Explosionsartiger Vernichtungsschmerz").check();
    await page.locator('input[type="range"]').fill("10");
    await page.getByRole("button", { name: "Weiter" }).click();

    await page.getByRole("button", { name: "nein" }).click();
    await page.getByRole("button", { name: "weiter" }).click();
    await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

    // 2. Warte auf das KI-Ergebnis
    await expect(page.getByText(/Dringlichkeitsstufe/)).toBeVisible({ timeout: 150_000 });

    // 3. Extrahiere den Zugangscode
    const codeLocator = page.getByText(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    await expect(codeLocator).toBeVisible();
    const rawCode = await codeLocator.textContent();
    expect(rawCode).not.toBeNull();
    const accessCode = rawCode!.trim();

    // 4. Hole Empfehlung aus der DB und überprüfe die Dringlichkeit (Erwartet: 4 oder 5)
    const dbCaseResult = await pool.query(
      `SELECT case_id FROM cases WHERE access_code = $1`,
      [accessCode]
    );
    expect(dbCaseResult.rows.length).toBe(1);
    const caseId = dbCaseResult.rows[0].case_id;

    const recommendation = await getRecommendationFromDb(caseId);
    expect(recommendation).not.toBeNull();
    
    console.log(`[Test Extreme Urgency] Empfangene Dringlichkeitsstufe: ${recommendation.urgency_level}`);
    expect(recommendation.urgency_level).toBeGreaterThanOrEqual(4);
    expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  });

  test("Sehr geringe Dringlichkeit (Stufe 1-2) bei mildem Räusperzwang", async ({ page }) => {
    // 1. Starte Assessment
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

    await page.getByLabel("Keines davon trifft zu").check();
    await page.getByRole("button", { name: "Weiter" }).click();

    await page.getByPlaceholder("Zum Beispiel: 25").fill("30");
    await page.locator('select').nth(0).selectOption("Weiblich");
    await page.locator('select').nth(1).selectOption("Nein");
    await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

    // click "Hals" region on the SVG body map
    await page.getByRole("button", { name: "Hals", exact: true }).first().click();

    // select "Hals" as sub-region from quick-select
    await page.getByRole("button", { name: "Hals", exact: true }).last().click();

    await page.getByRole("button", { name: "Weiter" }).last().click();

    // Rachenwand & Schlucken -> Räusperzwang
    await page.getByRole("button", { name: /Rachenwand & Schlucken/ }).click();
    await page.getByLabel("Räusperzwang (Ständiger Drang frei zu machen)").check();
    await page.getByRole("button", { name: "Weiter" }).click();

    await page.getByRole("button", { name: "nein" }).click();
    await page.getByRole("button", { name: "weiter" }).click();
    await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

    // 2. Warte auf das KI-Ergebnis
    await expect(page.getByText(/Dringlichkeitsstufe/)).toBeVisible({ timeout: 150_000 });

    // 3. Extrahiere den Zugangscode
    const codeLocator = page.getByText(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    await expect(codeLocator).toBeVisible();
    const rawCode = await codeLocator.textContent();
    expect(rawCode).not.toBeNull();
    const accessCode = rawCode!.trim();

    // 4. Hole Empfehlung aus der DB und überprüfe die Dringlichkeit (Erwartet: 1 oder 2)
    const dbCaseResult = await pool.query(
      `SELECT case_id FROM cases WHERE access_code = $1`,
      [accessCode]
    );
    expect(dbCaseResult.rows.length).toBe(1);
    const caseId = dbCaseResult.rows[0].case_id;

    const recommendation = await getRecommendationFromDb(caseId);
    expect(recommendation).not.toBeNull();
    
    console.log(`[Test Very Low Urgency] Empfangene Dringlichkeitsstufe: ${recommendation.urgency_level}`);
    expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
    expect(recommendation.urgency_level).toBeLessThanOrEqual(2);
  });

  test("Akuter medizinischer Notfall (Stufe 4-5) bei Kaffeesatz-Erbrechen", async ({ page }) => {
    // 1. Starte Assessment
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

    await page.getByLabel("Keines davon trifft zu").check();
    await page.getByRole("button", { name: "Weiter" }).click();

    await page.getByPlaceholder("Zum Beispiel: 25").fill("45");
    await page.locator('select').nth(0).selectOption("Männlich");
    await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

    // Bauch -> Oberbauch
    await page.getByRole("button", { name: "Bauch" }).click();
    await page.getByRole("button", { name: "Oberbauch links", exact: true }).last().click();
    await page.getByRole("button", { name: "Weiter" }).last().click();

    // Magen (Oberbauch) -> Kaffeesatz-Erbrechen
    await page.getByRole("button", { name: /Magen \(Oberbauch\)/ }).click();
    await page.getByLabel("Kaffeesatz-Erbrechen (Dunkel & krümelig)").check();
    await page.locator('input[type="range"]').fill("8");
    await page.getByRole("button", { name: "Weiter" }).click();

    await page.getByRole("button", { name: "nein" }).click();
    await page.getByRole("button", { name: "weiter" }).click();
    await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

    // 2. Warte auf das KI-Ergebnis
    await expect(page.getByText(/Dringlichkeitsstufe/)).toBeVisible({ timeout: 150_000 });

    // 3. Extrahiere den Zugangscode
    const codeLocator = page.getByText(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    await expect(codeLocator).toBeVisible();
    const rawCode = await codeLocator.textContent();
    expect(rawCode).not.toBeNull();
    const accessCode = rawCode!.trim();

    // 4. Hole Empfehlung aus der DB und überprüfe die Dringlichkeit (Erwartet: 4 oder 5)
    const dbCaseResult = await pool.query(
      `SELECT case_id FROM cases WHERE access_code = $1`,
      [accessCode]
    );
    expect(dbCaseResult.rows.length).toBe(1);
    const caseId = dbCaseResult.rows[0].case_id;

    const recommendation = await getRecommendationFromDb(caseId);
    expect(recommendation).not.toBeNull();
    
    console.log(`[Test High Urgency Magen] Empfangene Dringlichkeitsstufe: ${recommendation.urgency_level}`);
    expect(recommendation.urgency_level).toBeGreaterThanOrEqual(4);
    expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  });
});
