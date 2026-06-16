# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assessment1.spec.ts >> complete assessment flow is saved correctly to the database
- Location: e2e/assessment1.spec.ts:15:5

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
  - paragraph: 3357e883-cdb6-440c-89a1-24c175306fca
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
  15  | test('complete assessment flow is saved correctly to the database', async ({ page }) => {
  16  | 
  17  |   // browser log
  18  |   page.on("console", (msg) => console.log("BROWSER LOG:", msg.text()));
  19  | 
  20  |   // navigate to start page
  21  |   await page.goto("/");
  22  |   await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  23  | 
  24  |   // confirm disclaimer checkbox and continue
  25  |   await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  26  |   await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
  27  | 
  28  |   // select "none of the above" for red flags and continue
  29  |   await page.getByLabel("Keines davon trifft zu").check();
  30  |   await page.getByRole("button", { name: "Weiter" }).click();
  31  | 
  32  |   // fill in age
  33  |   await page.getByPlaceholder("Zum Beispiel: 25").fill("30");
  34  | 
  35  |   // select gender — no name attribute on select, use nth
  36  |   await page.locator('select').nth(0).selectOption("Weiblich");
  37  | 
  38  |   // pregnancy field appears conditionally after selecting "Weiblich"
  39  |   await page.locator('select').nth(1).selectOption("Nein");
  40  | 
  41  |   await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();
  42  | 
  43  |   // click "Kopf & Gesicht" region on the SVG body map via aria-label
  44  |   await page.getByRole("button", { name: "Kopf & Gesicht" }).click();
  45  | 
  46  |   // select "Kopf" as sub-region from the buttons that appear below
  47  |   await page.getByRole("button", { name: "Kopf", exact: true }).click();
  48  | 
  49  |   // continue to symptom categories
  50  |   await page.getByRole("button", { name: "Weiter" }).last().click();
  51  | 
  52  |   // select symptom category
  53  |   await page.getByRole("button", { name: /Spannung & Druck im Kopf/ }).click();
  54  | 
  55  |   // select symptom via checkbox label — symptoms are checkboxes not buttons
  56  |   await page.getByLabel("Dumpfer, drückender Schmerz (beidseitig)").check();
  57  | 
  58  |   // fill in symptom duration and pain intensity
  59  |   await page.locator('input[type="range"]').fill("7");
  60  | 
  61  |     // select symptom from list
  62  |   await page.getByLabel("Schwerer Druck auf dem gesamten Schädel").check();
  63  | 
  64  |   // continue
  65  |   await page.getByRole("button", { name: "Weiter" }).click();
  66  | 
  67  |   // do not add more symptoms
  68  |   await page.getByRole("button", { name: "nein" }).click();
  69  | 
  70  | 
  71  |   // fill in optional medication field
  72  |   await page.getByLabel("Nehmen Sie aktuell Medikamente ein?").fill("Ibuprofen");
  73  | 
  74  |   // fill in allergies field
  75  |   await page.getByLabel("Sind Allergien bekannt?").fill("Pollen");
  76  | 
  77  |   // select condition via checkbox
  78  |   await page.getByLabel("Bluthochdruck").check();
  79  | 
  80  |   // continue to check info screen
  81  |   await page.getByRole("button", { name: "weiter" }).click();
  82  | 
  83  |   // submit assessment — button is type="submit"
  84  |   await page.getByRole("button", { name: "Einschätzung abschließen" }).click();
  85  | 
  86  |   // wait for AI result (generous timeout due to model response time)
  87  |   await expect(
  88  |     page.getByText(/Dringlichkeitsstufe/)
> 89  |   ).toBeVisible({ timeout: 60_000 });
      |     ^ Error: expect(locator).toBeVisible() failed
  90  | 
  91  |   // assert case was written to the database
  92  |   const dbCase = await getCaseFromDb();
  93  |   expect(dbCase).not.toBeNull();
  94  |   expect(dbCase.age).toBe(30);
  95  |   expect(dbCase.sex).toBe("w");
  96  |   expect(dbCase.pregnancy).toBe(false);
  97  | 
  98  |   // assert additional info was saved
  99  |   const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  100 |   expect(additionalInfo).not.toBeNull();
  101 | 
  102 |   // assert at least one symptom was saved
  103 |   const symptoms = await getSymptomsFromDb(dbCase.case_id);
  104 |   expect(symptoms.length).toBeGreaterThan(0);
  105 | 
  106 |   // assert allergies were saved
  107 | const allergies = await getDetailsNoCertainCountFromDb(dbCase.case_id, "allergy");
  108 | expect(allergies).toContain("Pollen");
  109 | 
  110 | // assert medication was saved
  111 | const medication = await getDetailsNoCertainCountFromDb(dbCase.case_id, "medication");
  112 | expect(medication).toContain("Ibuprofen");
  113 | 
  114 | // assert conditions were saved
  115 | const conditions = await getDetailsNoCertainCountFromDb(dbCase.case_id, "condition");
  116 | expect(conditions).toContain("Bluthochdruck");
  117 | 
  118 |   // assert AI recommendation was saved with a valid urgency level
  119 |   const recommendation = await getRecommendationFromDb(dbCase.case_id);
  120 |   expect(recommendation).not.toBeNull();
  121 |   expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
  122 |   expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  123 |   expect(recommendation.advice_text).toBeTruthy();
  124 | });
```