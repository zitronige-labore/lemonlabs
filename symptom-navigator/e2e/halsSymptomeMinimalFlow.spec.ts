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

test("männlicher Patient mit Hals-Symptomen ohne Zusatzangaben wird korrekt gespeichert", async ({ page }) => {

  // navigate to start page
  await page.goto("/");
  await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

  // confirm disclaimer checkbox and continue
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

  // select "none of the above" for red flags and continue
  await page.getByLabel("Keines davon trifft zu").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  // fill in age: 28
  await page.getByPlaceholder("Zum Beispiel: 25").fill("28");

  // select gender: Männlich
  await page.locator('select').nth(0).selectOption("Männlich");

  await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

  // click "Hals" region on the SVG body map
  await page.getByRole("button", { name: "Hals", exact: true }).first().click();

  // select "Hals" as sub-region
  await page.getByRole("button", { name: "Hals", exact: true }).last().click();

  // continue to symptom categories
  await page.getByRole("button", { name: "Weiter" }).last().click();

  // select symptom category "Kehlkopf & Luftröhre"
  await page.getByRole("button", { name: /Kehlkopf & Luftröhre/ }).click();

  // select "Heiserkeit / Wegbrechen der Stimme"
  await page.getByLabel("Heiserkeit / Wegbrechen der Stimme").check();

  // select "Bellender, trockener, metallischer Husten"
  await page.getByLabel("Bellender, trockener, metallischer Husten").check();

  // continue
  await page.getByRole("button", { name: "Weiter" }).click();

  // do not add more symptoms
  await page.getByRole("button", { name: "nein" }).click();

  // leave all additional fields empty (no medication, no allergies, no conditions)

  // continue to check info screen
  await page.getByRole("button", { name: "weiter" }).click();

  // submit assessment
  await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

  // wait for AI result
  await expect(
    page.getByText(/Dringlichkeitsstufe/)
  ).toBeVisible({ timeout: 60_000 });

  // assert case data
  const dbCase = await getCaseFromDb();
  expect(dbCase).not.toBeNull();
  expect(dbCase.age).toBe(28);
  expect(dbCase.sex).toBe("m");
  expect(dbCase.pregnancy).toBe(false);

  // assert additional info was saved
  const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  expect(additionalInfo).not.toBeNull();

  // assert at least one symptom was saved
  const symptoms = await getSymptomsFromDb(dbCase.case_id);
  expect(symptoms.length).toBeGreaterThan(0);

  // assert all optional lists are empty
  const medication = await getMedicationFromDb(dbCase.case_id);
  expect(medication.length).toBe(0);

  const allergies = await getDetailsNoCertainCountFromDb(dbCase.case_id, "allergy");
  expect(allergies.length).toBe(0);

  const conditions = await getDetailsNoCertainCountFromDb(dbCase.case_id, "condition");
  expect(conditions.length).toBe(0);

  // assert AI recommendation was saved
  const recommendation = await getRecommendationFromDb(dbCase.case_id);
  expect(recommendation).not.toBeNull();
  expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
  expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  expect(recommendation.advice_text).toBeTruthy();
});
