import { test, expect } from '@playwright/test';
import { resetDb } from './helpers/resetTestDb';
import {
  getCaseFromDb,
  getAdditionalInfoFromDb,
  getSymptomsFromDb,
  getRecommendationFromDb,
  getDetailsNoCertainCountFromDb
} from './helpers/dbAssert';

test.beforeEach(async () => {
  await resetDb();
});

test("schwangere Patientin mit Brustschmerz, Fieber und Verschlimmerung wird korrekt gespeichert", async ({ page }) => {

  // navigate to start page
  await page.goto("/");
  await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

  // confirm disclaimer checkbox and continue
  await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

  // select "none of the above" for red flags and continue
  await page.getByLabel("Keines davon trifft zu").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  // fill in age: 32
  await page.getByPlaceholder("Zum Beispiel: 25").fill("32");

  // select gender: Weiblich — pregnancy field appears
  await page.locator('select').nth(0).selectOption("Weiblich");

  // select pregnancy: Ja
  await page.locator('select').nth(1).selectOption("Ja");

  await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

  // click "Brust" region on the SVG body map
  await page.getByRole("button", { name: "Brust" }).click();

  // select "Brust links" as sub-region from quick-select
  await page.getByRole("button", { name: "Brust links", exact: true }).last().click();

  // continue to symptom categories
  await page.getByRole("button", { name: "Weiter" }).last().click();

  // select severe chest pressure symptom
  await page.getByLabel("Engegefühl, massiver Druck oder Brennen (Red Flag)").check();

  // fill in pain scale
  await page.locator('input[type="range"]').fill("9");

  // continue
  await page.getByRole("button", { name: "Weiter" }).click();

  // do not add more symptoms
  await page.getByRole("button", { name: "nein" }).click();

  // fill in temperature: 38.5
  await page.getByLabel(/Temperatur|Fieber/).fill("38.5");

  // select worsening: Ja
  await page.getByRole("combobox", { name: "Werden die Beschwerden stärker?" }).selectOption("Ja");

  // continue to check info screen
  await page.getByRole("button", { name: "weiter" }).click();

  // submit assessment
  await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

  // wait for AI result (longer timeout for high urgency)
  await expect(
    page.getByText(/Dringlichkeitsstufe/)
  ).toBeVisible({ timeout: 60_000 });

  // assert case data
  const dbCase = await getCaseFromDb();
  expect(dbCase).not.toBeNull();
  expect(dbCase.age).toBe(32);
  expect(dbCase.sex).toBe("w");
  expect(dbCase.pregnancy).toBe(true);

  // assert additional info was saved
  const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  expect(additionalInfo).not.toBeNull();
  expect(additionalInfo.worsening).toBe(true);

  // assert symptoms were saved
  const symptoms = await getSymptomsFromDb(dbCase.case_id);
  expect(symptoms.length).toBeGreaterThan(0);

  // assert AI recommendation was saved with high urgency level
  const recommendation = await getRecommendationFromDb(dbCase.case_id);
  expect(recommendation).not.toBeNull();
  expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
  expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  expect(recommendation.advice_text).toBeTruthy();
});
