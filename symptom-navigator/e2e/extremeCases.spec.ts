import { test, expect } from '@playwright/test';
import { resetDb } from './helpers/resetTestDb';
import { getCaseFromDb, getSymptomsFromDb } from './helpers/dbAssert';
import { pool } from './helpers/resetTestDb';

test.beforeEach(async () => {
  await resetDb();
});

test("Extremfall: Mehr als 10 Symptome aus unterschiedlichen Körperregionen auswählen", async ({ page }) => {
  // 1. Starte Assessment
  await page.goto("/");
  await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

  await page.getByLabel("Keines davon trifft zu").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  await page.getByPlaceholder("Zum Beispiel: 25").fill("40");
  await page.locator('select').nth(0).selectOption("Divers");
  await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

  // --- REGION 1: Ohren (3 Symptome) ---
  await page.getByRole("button", { name: "Kopf & Gesicht" }).click();
  await page.getByRole("button", { name: "Ohren", exact: true }).last().click();
  await page.getByRole("button", { name: "Weiter" }).last().click();

  await page.getByRole("button", { name: /innenohr/i }).click();
  await page.getByLabel("Tinnitus (Pfeifen, Brummen, Rauschen)").check();
  await page.getByLabel("Hörsturz (Plötzliche Taubheit)").check();
  await page.getByLabel("Gefühl von Wasser im Ohr").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  // "ja" für weitere Symptome
  await page.getByRole("button", { name: "ja" }).click();

  // --- REGION 2: Kopf (2 Symptome) ---
  await page.getByRole("button", { name: "Kopf & Gesicht" }).click();
  await page.getByRole("button", { name: "Kopf", exact: true }).last().click();
  await page.getByRole("button", { name: "Weiter" }).last().click();

  await page.getByRole("button", { name: /Spannung & Druck im Kopf/ }).click();
  await page.getByLabel("Dumpfer, drückender Schmerz (beidseitig)").check();
  await page.getByLabel("Schwerer Druck auf dem gesamten Schädel").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  // "ja" für weitere Symptome
  await page.getByRole("button", { name: "ja" }).click();

  // --- REGION 3: Nacken (3 Symptome) ---
  await page.getByRole("button", { name: "Zur Rückseite" }).click();
  await page.getByRole("button", { name: "Nacken", exact: true }).first().click();
  await page.getByRole("button", { name: "Nacken", exact: true }).last().click();
  await page.getByRole("button", { name: "Weiter" }).last().click();

  await page.getByRole("button", { name: /Verspannung & Bewegungsschmerz/ }).click();
  await page.getByLabel("Schmerzhafte Muskelverhärtung (Myogelose)").check();
  await page.getByLabel("Eingeschränkte Drehung / Steifer Hals").check();
  await page.getByLabel("Knirschen bei Kopfbewegungen").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  // "ja" für weitere Symptome
  await page.getByRole("button", { name: "ja" }).click();

  // --- REGION 4: Hals (2 Symptome) ---
  await page.getByRole("button", { name: "Hals", exact: true }).first().click();
  await page.getByRole("button", { name: "Hals", exact: true }).last().click();
  await page.getByRole("button", { name: "Weiter" }).last().click();

  await page.getByRole("button", { name: /Kehlkopf & Luftröhre/ }).click();
  await page.getByLabel("Heiserkeit / Wegbrechen der Stimme").check();
  await page.getByLabel("Bellender, trockener, metallischer Husten").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  // "ja" für weitere Symptome (Freitext)
  await page.getByRole("button", { name: "ja" }).click();

  // --- REGION 5: Magen (Freitext) ---
  await page.getByRole("button", { name: "Bauch" }).click();
  await page.getByRole("button", { name: "Oberbauch links", exact: true }).last().click();
  await page.getByRole("button", { name: "Weiter" }).last().click();

  await page.getByRole("button", { name: /Sonstiges/ }).click();
  await page.getByRole("textbox", { name: /Beschreiben Sie Ihre Beschwerden/ }).fill("Starkes Sodbrennen");
  await page.getByRole("button", { name: "Weiter" }).click();

  // "nein" für keine weiteren Symptome
  await page.getByRole("button", { name: "nein" }).click();

  // 2. Zusatzangaben überspringen
  await page.getByRole("button", { name: "weiter" }).click();

  // 3. Auf der CheckInfo-Seite abschicken
  await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

  // 4. Auf Ergebnis warten
  await expect(page.getByText(/Dringlichkeitsstufe/)).toBeVisible({ timeout: 60_000 });

  // 5. Extrahiere den Zugangscode
  const codeLocator = page.getByText(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  await expect(codeLocator).toBeVisible();
  const rawCode = await codeLocator.textContent();
  expect(rawCode).not.toBeNull();
  const accessCode = rawCode!.trim();

  // 6. Datenbank-Prüfung über den exakten Zugriffscode
  const dbCaseResult = await pool.query(
    `SELECT case_id FROM cases WHERE access_code = $1`,
    [accessCode]
  );
  expect(dbCaseResult.rows.length).toBe(1);
  const caseId = dbCaseResult.rows[0].case_id;

  // Assert structured symptoms count is 10
  const symptoms = await getSymptomsFromDb(caseId);
  expect(symptoms.length).toBe(11);

  // Assert free-text symptom was saved
  const rawResult = await pool.query(
    `SELECT raw_symptoms FROM raw_text_symptoms
     INNER JOIN case_symptoms ON raw_text_symptoms.raw_id = case_symptoms.raw_id
     WHERE case_symptoms.case_id = $1`,
    [caseId]
  );
  expect(rawResult.rows.length).toBeGreaterThan(0);
  expect(rawResult.rows[0].raw_symptoms).toContain("Starkes Sodbrennen");
});
