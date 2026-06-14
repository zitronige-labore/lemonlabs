# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assessment2.spec.ts >> männlicher Patient mit Nackenbeschwerden wird korrekt gespeichert
- Location: e2e/assessment2.spec.ts:15:5

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
  - paragraph: "Ihr persönlicher Zugangscode:"
  - paragraph: 7d0dbf3a-e149-4598-8c2f-757830d7d7d6
  - button "Kopieren"
  - paragraph: Mit diesem Code können Sie Ihre Daten später wieder abrufen.
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
  15  | test("männlicher Patient mit Nackenbeschwerden wird korrekt gespeichert", async ({ page }) => {
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
  29  |   // fill in age
  30  |   await page.getByPlaceholder("Zum Beispiel: 25").fill("42");
  31  | 
  32  |   // select gender: Männlich — no pregnancy field appears
  33  |   await page.locator('select').nth(0).selectOption("Männlich");
  34  | 
  35  |   await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();
  36  | 
  37  |   // click "Hals & Nacken" region on the SVG body map
  38  |   await page.getByRole("button", { name: "Hals & Nacken" }).click();
  39  | 
  40  |   // select "Nacken" as sub-region
  41  |   await page.getByRole("button", { name: "Nacken", exact: true }).click();
  42  | 
  43  |   // continue to symptom categories
  44  |   await page.getByRole("button", { name: "Weiter" }).last().click();
  45  | 
  46  |   // select symptom category "Verspannung & Bewegungsschmerz"
  47  |   await page.getByRole("button", { name: /Verspannung & Bewegungsschmerz/ }).click();
  48  | 
  49  |   // select symptoms via checkbox label
  50  |   await page.getByLabel("Schmerzhafte Muskelverhärtung (Myogelose)").check();
  51  | 
  52  |   // fill in pain intensity via range slider
  53  |   await page.locator('input[type="range"]').fill("5");
  54  | 
  55  |   await page.getByLabel("Eingeschränkte Drehung / Steifer Hals").check();
  56  | 
  57  |   // continue
  58  |   await page.getByRole("button", { name: "Weiter" }).click();
  59  | 
  60  |   // do not add more symptoms
  61  |   await page.getByRole("button", { name: "nein" }).click();
  62  | 
  63  |   // fill in allergies only
  64  |   await page.getByLabel("Sind Allergien bekannt?").fill("Hausstaub");
  65  | 
  66  |   // leave medication and conditions empty
  67  | 
  68  |   // continue to check info screen
  69  |   await page.getByRole("button", { name: "weiter" }).click();
  70  | 
  71  |   // submit assessment
  72  |   await page.getByRole("button", { name: "Einschätzung abschließen" }).click();
  73  | 
  74  |   // wait for AI result
  75  |   await expect(
  76  |     page.getByText(/Dringlichkeitsstufe/)
> 77  |   ).toBeVisible({ timeout: 60_000 });
      |     ^ Error: expect(locator).toBeVisible() failed
  78  | 
  79  |   // assert case was written to the database
  80  |   const dbCase = await getCaseFromDb();
  81  |   expect(dbCase).not.toBeNull();
  82  |   expect(dbCase.age).toBe(42);
  83  |   expect(dbCase.sex).toBe("m");
  84  |   expect(dbCase.pregnancy).toBe(false);
  85  | 
  86  |   // assert additional info was saved
  87  |   const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  88  |   expect(additionalInfo).not.toBeNull();
  89  | 
  90  |   // assert at least one symptom was saved
  91  |   const symptoms = await getSymptomsFromDb(dbCase.case_id);
  92  |   expect(symptoms.length).toBeGreaterThan(0);
  93  | 
  94  |   // assert allergy was saved
  95  |   const allergies = await getDetailsNoCertainCountFromDb(dbCase.case_id, "allergy");
  96  |   expect(allergies).toContain("Hausstaub");
  97  | 
  98  |   // assert medication list is empty (no medication entered)
  99  |   const medication = await getDetailsNoCertainCountFromDb(dbCase.case_id, "medication");
  100 |   expect(medication.length).toBe(0);
  101 | 
  102 |   // assert conditions list is empty
  103 |   const conditions = await getDetailsNoCertainCountFromDb(dbCase.case_id, "condition");
  104 |   expect(conditions.length).toBe(0);
  105 | 
  106 |   // assert AI recommendation was saved
  107 |   const recommendation = await getRecommendationFromDb(dbCase.case_id);
  108 |   expect(recommendation).not.toBeNull();
  109 |   expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
  110 |   expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  111 |   expect(recommendation.advice_text).toBeTruthy();
  112 | });
  113 | 
```