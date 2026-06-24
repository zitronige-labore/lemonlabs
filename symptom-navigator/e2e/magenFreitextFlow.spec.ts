import { test, expect } from '@playwright/test';
import { resetDb } from './helpers/resetTestDb';
import {
  getCaseFromDb,
  getAdditionalInfoFromDb,
  getSymptomsFromDb,
  getRecommendationFromDb,
  getDetailsNoCertainCountFromDb
} from './helpers/dbAssert';
import { pool } from './helpers/resetTestDb';

test.beforeEach(async () => {
  await resetDb();
});

test("diverse Person mit Magenbeschwerden und Freitexteingabe wird korrekt gespeichert", async ({ page }) => {

  // navigate to start page
  await page.goto("/");
  await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

  // confirm disclaimer checkbox and continue
  await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

  // select "none of the above" for red flags and continue
  await page.getByLabel("Keines davon trifft zu").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  // fill in age: 45
  await page.getByPlaceholder("Zum Beispiel: 25").fill("45");

  // select gender: Divers
  await page.locator('select').nth(0).selectOption("Divers");

  await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

  // click "Bauch" region on the SVG body map
  await page.getByRole("button", { name: "Bauch" }).click();

  // select "Oberbauch links" as sub-region from quick-select
  await page.getByRole("button", { name: "Oberbauch links", exact: true }).last().click();

  // continue to symptom categories
  await page.getByRole("button", { name: "Weiter" }).last().click();

  // select symptom category "Magen (Oberbauch)"
  await page.getByRole("button", { name: /Magen \(Oberbauch\)/ }).click();

  // select symptom "Nüchternschmerz"
  await page.getByLabel("Nüchternschmerz (besser nach dem Essen)").check();

  // fill in pain scale
  await page.locator('input[type="range"]').fill("6");

  // continue to "Weiter" then go to text input via "Sonstiges"
  await page.getByRole("button", { name: "Weiter" }).click();

  // choose to add another symptom — this time via free text
  await page.getByRole("button", { name: "ja" }).click();

  // select another region: Bauch and Oberbauch again
  await page.getByRole("button", { name: "Bauch" }).click();
  await page.getByRole("button", { name: "Oberbauch links", exact: true }).last().click();
  await page.getByRole("button", { name: "Weiter" }).last().click();

  // use "Sonstiges" to get to free text input
  await page.getByRole("button", { name: /Sonstiges/ }).click();

  // fill in free text symptom
await page.getByRole("textbox", { name: /Beschreiben Sie Ihre Beschwerden/ })
  .fill("Starkes Brennen im Oberbauch nach dem Essen");


  // continue from text input
  await page.getByRole("button", { name: "Weiter" }).click();

  // do not add more symptoms
  await page.getByRole("button", { name: "nein" }).click();

  // fill in condition: Diabetes Typ 1
  await page.getByLabel("Es liegen Vorerkrankungen vor").check();
  await page.getByPlaceholder("Vorerkrankung (z. B. Diabetes, Bluthochdruck)").fill("Diabetes Typ 1");

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
  expect(dbCase.age).toBe(45);
  expect(dbCase.sex).toBe("d");

  // assert additional info was saved
  const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  expect(additionalInfo).not.toBeNull();

  // assert symptoms were saved
  const symptoms = await getSymptomsFromDb(dbCase.case_id);
  expect(symptoms.length).toBeGreaterThan(0);

  // assert condition was saved
  const conditions = await getDetailsNoCertainCountFromDb(dbCase.case_id, "condition");
  expect(conditions).toContain("Diabetes Typ 1");

  // assert raw text symptom was saved in raw_text_symptoms table
  const rawResult = await pool.query(
    `SELECT raw_symptoms FROM raw_text_symptoms
     INNER JOIN case_symptoms ON raw_text_symptoms.raw_id = case_symptoms.raw_id
     WHERE case_symptoms.case_id = $1`,
    [dbCase.case_id]
  );
  expect(rawResult.rows.length).toBeGreaterThan(0);
  expect(rawResult.rows[0].raw_symptoms).toContain("Brennen im Oberbauch");

  // assert AI recommendation was saved
  const recommendation = await getRecommendationFromDb(dbCase.case_id);
  expect(recommendation).not.toBeNull();
  expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
  expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  expect(recommendation.advice_text).toBeTruthy();
});
