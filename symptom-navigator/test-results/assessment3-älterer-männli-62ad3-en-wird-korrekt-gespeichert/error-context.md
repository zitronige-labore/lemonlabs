# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assessment3.spec.ts >> älterer männlicher Patient mit Innenohr-Symptomen wird korrekt gespeichert
- Location: e2e/assessment3.spec.ts:15:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/Dringlichkeitsstufe/)
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 60000ms
  - waiting for getByText(/Dringlichkeitsstufe/)

```

```yaml
- main:
  - heading "Ersteinschätzung" [level=1]
  - paragraph: Die KI Auswertung ist fehlgeschlagen
  - button "KI-Begründung anzeigen"
  - paragraph: Ihre Angaben wurden erfasst.
  - button "Gespeicherte Daten anzeigen"
  - separator
  - button "Zur Startseite"
  - button "Kontakt"
  - button "Datenschutz"
  - button "Support"
  - button "Impressum"
  - button "Tutorial öffnen":
    - img
- alert
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { resetDb } from './helpers/resetTestDb';
  3   | import {
  4   |   getCaseFromDb,
  5   |   getAdditionalInfoFromDb,
  6   |   getSymptomsFromDb,
  7   |   getRecommendationFromDb,
  8   |   getDetailsNoCertainCountFromDb
  9   | } from './helpers/dbAssert';
  10  | 
  11  | test.beforeEach(async () => {
  12  |   await resetDb();
  13  | });
  14  | 
  15  | test("älterer männlicher Patient mit Innenohr-Symptomen wird korrekt gespeichert", async ({ page }) => {
  16  | 
  17  |   // navigate to start page
  18  |   await page.goto("/");
  19  |   await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  20  | 
  21  |   // confirm disclaimer checkbox and continue
  22  |   await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  23  |   await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
  24  | 
  25  |   // select "none of the above" for red flags and continue
  26  |   await page.getByLabel("Keines davon trifft zu").check();
  27  |   await page.getByRole("button", { name: "Weiter" }).click();
  28  | 
  29  |   // fill in age: 65
  30  |   await page.getByPlaceholder("Zum Beispiel: 25").fill("65");
  31  | 
  32  |   // select gender: Männlich
  33  |   await page.locator('select').nth(0).selectOption("Männlich");
  34  | 
  35  |   await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();
  36  | 
  37  |   // click "Kopf & Gesicht" region on the SVG body map
  38  |   await page.getByRole("button", { name: "Kopf & Gesicht" }).click();
  39  | 
  40  |   // select "Ohren" as sub-region
  41  |   await page.getByRole("button", { name: "Ohren", exact: true }).click();
  42  | 
  43  |   // continue to symptom categories
  44  |   await page.getByRole("button", { name: "Weiter" }).last().click();
  45  | 
  46  |   // select symptom category "innenohr"
  47  |   await page.getByRole("button", { name: /innenohr/ }).click();
  48  | 
  49  |   // select Tinnitus symptom
  50  |   await page.getByLabel("Tinnitus (Pfeifen, Brummen, Rauschen)").check();
  51  | 
  52  |   // select Hörsturz symptom
  53  |   await page.getByLabel("Hörsturz (Plötzliche Taubheit)").check();
  54  | 
  55  |   // continue
  56  |   await page.getByRole("button", { name: "Weiter" }).click();
  57  | 
  58  |   // do not add more symptoms
  59  |   await page.getByRole("button", { name: "nein" }).click();
  60  | 
  61  |   // fill in medication only
  62  |   await page.getByLabel("Nehmen Sie aktuell Medikamente ein?").fill("ASS 100");
  63  | 
  64  |   // leave allergies and conditions empty
  65  | 
  66  |   // continue to check info screen
  67  |   await page.getByRole("button", { name: "weiter" }).click();
  68  | 
  69  |   // submit assessment
  70  |   await page.getByRole("button", { name: "Einschätzung abschließen" }).click();
  71  | 
  72  |   // wait for AI result
  73  |   await expect(
  74  |     page.getByText(/Dringlichkeitsstufe/)
> 75  |   ).toBeVisible({ timeout: 60_000 });
      |     ^ Error: expect(locator).toBeVisible() failed
  76  | 
  77  |   // assert case data is correctly saved
  78  |   const dbCase = await getCaseFromDb();
  79  |   expect(dbCase).not.toBeNull();
  80  |   expect(dbCase.age).toBe(65);
  81  |   expect(dbCase.sex).toBe("m");
  82  |   expect(dbCase.pregnancy).toBe(false);
  83  | 
  84  |   // assert additional info was saved
  85  |   const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  86  |   expect(additionalInfo).not.toBeNull();
  87  | 
  88  |   // assert at least one symptom was saved
  89  |   const symptoms = await getSymptomsFromDb(dbCase.case_id);
  90  |   expect(symptoms.length).toBeGreaterThan(0);
  91  | 
  92  |   // assert medication was saved
  93  |   const medication = await getDetailsNoCertainCountFromDb(dbCase.case_id, "medication");
  94  |   expect(medication).toContain("ASS 100");
  95  | 
  96  |   // assert allergy list is empty
  97  |   const allergies = await getDetailsNoCertainCountFromDb(dbCase.case_id, "allergy");
  98  |   expect(allergies.length).toBe(0);
  99  | 
  100 |   // assert AI recommendation was saved
  101 |   const recommendation = await getRecommendationFromDb(dbCase.case_id);
  102 |   expect(recommendation).not.toBeNull();
  103 |   expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
  104 |   expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  105 |   expect(recommendation.advice_text).toBeTruthy();
  106 | });
  107 | 
```