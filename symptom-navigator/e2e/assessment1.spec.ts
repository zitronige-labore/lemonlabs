import { test, expect } from '@playwright/test';
import { resetDb } from './helpers/resetTestDb';
import {
  getCaseFromDb,
  getAdditionalInfoFromDb,
  getSymptomsFromDb,
  getRecommendationFromDb
} from './helpers/dbAssert';

test.beforeEach(async () => {
  await resetDb();
});

test("complete assessment flow is saved correctly to the database", async ({ page }) => {

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
  await page.getByPlaceholder("Zum Beispiel: 25").fill("30");

  // select gender — no name attribute on select, use nth
  await page.locator('select').nth(0).selectOption("Weiblich");

  // pregnancy field appears conditionally after selecting "Weiblich"
  await page.locator('select').nth(1).selectOption("Nein");

  await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

  // click head region on the SVG body map
  await page.locator('path').first().click();

  // select sub-region button that appears after main region click
  await page.getByRole("button", { name: "Kopf" }).click();
  await page.getByRole("button", { name: "Weiter" }).last().click();

  // fill in symptom duration and pain intensity (BasisDetailsStep)
  await page.getByPlaceholder("Zum Beispiel: seit 2 Tagen").fill("seit 3 Tagen");
  await page.locator('input[type="range"]').fill("5");
  await page.getByRole("button", { name: "Weiter" }).click();

  // select symptom category
  await page.getByRole("button", { name: /Spannung & Druck/ }).click();

  // select symptom from list
  await page.getByRole("button", { name: /Dumpfer, drückender Schmerz/ }).click();
  await page.getByRole("button", { name: "Weiter" }).click();

  // skip free text symptom input
  await page.getByRole("button", { name: "Überspringen" }).click();

  // do not add more symptoms
  await page.getByRole("button", { name: "nein" }).click();

  // fill in optional medication field
  await page.getByLabel("Nehmen Sie aktuell Medikamente ein?").fill("Ibuprofen");

  // fill in allergies field
  await page.getByLabel("Sind Allergien bekannt?").fill("Pollen");

  // continue to check info screen
  await page.getByRole("button", { name: "weiter" }).click();

  // submit assessment — button is type="submit"
  await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

  // wait for AI result (generous timeout due to model response time)
  await expect(
    page.getByText(/Dringlichkeitsstufe/)
  ).toBeVisible({ timeout: 60_000 });

  // assert case was written to the database
  const dbCase = await getCaseFromDb();
  expect(dbCase).not.toBeNull();
  expect(dbCase.age).toBe(30);
  expect(dbCase.sex).toBe("w");
  expect(dbCase.pregnancy).toBe(false);

  // assert additional info was saved
  const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  expect(additionalInfo).not.toBeNull();

  // assert at least one symptom was saved
  const symptoms = await getSymptomsFromDb(dbCase.case_id);
  expect(symptoms.length).toBeGreaterThan(0);

  // assert AI recommendation was saved with a valid urgency level
  const recommendation = await getRecommendationFromDb(dbCase.case_id);
  expect(recommendation).not.toBeNull();
  expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
  expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  expect(recommendation.advice_text).toBeTruthy();
});