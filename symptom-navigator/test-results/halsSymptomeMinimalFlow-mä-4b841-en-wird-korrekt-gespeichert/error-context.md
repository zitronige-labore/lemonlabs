# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: halsSymptomeMinimalFlow.spec.ts >> männlicher Patient mit Hals-Symptomen ohne Zusatzangaben wird korrekt gespeichert
- Location: e2e/halsSymptomeMinimalFlow.spec.ts:15:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/Dringlichkeitsstufe/)
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 60000ms
  - waiting for getByText(/Dringlichkeitsstufe/)

```

```yaml
- main:
  - heading "Ersteinschätzung" [level=1]
  - button "Daten zur Überprüfung anzeigen"
  - button "Einschätzung abschließen"
  - paragraph: KI-Antwort wird geladen...
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
  15  | test("männlicher Patient mit Hals-Symptomen ohne Zusatzangaben wird korrekt gespeichert", async ({ page }) => {
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
  29  |   // fill in age: 28
  30  |   await page.getByPlaceholder("Zum Beispiel: 25").fill("28");
  31  | 
  32  |   // select gender: Männlich
  33  |   await page.locator('select').nth(0).selectOption("Männlich");
  34  | 
  35  |   await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();
  36  | 
  37  |   // click "Hals & Nacken" region on the SVG body map
  38  |   await page.getByRole("button", { name: "Hals & Nacken" }).click();
  39  | 
  40  |   // select "Hals" as sub-region
  41  |   await page.getByRole("button", { name: "Hals", exact: true }).click();
  42  | 
  43  |   // continue to symptom categories
  44  |   await page.getByRole("button", { name: "Weiter" }).last().click();
  45  | 
  46  |   // select symptom category "Kehlkopf & Luftröhre"
  47  |   await page.getByRole("button", { name: /Kehlkopf & Luftröhre/ }).click();
  48  | 
  49  |   // select "Heiserkeit / Wegbrechen der Stimme"
  50  |   await page.getByLabel("Heiserkeit / Wegbrechen der Stimme").check();
  51  | 
  52  |   // select "Bellender, trockener, metallischer Husten"
  53  |   await page.getByLabel("Bellender, trockener, metallischer Husten").check();
  54  | 
  55  |   // continue
  56  |   await page.getByRole("button", { name: "Weiter" }).click();
  57  | 
  58  |   // do not add more symptoms
  59  |   await page.getByRole("button", { name: "nein" }).click();
  60  | 
  61  |   // leave all additional fields empty (no medication, no allergies, no conditions)
  62  | 
  63  |   // continue to check info screen
  64  |   await page.getByRole("button", { name: "weiter" }).click();
  65  | 
  66  |   // submit assessment
  67  |   await page.getByRole("button", { name: "Einschätzung abschließen" }).click();
  68  | 
  69  |   // wait for AI result
  70  |   await expect(
  71  |     page.getByText(/Dringlichkeitsstufe/)
> 72  |   ).toBeVisible({ timeout: 60_000 });
      |     ^ Error: expect(locator).toBeVisible() failed
  73  | 
  74  |   // assert case data
  75  |   const dbCase = await getCaseFromDb();
  76  |   expect(dbCase).not.toBeNull();
  77  |   expect(dbCase.age).toBe(28);
  78  |   expect(dbCase.sex).toBe("m");
  79  |   expect(dbCase.pregnancy).toBe(false);
  80  | 
  81  |   // assert additional info was saved
  82  |   const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  83  |   expect(additionalInfo).not.toBeNull();
  84  | 
  85  |   // assert at least one symptom was saved
  86  |   const symptoms = await getSymptomsFromDb(dbCase.case_id);
  87  |   expect(symptoms.length).toBeGreaterThan(0);
  88  | 
  89  |   // assert all optional lists are empty
  90  |   const medication = await getDetailsNoCertainCountFromDb(dbCase.case_id, "medication");
  91  |   expect(medication.length).toBe(0);
  92  | 
  93  |   const allergies = await getDetailsNoCertainCountFromDb(dbCase.case_id, "allergy");
  94  |   expect(allergies.length).toBe(0);
  95  | 
  96  |   const conditions = await getDetailsNoCertainCountFromDb(dbCase.case_id, "condition");
  97  |   expect(conditions.length).toBe(0);
  98  | 
  99  |   // assert AI recommendation was saved
  100 |   const recommendation = await getRecommendationFromDb(dbCase.case_id);
  101 |   expect(recommendation).not.toBeNull();
  102 |   expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
  103 |   expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  104 |   expect(recommendation.advice_text).toBeTruthy();
  105 | });
  106 | 
```