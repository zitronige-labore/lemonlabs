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

test("männlicher Patient mit Nackenbeschwerden wird korrekt gespeichert", async ({ page }) => {

  // navigate to start page
  await page.goto("/");
  await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

  // confirm disclaimer checkbox and continue
  await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

  // select "none of the above" for red flags and continue
  await page.getByLabel("Keines davon trifft zu").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  // fill in age
  await page.getByPlaceholder("Zum Beispiel: 25").fill("42");

  // select gender: Männlich — no pregnancy field appears
  await page.locator('select').nth(0).selectOption("Männlich");

  await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

  // rotate to back view
  await page.getByRole("button", { name: "Zur Rückseite" }).click();

  // click "Nacken" region on the SVG body map
  await page.getByRole("button", { name: "Nacken", exact: true }).first().click();

  // select "Nacken" as sub-region from quick-select
  await page.getByRole("button", { name: "Nacken", exact: true }).last().click();

  // continue to symptom categories
  await page.getByRole("button", { name: "Weiter" }).last().click();

  // select symptom category "Verspannung & Bewegungsschmerz"
  await page.getByRole("button", { name: /Verspannung & Bewegungsschmerz/ }).click();

  // select symptoms via checkbox label
  await page.getByLabel("Schmerzhafte Muskelverhärtung (Myogelose)").check();

  // fill in pain intensity via range slider
  await page.locator('input[type="range"]').fill("5");

  await page.getByLabel("Eingeschränkte Drehung / Steifer Hals").check();

  // continue
  await page.getByRole("button", { name: "Weiter" }).click();

  // do not add more symptoms
  await page.getByRole("button", { name: "nein" }).click();

  // fill in allergies only
  await page.getByLabel("Es liegen Allergien vor").check();
  await page.getByPlaceholder("Allergien z.B. Pollen, Penicillin...").fill("Hausstaub");

  // leave medication and conditions empty

  // continue to check info screen
  await page.getByRole("button", { name: "weiter" }).click();

  // submit assessment
  await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

  // wait for AI result
  await expect(
    page.getByText(/Dringlichkeitsstufe/)
  ).toBeVisible({ timeout: 60_000 });

  // assert case was written to the database
  const dbCase = await getCaseFromDb();
  expect(dbCase).not.toBeNull();
  expect(dbCase.age).toBe(42);
  expect(dbCase.sex).toBe("m");
  expect(dbCase.pregnancy).toBe(false);

  // assert additional info was saved
  const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  expect(additionalInfo).not.toBeNull();

  // assert at least one symptom was saved
  const symptoms = await getSymptomsFromDb(dbCase.case_id);
  expect(symptoms.length).toBeGreaterThan(0);

  // assert allergy was saved
  const allergies = await getDetailsNoCertainCountFromDb(dbCase.case_id, "allergy");
  expect(allergies).toContain("Hausstaub");

  // assert medication list is empty (no medication entered)
  const medication = await getMedicationFromDb(dbCase.case_id);
  expect(medication.length).toBe(0);

  // assert conditions list is empty
  const conditions = await getDetailsNoCertainCountFromDb(dbCase.case_id, "condition");
  expect(conditions.length).toBe(0);

  // assert AI recommendation was saved
  const recommendation = await getRecommendationFromDb(dbCase.case_id);
  expect(recommendation).not.toBeNull();
  expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
  expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  expect(recommendation.advice_text).toBeTruthy();
});
