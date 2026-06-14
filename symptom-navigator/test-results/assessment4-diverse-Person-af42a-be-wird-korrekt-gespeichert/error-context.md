# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assessment4.spec.ts >> diverse Person mit Magenbeschwerden und Freitexteingabe wird korrekt gespeichert
- Location: e2e/assessment4.spec.ts:16:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 45
Received: 40
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
          - paragraph [ref=e13]: "Handlungsempfehlung: Bitte suchen Sie einen Arzt auf, um die Ursache Ihrer Beschwerden abzuklären und eine geeignete Behandlung zu erhalten. Die Symptome sollten nicht ignoriert werden, besonders im Hinblick auf Ihren Diabetes Typ 1."
          - link "Ärzte in der Umgebung finden" [ref=e14] [cursor=pointer]:
            - /url: https://www.google.com/maps/search/%C3%84rzte+in+der+Umgebung
        - button "KI-Begründung anzeigen" [ref=e15] [cursor=pointer]
        - generic [ref=e16]:
          - paragraph [ref=e17]: "Ihr persönlicher Zugangscode:"
          - generic [ref=e18]:
            - paragraph [ref=e19]: 637f5282-25f8-4cc0-9529-3630fe89f355
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
  10  | import { pool } from './helpers/resetTestDb';
  11  | 
  12  | test.beforeEach(async () => {
  13  |   await resetDb();
  14  | });
  15  | 
  16  | test("diverse Person mit Magenbeschwerden und Freitexteingabe wird korrekt gespeichert", async ({ page }) => {
  17  | 
  18  |   // navigate to start page
  19  |   await page.goto("/");
  20  |   await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  21  | 
  22  |   // confirm disclaimer checkbox and continue
  23  |   await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  24  |   await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
  25  | 
  26  |   // select "none of the above" for red flags and continue
  27  |   await page.getByLabel("Keines davon trifft zu").check();
  28  |   await page.getByRole("button", { name: "Weiter" }).click();
  29  | 
  30  |   // fill in age: 45
  31  |   await page.getByPlaceholder("Zum Beispiel: 25").fill("45");
  32  | 
  33  |   // select gender: Divers
  34  |   await page.locator('select').nth(0).selectOption("Divers");
  35  | 
  36  |   await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();
  37  | 
  38  |   // click "Bauch" region on the SVG body map
  39  |   await page.getByRole("button", { name: "Bauch" }).click();
  40  | 
  41  |   // select "Oberbauch" as sub-region
  42  |   await page.getByRole("button", { name: "Oberbauch", exact: true }).click();
  43  | 
  44  |   // continue to symptom categories
  45  |   await page.getByRole("button", { name: "Weiter" }).last().click();
  46  | 
  47  |   // select symptom category "Magen (Oberbauch)"
  48  |   await page.getByRole("button", { name: /Magen \(Oberbauch\)/ }).click();
  49  | 
  50  |   // select symptom "Nüchternschmerz"
  51  |   await page.getByLabel("Nüchternschmerz (besser nach dem Essen)").check();
  52  | 
  53  |   // fill in pain scale
  54  |   await page.locator('input[type="range"]').fill("6");
  55  | 
  56  |   // continue to "Weiter" then go to text input via "Sonstiges"
  57  |   await page.getByRole("button", { name: "Weiter" }).click();
  58  | 
  59  |   // choose to add another symptom — this time via free text
  60  |   await page.getByRole("button", { name: "ja" }).click();
  61  | 
  62  |   // select another region: Bauch and Oberbauch again
  63  |   await page.getByRole("button", { name: "Bauch" }).click();
  64  |   await page.getByRole("button", { name: "Oberbauch", exact: true }).click();
  65  |   await page.getByRole("button", { name: "Weiter" }).last().click();
  66  | 
  67  |   // use "Sonstiges" to get to free text input
  68  |   await page.getByRole("button", { name: /Sonstiges/ }).click();
  69  | 
  70  |   // fill in free text symptom
  71  | await page.getByRole("textbox", { name: /Beschreiben Sie Ihre Beschwerden/ })
  72  |   .fill("Starkes Brennen im Oberbauch nach dem Essen");
  73  | 
  74  | 
  75  |   // continue from text input
  76  |   await page.getByRole("button", { name: "Weiter" }).click();
  77  | 
  78  |   // do not add more symptoms
  79  |   await page.getByRole("button", { name: "nein" }).click();
  80  | 
  81  |   // fill in condition: Diabetes
  82  |   await page.getByRole("checkbox", { name: "Diabetes Typ 1" }).check();
  83  | 
  84  |   // continue to check info screen
  85  |   await page.getByRole("button", { name: "weiter" }).click();
  86  | 
  87  |   // submit assessment
  88  |   await page.getByRole("button", { name: "Einschätzung abschließen" }).click();
  89  | 
  90  |   // wait for AI result
  91  |   await expect(
  92  |     page.getByText(/Dringlichkeitsstufe/)
  93  |   ).toBeVisible({ timeout: 60_000 });
  94  | 
  95  |   // assert case data
  96  |   const dbCase = await getCaseFromDb();
  97  |   expect(dbCase).not.toBeNull();
> 98  |   expect(dbCase.age).toBe(45);
      |                      ^ Error: expect(received).toBe(expected) // Object.is equality
  99  |   expect(dbCase.sex).toBe("d");
  100 | 
  101 |   // assert additional info was saved
  102 |   const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  103 |   expect(additionalInfo).not.toBeNull();
  104 | 
  105 |   // assert symptoms were saved
  106 |   const symptoms = await getSymptomsFromDb(dbCase.case_id);
  107 |   expect(symptoms.length).toBeGreaterThan(0);
  108 | 
  109 |   // assert condition was saved
  110 |   const conditions = await getDetailsNoCertainCountFromDb(dbCase.case_id, "condition");
  111 |   expect(conditions).toContain("Diabetes Typ 1");
  112 | 
  113 |   // assert raw text symptom was saved in raw_text_symptoms table
  114 |   const rawResult = await pool.query(
  115 |     `SELECT raw_symptoms FROM raw_text_symptoms
  116 |      INNER JOIN case_symptoms ON raw_text_symptoms.raw_id = case_symptoms.raw_id
  117 |      WHERE case_symptoms.case_id = $1`,
  118 |     [dbCase.case_id]
  119 |   );
  120 |   expect(rawResult.rows.length).toBeGreaterThan(0);
  121 |   expect(rawResult.rows[0].raw_symptoms).toContain("Brennen im Oberbauch");
  122 | 
  123 |   // assert AI recommendation was saved
  124 |   const recommendation = await getRecommendationFromDb(dbCase.case_id);
  125 |   expect(recommendation).not.toBeNull();
  126 |   expect(recommendation.urgency_level).toBeGreaterThanOrEqual(1);
  127 |   expect(recommendation.urgency_level).toBeLessThanOrEqual(5);
  128 |   expect(recommendation.advice_text).toBeTruthy();
  129 | });
  130 | 
```