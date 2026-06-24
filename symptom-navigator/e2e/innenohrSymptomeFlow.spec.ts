import { test, expect } from '@playwright/test';
import { resetDb } from './helpers/resetTestDb';
import {
  getCaseFromDb,
  getAdditionalInfoFromDb,
  getSymptomsFromDb,
  getRecommendationFromDb,
  getDetailsNoCertainCountFromDb,
  getMedicationFromDb
} from './helpers/dbAssert';

test.beforeEach(async () => {
  await resetDb();
});

test("älterer männlicher Patient mit Innenohr-Symptomen wird korrekt gespeichert", async ({ page }) => {

  // navigate to start page
  await page.goto("/");
  await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

  // confirm disclaimer checkbox and continue
  await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

  // select "none of the above" for red flags and continue
  await page.getByLabel("Keines davon trifft zu").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  // fill in age: 65
  await page.getByPlaceholder("Zum Beispiel: 25").fill("65");

  // select gender: Männlich
  await page.locator('select').nth(0).selectOption("Männlich");

  await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

  // click "Kopf & Gesicht" region on the SVG body map
  await page.getByRole("button", { name: "Kopf & Gesicht" }).click();

  // select "Ohren" as sub-region from quick-select
  await page.getByRole("button", { name: "Ohren", exact: true }).last().click();

  // continue to symptom categories
  await page.getByRole("button", { name: "Weiter" }).last().click();

  // select symptom category "innenohr"
  await page.getByRole("button", { name: /innenohr/ }).click();

  // select Tinnitus symptom
  await page.getByLabel("Tinnitus (Pfeifen, Brummen, Rauschen)").check();

  // select Hörsturz symptom
  await page.getByLabel("Hörsturz (Plötzliche Taubheit)").check();

  // continue
  await page.getByRole("button", { name: "Weiter" }).click();

  // do not add more symptoms
  await page.getByRole("button", { name: "nein" }).click();

  // fill in medication only
  await page.getByLabel("Einnahme von Medikamenten").check();
  await page.getByPlaceholder("z. B. Ibuprofen").fill("ASS 100");
  await page.getByPlaceholder("z. B. 400").fill("100");
  await page.getByLabel("Einheit*").selectOption("mg");
  await page.getByPlaceholder("z. B. 3", { exact: true }).fill("1");
  await page.getByLabel("pro*").selectOption("Tag");
  await page.getByLabel("seit wann*").fill("2026-06-20");

  // leave allergies and conditions empty

  // continue to check info screen
  await page.getByRole("button", { name: "weiter" }).click();

  // submit assessment
  await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

  // wait for AI result
  await expect(
    page.getByText(/Dringlichkeitsstufe/)
  ).toBeVisible({ timeout: 60_000 });

  // assert case data is correctly saved
  const dbCase = await getCaseFromDb();
  expect(dbCase).not.toBeNull();
  expect(dbCase.age).toBe(65);
  expect(dbCase.sex).toBe("m");
  expect(dbCase.pregnancy).toBe(false);

  // assert additional info was saved
  const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  expect(additionalInfo).not.toBeNull();

  // assert at least one symptom was saved
  const symptoms = await getSymptomsFromDb(dbCase.case_id);
  expect(symptoms.length).toBeGreaterThan(0);

  // assert medication was saved
  const medication = await getMedicationFromDb(dbCase.case_id);
  expect(medication).toContain("ASS 100");

  // assert allergy list is empty
  const allergies = await getDetailsNoCertainCountFromDb(dbCase.case_id, "allergy");
  expect(allergies.length).toBe(0);

  // assert AI recommendation was saved
  const recommendation = await getRecommendationFromDb(dbCase.case_id);
  expect(recommendation).not.toBeNull();
  expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
  expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  expect(recommendation.advice_text).toBeTruthy();
});
