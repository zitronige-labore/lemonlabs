# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nackenbeschwerdenFlow.spec.ts >> männlicher Patient mit Nackenbeschwerden wird korrekt gespeichert
- Location: e2e/nackenbeschwerdenFlow.spec.ts:15:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 42
Received: 28
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
            - strong [ref=e12]: "3"
            - text: ": Zeitnahe medizinische Abklärung erforderlich"
          - paragraph [ref=e13]: "Handlungsempfehlung: Bitte suchen Sie zeitnah einen Arzt auf, damit die Ursache Ihrer starken Nackensteifigkeit und Bewegungseinschränkung gefunden und behandelt werden kann."
          - link "Ärzte in der Umgebung finden" [ref=e14] [cursor=pointer]:
            - /url: https://www.google.com/maps/search/%C3%84rzte+in+der+Umgebung
        - button "KI-Begründung anzeigen" [ref=e15] [cursor=pointer]
        - generic [ref=e16]:
          - paragraph [ref=e17]: "Ihr persönlicher Zugangscode:"
          - generic [ref=e18]:
            - paragraph [ref=e19]: ba238f82-5e7d-45a3-84fc-7743a5a5d31e
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
  77  |   ).toBeVisible({ timeout: 60_000 });
  78  | 
  79  |   // assert case was written to the database
  80  |   const dbCase = await getCaseFromDb();
  81  |   expect(dbCase).not.toBeNull();
> 82  |   expect(dbCase.age).toBe(42);
      |                      ^ Error: expect(received).toBe(expected) // Object.is equality
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