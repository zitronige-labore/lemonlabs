# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assessment5.spec.ts >> schwangere Patientin mit Brustschmerz, Fieber und Verschlimmerung wird korrekt gespeichert
- Location: e2e/assessment5.spec.ts:15:5

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
  - paragraph: 2f2d775a-d34a-4991-9a08-620b29846f2f
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
  15  | test("schwangere Patientin mit Brustschmerz, Fieber und Verschlimmerung wird korrekt gespeichert", async ({ page }) => {
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
  29  |   // fill in age: 32
  30  |   await page.getByPlaceholder("Zum Beispiel: 25").fill("32");
  31  | 
  32  |   // select gender: Weiblich — pregnancy field appears
  33  |   await page.locator('select').nth(0).selectOption("Weiblich");
  34  | 
  35  |   // select pregnancy: Ja
  36  |   await page.locator('select').nth(1).selectOption("Ja");
  37  | 
  38  |   await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();
  39  | 
  40  |   // click "Brust" region on the SVG body map
  41  |   await page.getByRole("button", { name: "Brust" }).click();
  42  | 
  43  |   // select "Brust links" as sub-region
  44  |   await page.getByRole("button", { name: "Brust links", exact: true }).click();
  45  | 
  46  |   // continue to symptom categories
  47  |   await page.getByRole("button", { name: "Weiter" }).last().click();
  48  | 
  49  |   // select severe chest pressure symptom
  50  |   await page.getByLabel("Engegefühl, massiver Druck oder Brennen (Red Flag)").check();
  51  | 
  52  |   // fill in pain scale
  53  |   await page.locator('input[type="range"]').fill("9");
  54  | 
  55  |   // continue
  56  |   await page.getByRole("button", { name: "Weiter" }).click();
  57  | 
  58  |   // do not add more symptoms
  59  |   await page.getByRole("button", { name: "nein" }).click();
  60  | 
  61  |   // fill in temperature: 38.5
  62  |   await page.getByLabel(/Temperatur|Fieber/).fill("38.5");
  63  | 
  64  |   // select worsening: Ja
  65  |   await page.getByRole("combobox", { name: "Werden die Beschwerden stärker?" }).selectOption("Ja");
  66  | 
  67  |   // continue to check info screen
  68  |   await page.getByRole("button", { name: "weiter" }).click();
  69  | 
  70  |   // submit assessment
  71  |   await page.getByRole("button", { name: "Einschätzung abschließen" }).click();
  72  | 
  73  |   // wait for AI result (longer timeout for high urgency)
  74  |   await expect(
  75  |     page.getByText(/Dringlichkeitsstufe/)
> 76  |   ).toBeVisible({ timeout: 60_000 });
      |     ^ Error: expect(locator).toBeVisible() failed
  77  | 
  78  |   // assert case data
  79  |   const dbCase = await getCaseFromDb();
  80  |   expect(dbCase).not.toBeNull();
  81  |   expect(dbCase.age).toBe(32);
  82  |   expect(dbCase.sex).toBe("w");
  83  |   expect(dbCase.pregnancy).toBe(true);
  84  | 
  85  |   // assert additional info was saved
  86  |   const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  87  |   expect(additionalInfo).not.toBeNull();
  88  |   expect(additionalInfo.worsening).toBe(true);
  89  | 
  90  |   // assert symptoms were saved
  91  |   const symptoms = await getSymptomsFromDb(dbCase.case_id);
  92  |   expect(symptoms.length).toBeGreaterThan(0);
  93  | 
  94  |   // assert AI recommendation was saved with high urgency level
  95  |   const recommendation = await getRecommendationFromDb(dbCase.case_id);
  96  |   expect(recommendation).not.toBeNull();
  97  |   expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
  98  |   expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  99  |   expect(recommendation.advice_text).toBeTruthy();
  100 | });
  101 | 
```