# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assessment1.spec.ts >> complete assessment flow is saved correctly to the database
- Location: e2e\assessment1.spec.ts:14:5

# Error details

```
Error: locator.fill: Test ended.
Call log:
  - waiting for getByPlaceholder('Zum Beispiel: seit 2 Tagen')

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { resetDb } from './helpers/resetTestDb';
  3   | import {
  4   |   getCaseFromDb,
  5   |   getAdditionalInfoFromDb,
  6   |   getSymptomsFromDb,
  7   |   getRecommendationFromDb
  8   | } from './helpers/dbAssert';
  9   | 
  10  | test.beforeEach(async () => {
  11  |   await resetDb();
  12  | });
  13  | 
  14  | test("complete assessment flow is saved correctly to the database", async ({ page }) => {
  15  | 
  16  |   // navigate to start page
  17  |   await page.goto("/");
  18  |   await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  19  | 
  20  |   // confirm disclaimer checkbox and continue
  21  |   await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  22  |   await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
  23  | 
  24  |   // select "none of the above" for red flags and continue
  25  |   await page.getByLabel("Keines davon trifft zu").check();
  26  |   await page.getByRole("button", { name: "Weiter" }).click();
  27  | 
  28  |   // fill in age
  29  |   await page.getByPlaceholder("Zum Beispiel: 25").fill("30");
  30  | 
  31  |   // select gender — no name attribute on select, use nth
  32  |   await page.locator('select').nth(0).selectOption("Weiblich");
  33  | 
  34  |   // pregnancy field appears conditionally after selecting "Weiblich"
  35  |   await page.locator('select').nth(1).selectOption("Nein");
  36  | 
  37  |   await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();
  38  | 
  39  |   // click head region on the SVG body map
  40  |   await page.locator('path').first().click();
  41  | 
  42  |   // click head region on the SVG body map by relative coordinates
  43  |   const svg = page.locator('svg[aria-label="Interaktive Körperkarte zur Auswahl der Körperregion"]');
  44  |   const svgBox = await svg.boundingBox();
  45  |   await svg.click({
  46  |     position: {
  47  |       x: svgBox!.width * (110 / 220),
  48  |       y: svgBox!.height * (40 / 480),
  49  |     }
  50  | });
  51  | 
  52  |   // fill in symptom duration and pain intensity (BasisDetailsStep)
> 53  |   await page.getByPlaceholder("Zum Beispiel: seit 2 Tagen").fill("seit 3 Tagen");
      |                                                             ^ Error: locator.fill: Test ended.
  54  |   await page.locator('input[type="range"]').fill("5");
  55  |   await page.getByRole("button", { name: "Weiter" }).click();
  56  | 
  57  |   // select symptom category
  58  |   await page.getByRole("button", { name: /Spannung & Druck/ }).click();
  59  | 
  60  |   // select symptom from list
  61  |   await page.getByRole("button", { name: /Dumpfer, drückender Schmerz/ }).click();
  62  |   await page.getByRole("button", { name: "Weiter" }).click();
  63  | 
  64  |   // skip free text symptom input
  65  |   await page.getByRole("button", { name: "Überspringen" }).click();
  66  | 
  67  |   // do not add more symptoms
  68  |   await page.getByRole("button", { name: "nein" }).click();
  69  | 
  70  |   // fill in optional medication field
  71  |   await page.getByLabel("Nehmen Sie aktuell Medikamente ein?").fill("Ibuprofen");
  72  | 
  73  |   // fill in allergies field
  74  |   await page.getByLabel("Sind Allergien bekannt?").fill("Pollen");
  75  | 
  76  |   // continue to check info screen
  77  |   await page.getByRole("button", { name: "weiter" }).click();
  78  | 
  79  |   // submit assessment — button is type="submit"
  80  |   await page.getByRole("button", { name: "Einschätzung abschließen" }).click();
  81  | 
  82  |   // wait for AI result (generous timeout due to model response time)
  83  |   await expect(
  84  |     page.getByText(/Dringlichkeitsstufe/)
  85  |   ).toBeVisible({ timeout: 60_000 });
  86  | 
  87  |   // assert case was written to the database
  88  |   const dbCase = await getCaseFromDb();
  89  |   expect(dbCase).not.toBeNull();
  90  |   expect(dbCase.age).toBe(30);
  91  |   expect(dbCase.sex).toBe("w");
  92  |   expect(dbCase.pregnancy).toBe(false);
  93  | 
  94  |   // assert additional info was saved
  95  |   const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  96  |   expect(additionalInfo).not.toBeNull();
  97  | 
  98  |   // assert at least one symptom was saved
  99  |   const symptoms = await getSymptomsFromDb(dbCase.case_id);
  100 |   expect(symptoms.length).toBeGreaterThan(0);
  101 | 
  102 |   // assert AI recommendation was saved with a valid urgency level
  103 |   const recommendation = await getRecommendationFromDb(dbCase.case_id);
  104 |   expect(recommendation).not.toBeNull();
  105 |   expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
  106 |   expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  107 |   expect(recommendation.advice_text).toBeTruthy();
  108 | });
```