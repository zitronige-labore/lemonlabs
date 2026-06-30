import { test, expect } from '@playwright/test';
import { resetDb, pool } from './helpers/resetTestDb';
import { getSymptomsFromDb } from './helpers/dbAssert';

test.beforeEach(async () => {
  await resetDb();
});

test("Symptome auf CheckInfo-Seite entfernen vor dem Absenden", async ({ page }) => {
  // 1. Starte Assessment
  await page.goto("/");
  await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

  await page.getByLabel("Keines davon trifft zu").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  await page.getByPlaceholder("Zum Beispiel: 25").fill("60");
  await page.locator('select').nth(0).selectOption("Männlich");
  await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

  // 2. Ohren -> Innenohr
  await page.getByRole("button", { name: "Kopf & Gesicht" }).click();
  // select "Ohren" as sub-region from quick-select
  await page.getByRole("button", { name: "Ohren", exact: true }).last().click();
  await page.getByRole("button", { name: "Weiter" }).last().click();

  await page.getByRole("button", { name: /innenohr/i }).click();

  // Beide Symptome auswählen
  await page.getByLabel("Tinnitus (Pfeifen, Brummen, Rauschen)").check();
  await page.getByLabel("Hörsturz (Plötzliche Taubheit)").check();

  await page.getByRole("button", { name: "Weiter" }).click();

  // 3. Keine weiteren Symptome
  await page.getByRole("button", { name: "nein" }).click();

  // 4. Zusatzangaben überspringen/weiter
  await page.getByRole("button", { name: "weiter" }).click();

  // 5. Überprüfung anzeigen
  await page.getByRole("button", { name: "Daten zur Überprüfung anzeigen" }).click();

  // Prüfen, ob beide Symptome gelistet sind
  await expect(page.locator('li', { hasText: 'Tinnitus' })).toBeVisible();
  await expect(page.locator('li', { hasText: 'Hörsturz' })).toBeVisible();

  // 6. "Hörsturz" entfernen
  await page.locator('li', { hasText: 'Hörsturz' }).getByRole('button', { name: 'Symptom entfernen' }).click();

  // Prüfen, ob es verschwunden ist
  await expect(page.locator('li', { hasText: 'Hörsturz' })).not.toBeVisible();
  await expect(page.locator('li', { hasText: 'Tinnitus' })).toBeVisible();

  // 7. Abschicken
  await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

  // 8. Auf Ergebnis warten
  await expect(page.getByText(/Dringlichkeitsstufe/)).toBeVisible({ timeout: 60_000 });

  // 9. Extrahiere den Zugangscode
  const codeLocator = page.getByText(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  await expect(codeLocator).toBeVisible();
  const rawCode = await codeLocator.textContent();
  expect(rawCode).not.toBeNull();
  const accessCode = rawCode!.trim();

  // 10. Datenbank-Prüfung über den exakten Zugriffscode
  const dbCaseResult = await pool.query(
    `SELECT case_id FROM cases WHERE access_code = $1`,
    [accessCode]
  );
  expect(dbCaseResult.rows.length).toBe(1);
  const caseId = dbCaseResult.rows[0].case_id;

  const symptoms = await getSymptomsFromDb(caseId);
  // Es sollte nur noch 1 Symptom in der DB existieren
  expect(symptoms.length).toBe(1);

  // Da getSymptomsFromDb nur die IDs speichert, holen wir die Details über einen Query oder prüfen
  // ob das verbleibende Tinnitus ist:
  // case_symptoms hat: case_id, symptom_id, name_de
  // Let's assert database details directly
  const tinnitusSymptom = symptoms.find((s: any) => s.name_de && s.name_de.includes("Tinnitus"));
  const hoersturzSymptom = symptoms.find((s: any) => s.name_de && s.name_de.includes("Hörsturz"));
  
  expect(tinnitusSymptom).toBeTruthy();
  expect(hoersturzSymptom).toBeFalsy();
});
