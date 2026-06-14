# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assessment1.spec.ts >> complete assessment flow is saved correctly to the database
- Location: e2e/assessment1.spec.ts:15:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 30
Received: 33
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - heading "Ersteinschätzung" [level=1] [ref=e4]
      - generic [ref=e8]:
        - generic [ref=e10]:
          - paragraph [ref=e11]:
            - text: "Dringlichkeitsstufe:"
            - strong [ref=e12]: "2"
            - text: ": Arztbesuch erforderlich"
          - paragraph [ref=e13]: "Handlungsempfehlung: Bitte suchen Sie einen Arzt auf, um die Ursache Ihrer Kopfschmerzen abzuklären und eine geeignete Behandlung zu erhalten."
          - link "Ärzte in der Umgebung finden" [ref=e14] [cursor=pointer]:
            - /url: https://www.google.com/maps/search/%C3%84rzte+in+der+Umgebung
        - button "KI-Begründung anzeigen" [ref=e15] [cursor=pointer]
        - generic [ref=e16]:
          - paragraph [ref=e17]: "Ihr persönlicher Zugangscode:"
          - generic [ref=e18]:
            - paragraph [ref=e19]: 486a8dcd-57de-400c-8fd0-564dedad3156
            - button "Kopieren" [ref=e20] [cursor=pointer]
          - paragraph [ref=e21]: Mit diesem Code können Sie Ihre Daten später wieder abrufen.
        - paragraph [ref=e22]: Ihre Angaben wurden erfasst.
        - button "Gespeicherte Daten anzeigen" [ref=e23] [cursor=pointer]
        - separator [ref=e24]
        - button "Zur Startseite" [ref=e25] [cursor=pointer]
    - generic [ref=e26]:
      - button "Kontakt" [ref=e27] [cursor=pointer]
      - button "Datenschutz" [ref=e28] [cursor=pointer]
      - button "Support" [ref=e29] [cursor=pointer]
      - button "Impressum" [ref=e30] [cursor=pointer]
    - button "Tutorial öffnen" [ref=e31] [cursor=pointer]:
      - img [ref=e32]
  - alert [ref=e34]
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
  15  | test("complete assessment flow is saved correctly to the database", async ({ page }) => {
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
  30  |   await page.getByPlaceholder("Zum Beispiel: 25").fill("30");
  31  | 
  32  |   // select gender — no name attribute on select, use nth
  33  |   await page.locator('select').nth(0).selectOption("Weiblich");
  34  | 
  35  |   // pregnancy field appears conditionally after selecting "Weiblich"
  36  |   await page.locator('select').nth(1).selectOption("Nein");
  37  | 
  38  |   await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();
  39  | 
  40  |   // click "Kopf & Gesicht" region on the SVG body map via aria-label
  41  |   await page.getByRole("button", { name: "Kopf & Gesicht" }).click();
  42  | 
  43  |   // select "Kopf" as sub-region from the buttons that appear below
  44  |   await page.getByRole("button", { name: "Kopf", exact: true }).click();
  45  | 
  46  |   // continue to symptom categories
  47  |   await page.getByRole("button", { name: "Weiter" }).last().click();
  48  | 
  49  |   // select symptom category
  50  |   await page.getByRole("button", { name: /Spannung & Druck im Kopf/ }).click();
  51  | 
  52  |   // select symptom via checkbox label — symptoms are checkboxes not buttons
  53  |   await page.getByLabel("Dumpfer, drückender Schmerz (beidseitig)").check();
  54  | 
  55  |   // fill in symptom duration and pain intensity
  56  |   await page.locator('input[type="range"]').fill("7");
  57  | 
  58  |     // select symptom from list
  59  |   await page.getByLabel("Schwerer Druck auf dem gesamten Schädel").check();
  60  | 
  61  |   // continue
  62  |   await page.getByRole("button", { name: "Weiter" }).click();
  63  | 
  64  |   // do not add more symptoms
  65  |   await page.getByRole("button", { name: "nein" }).click();
  66  | 
  67  | 
  68  |   // fill in optional medication field
  69  |   await page.getByLabel("Nehmen Sie aktuell Medikamente ein?").fill("Ibuprofen");
  70  | 
  71  |   // fill in allergies field
  72  |   await page.getByLabel("Sind Allergien bekannt?").fill("Pollen");
  73  | 
  74  |   // select condition via checkbox
  75  |   await page.getByLabel("Bluthochdruck").check();
  76  | 
  77  |   // continue to check info screen
  78  |   await page.getByRole("button", { name: "weiter" }).click();
  79  | 
  80  |   // submit assessment — button is type="submit"
  81  |   await page.getByRole("button", { name: "Einschätzung abschließen" }).click();
  82  | 
  83  |   // wait for AI result (generous timeout due to model response time)
  84  |   await expect(
  85  |     page.getByText(/Dringlichkeitsstufe/)
  86  |   ).toBeVisible({ timeout: 60_000 });
  87  | 
  88  |   // assert case was written to the database
  89  |   const dbCase = await getCaseFromDb();
  90  |   expect(dbCase).not.toBeNull();
> 91  |   expect(dbCase.age).toBe(30);
      |                      ^ Error: expect(received).toBe(expected) // Object.is equality
  92  |   expect(dbCase.sex).toBe("w");
  93  |   expect(dbCase.pregnancy).toBe(false);
  94  | 
  95  |   // assert additional info was saved
  96  |   const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  97  |   expect(additionalInfo).not.toBeNull();
  98  | 
  99  |   // assert at least one symptom was saved
  100 |   const symptoms = await getSymptomsFromDb(dbCase.case_id);
  101 |   expect(symptoms.length).toBeGreaterThan(0);
  102 | 
  103 |   // assert allergies were saved
  104 | const allergies = await getDetailsNoCertainCountFromDb(dbCase.case_id, "allergy");
  105 | expect(allergies).toContain("Pollen");
  106 | 
  107 | // assert medication was saved
  108 | const medication = await getDetailsNoCertainCountFromDb(dbCase.case_id, "medication");
  109 | expect(medication).toContain("Ibuprofen");
  110 | 
  111 | // assert conditions were saved
  112 | const conditions = await getDetailsNoCertainCountFromDb(dbCase.case_id, "condition");
  113 | expect(conditions).toContain("Bluthochdruck");
  114 | 
  115 |   // assert AI recommendation was saved with a valid urgency level
  116 |   const recommendation = await getRecommendationFromDb(dbCase.case_id);
  117 |   expect(recommendation).not.toBeNull();
  118 |   expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
  119 |   expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  120 |   expect(recommendation.advice_text).toBeTruthy();
  121 | });
```