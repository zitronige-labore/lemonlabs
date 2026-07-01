import { test, expect } from '@playwright/test';
import { resetDb } from './helpers/resetTestDb';
import {
  getCaseFromDb,
  getSymptomsFromDb,
  getAdditionalInfoFromDb,
  getRecommendationFromDb,
} from './helpers/dbAssert';

test.beforeEach(async () => {
  await resetDb();
});

test("Fall 1: Mandelentzündung) -> Dringlichkeit 2-3", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

  // Keine akuten initialen Warnzeichen (Atemnot, Bewusstlosigkeit etc.)
  await page.getByLabel("Keines davon trifft zu").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  // Basisdaten: 22J, weiblich, nicht schwanger
  await page.getByPlaceholder("Zum Beispiel: 25 (Neugeborene: 0)").fill("22");
  await page.locator('select').nth(0).selectOption("Weiblich");
  await page.locator('select').nth(1).selectOption("Nein"); // Schwangerschaft
  await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

  // --- Region 1: Hals ---
  await page.getByRole("button", { name: "Hals", exact: true }).first().click();
  await page.getByRole("button", { name: "Hals", exact: true }).last().click();
  await page.getByRole("button", { name: "Weiter" }).last().click();

  // Kategorie "Mandeln & Mundhöhle" (step: halsMandeln)
  await page.getByRole("button", { name: "Mandeln & Mundhöhle" }).click();

  await page.getByLabel("Kloßige Sprache", { exact: true }).check();

  // "eitrige Mandeln" hat keine passende Checkbox in halsMandeln -> Sonstiges
  // (der Sonstiges-Button speichert die oben gesetzten Checkboxen inkl. Painscale automatisch mit)
  await page.getByRole("button", { name: "Sonstiges" }).click();
  await page
    .getByRole("textbox", { name: /Beschreiben Sie Ihre Beschwerden/ })
    .fill("Mandeln sehen eitrig aus");
  await page.getByRole("button", { name: "Weiter" }).click();

  // weitere Symptome ergänzen
  await page.getByRole("button", { name: "ja" }).click();

  // --- Region 2: Bauch -> Oberbauch (für Schluckbeschwerden) ---
  await page.getByRole("button", { name: "Bauch", exact: true }).click();
  await page.getByRole("button", { name: "Oberbauch links", exact: true }).last().click();
  await page.getByRole("button", { name: "Weiter" }).last().click();

  // Kategorie "Speiseröhre (Schluckbeschwerden)" (step: mdSpeiseroehre)
  await page.getByRole("button", { name: "Speiseröhre (Schluckbeschwerden)" }).click();

  await page.getByLabel("Schluckstörung (Nahrung bleibt stecken)", { exact: true }).check();
  await page
    .getByLabel("Schmerzstärke für Schluckstörung (Nahrung bleibt stecken)")
    .fill("5");
  await page.getByLabel("Schmerz direkt beim Schluckvorgang", { exact: true }).check();
  await page
    .getByLabel("Schmerzstärke für Schmerz direkt beim Schluckvorgang")
    .fill("6");

  // "Fieber" hat im gesamten Katalog keine eigene Checkbox -> Sonstiges
  await page.getByRole("button", { name: "Sonstiges" }).click();
  await page
    .getByRole("textbox", { name: /Beschreiben Sie Ihre Beschwerden/ })
    .fill("Fieber");
  await page.getByRole("button", { name: "Weiter" }).click();

  // keine weiteren Symptome
  await page.getByRole("button", { name: "nein" }).click();

  // Zusatzangaben: Gewicht/Größe/Temperatur gehören zu AdditionalInfoStep, nicht zu BasisStartStep
  await page.getByLabel("Gewicht in kg").fill("61");
  await page.getByLabel("Größe in cm").fill("167");
  await page.getByLabel("Haben Sie Temperatur gemessen?").fill("39.2");
  await page
    .getByLabel("Gibt es weitere wichtige Informationen?")
    .fill("Ich habe geoogelt und im Internet stand, dass es sich um gefährliche Abszesse handeln könnte");

  await page.getByRole("button", { name: "weiter" }).click();
  await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

  await expect(page.getByText(/Dringlichkeitsstufe/)).toBeVisible({ timeout: 60_000 });

  const dbCase = await getCaseFromDb();
  expect(dbCase).not.toBeNull();
  expect(dbCase.age).toBe(22);
  expect(dbCase.sex).toBe("w");
  expect(dbCase.pregnancy).toBe(false);

  const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  expect(additionalInfo).not.toBeNull();
  // DB-Spalte heißt laut dbActions.tsx "extrainfo" (nicht "extra_info")
  expect(additionalInfo.extrainfo).toContain("Abszesse");
  expect(Number(additionalInfo.temperature)).toBeCloseTo(39.2);

  // 3 strukturierte Checkboxen (1x halsMandeln, 2x mdSpeiseroehre) + 2 Freitext-Einträge (Sonstiges)
  const symptoms = await getSymptomsFromDb(dbCase.case_id);
  expect(symptoms.length).toBe(5);

  const recommendation = await getRecommendationFromDb(dbCase.case_id);
  expect(recommendation).not.toBeNull();
  expect(recommendation.urgency_level).toBeGreaterThanOrEqual(2);
  expect(recommendation.urgency_level).toBeLessThanOrEqual(3);
  expect(recommendation.advice_text).toBeTruthy();
});