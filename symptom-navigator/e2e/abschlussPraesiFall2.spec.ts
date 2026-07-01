import { test, expect } from '@playwright/test';
import { resetDb } from './helpers/resetTestDb';
import { getCaseFromDb, getSymptomsFromDb, getRecommendationFromDb } from './helpers/dbAssert';

test.beforeEach(async () => {
  await resetDb();
});

test("Fall 2: Fieber, Schüttelfrost, Verwirrtheit, Atemnot -> Sepsis-Verdacht löst SOS-Popup aus", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

  await page.getByLabel("Keines davon trifft zu").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  // Basisdaten: 22J, weiblich, nicht schwanger
  await page.getByPlaceholder("Zum Beispiel: 25 (Neugeborene: 0)").fill("22");
  await page.locator('select').nth(0).selectOption("Weiblich");
  await page.locator('select').nth(1).selectOption("Nein"); // Schwangerschaft
  await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

  // Region "Allgemein (ganzer Körper)" hat keine Subregionen (getSubRegions liefert []),
  // "Weiter" führt daher direkt zu den Symptom-Checkboxen, ohne Kategorie-Zwischenseite
  await page.getByRole("button", { name: "Allgemein (ganzer Körper)" }).click();
  await page.getByRole("button", { name: "Weiter" }).last().click();

  // Deckt Fieber + Schüttelfrost ab
  await page.getByLabel("Schüttelfrost / Unkontrollierbares Zittern", { exact: true }).check();
  // Deckt Verwirrung + Atemschwierigkeiten ab (kombinierte Sepsis-Checkbox)
  await page.getByLabel("Verwirrtheit, Schläfrigkeit & Atembeschwerden", { exact: true }).check();

  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("button", { name: "nein" }).click();

  // Zusatzangaben: Gewicht/Größe
  await page.getByLabel("Gewicht in kg").fill("61");
  await page.getByLabel("Größe in cm").fill("167");

  await page.getByRole("button", { name: "weiter" }).click();
  await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

  // RedFlagScanPositivePopUp.tsx hat kein role="dialog", daher über sichtbaren Inhalt prüfen
  await expect(
    page.getByRole("heading", { name: "Ein Warnsignal wurde erkannt" })
  ).toBeVisible({ timeout: 60_000 });
  await expect(
    page.getByText(/Verwirrtheit, Schläfrigkeit & Atembeschwerden \+ Fieber ODER Schüttelfrost/)
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Notruf 112" })).toBeVisible();
  await expect(page.getByRole("link", { name: "112 anrufen" })).toBeVisible();

  // Fall wird trotz Notfall-Kurzschluss in der DB gespeichert (handleSaveForm läuft immer)
  const dbCase = await getCaseFromDb();
  expect(dbCase).not.toBeNull();
  expect(dbCase.age).toBe(22);
  expect(dbCase.sex).toBe("w");
  expect(dbCase.pregnancy).toBe(false);

  const symptoms = await getSymptomsFromDb(dbCase.case_id);
  expect(symptoms.length).toBe(2);

  // Bei RedFlag-Treffer wird sendDataToAi übersprungen -> keine Recommendation
  const recommendation = await getRecommendationFromDb(dbCase.case_id);
  expect(recommendation).toBeNull();
});