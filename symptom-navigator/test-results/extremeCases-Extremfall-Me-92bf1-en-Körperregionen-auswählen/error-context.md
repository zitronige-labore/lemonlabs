# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: extremeCases.spec.ts >> Extremfall: Mehr als 10 Symptome aus unterschiedlichen Körperregionen auswählen
- Location: e2e/extremeCases.spec.ts:10:5

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
  - paragraph: 92fcb198-d38f-424f-affc-d2462b8b7e81
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
  3   | import { getCaseFromDb, getSymptomsFromDb } from './helpers/dbAssert';
  4   | import { pool } from './helpers/resetTestDb';
  5   | 
  6   | test.beforeEach(async () => {
  7   |   await resetDb();
  8   | });
  9   | 
  10  | test("Extremfall: Mehr als 10 Symptome aus unterschiedlichen Körperregionen auswählen", async ({ page }) => {
  11  |   // 1. Starte Assessment
  12  |   await page.goto("/");
  13  |   await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  14  | 
  15  |   await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  16  |   await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
  17  | 
  18  |   await page.getByLabel("Keines davon trifft zu").check();
  19  |   await page.getByRole("button", { name: "Weiter" }).click();
  20  | 
  21  |   await page.getByPlaceholder("Zum Beispiel: 25").fill("40");
  22  |   await page.locator('select').nth(0).selectOption("Divers");
  23  |   await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();
  24  | 
  25  |   // --- REGION 1: Ohren (3 Symptome) ---
  26  |   await page.getByRole("button", { name: "Kopf & Gesicht" }).click();
  27  |   await page.getByRole("button", { name: "Ohren", exact: true }).click();
  28  |   await page.getByRole("button", { name: "Weiter" }).last().click();
  29  | 
  30  |   await page.getByRole("button", { name: /innenohr/i }).click();
  31  |   await page.getByLabel("Tinnitus (Pfeifen, Brummen, Rauschen)").check();
  32  |   await page.getByLabel("Hörsturz (Plötzliche Taubheit)").check();
  33  |   await page.getByLabel("Gefühl von Wasser im Ohr").check();
  34  |   await page.getByRole("button", { name: "Weiter" }).click();
  35  | 
  36  |   // "ja" für weitere Symptome
  37  |   await page.getByRole("button", { name: "ja" }).click();
  38  | 
  39  |   // --- REGION 2: Kopf (2 Symptome) ---
  40  |   await page.getByRole("button", { name: "Kopf & Gesicht" }).click();
  41  |   await page.getByRole("button", { name: "Kopf", exact: true }).click();
  42  |   await page.getByRole("button", { name: "Weiter" }).last().click();
  43  | 
  44  |   await page.getByRole("button", { name: /Spannung & Druck im Kopf/ }).click();
  45  |   await page.getByLabel("Dumpfer, drückender Schmerz (beidseitig)").check();
  46  |   await page.getByLabel("Schwerer Druck auf dem gesamten Schädel").check();
  47  |   await page.getByRole("button", { name: "Weiter" }).click();
  48  | 
  49  |   // "ja" für weitere Symptome
  50  |   await page.getByRole("button", { name: "ja" }).click();
  51  | 
  52  |   // --- REGION 3: Nacken (3 Symptome) ---
  53  |   await page.getByRole("button", { name: "Hals & Nacken" }).click();
  54  |   await page.getByRole("button", { name: "Nacken", exact: true }).click();
  55  |   await page.getByRole("button", { name: "Weiter" }).last().click();
  56  | 
  57  |   await page.getByRole("button", { name: /Verspannung & Bewegungsschmerz/ }).click();
  58  |   await page.getByLabel("Schmerzhafte Muskelverhärtung (Myogelose)").check();
  59  |   await page.getByLabel("Eingeschränkte Drehung / Steifer Hals").check();
  60  |   await page.getByLabel("Knirschen bei Kopfbewegungen").check();
  61  |   await page.getByRole("button", { name: "Weiter" }).click();
  62  | 
  63  |   // "ja" für weitere Symptome
  64  |   await page.getByRole("button", { name: "ja" }).click();
  65  | 
  66  |   // --- REGION 4: Hals (2 Symptome) ---
  67  |   await page.getByRole("button", { name: "Hals & Nacken" }).click();
  68  |   await page.getByRole("button", { name: "Hals", exact: true }).click();
  69  |   await page.getByRole("button", { name: "Weiter" }).last().click();
  70  | 
  71  |   await page.getByRole("button", { name: /Kehlkopf & Luftröhre/ }).click();
  72  |   await page.getByLabel("Heiserkeit / Wegbrechen der Stimme").check();
  73  |   await page.getByLabel("Bellender, trockener, metallischer Husten").check();
  74  |   await page.getByRole("button", { name: "Weiter" }).click();
  75  | 
  76  |   // "ja" für weitere Symptome (Freitext)
  77  |   await page.getByRole("button", { name: "ja" }).click();
  78  | 
  79  |   // --- REGION 5: Magen (Freitext) ---
  80  |   await page.getByRole("button", { name: "Bauch" }).click();
  81  |   await page.getByRole("button", { name: "Oberbauch", exact: true }).click();
  82  |   await page.getByRole("button", { name: "Weiter" }).last().click();
  83  | 
  84  |   await page.getByRole("button", { name: /Sonstiges/ }).click();
  85  |   await page.getByRole("textbox", { name: /Beschreiben Sie Ihre Beschwerden/ }).fill("Starkes Sodbrennen");
  86  |   await page.getByRole("button", { name: "Weiter" }).click();
  87  | 
  88  |   // "nein" für keine weiteren Symptome
  89  |   await page.getByRole("button", { name: "nein" }).click();
  90  | 
  91  |   // 2. Zusatzangaben überspringen
  92  |   await page.getByRole("button", { name: "weiter" }).click();
  93  | 
  94  |   // 3. Auf der CheckInfo-Seite abschicken
  95  |   await page.getByRole("button", { name: "Einschätzung abschließen" }).click();
  96  | 
  97  |   // 4. Auf Ergebnis warten
> 98  |   await expect(page.getByText(/Dringlichkeitsstufe/)).toBeVisible({ timeout: 60_000 });
      |                                                       ^ Error: expect(locator).toBeVisible() failed
  99  | 
  100 |   // 5. Extrahiere den Zugangscode
  101 |   const codeLocator = page.getByText(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  102 |   await expect(codeLocator).toBeVisible();
  103 |   const rawCode = await codeLocator.textContent();
  104 |   expect(rawCode).not.toBeNull();
  105 |   const accessCode = rawCode!.trim();
  106 | 
  107 |   // 6. Datenbank-Prüfung über den exakten Zugriffscode
  108 |   const dbCaseResult = await pool.query(
  109 |     `SELECT case_id FROM cases WHERE access_code = $1`,
  110 |     [accessCode]
  111 |   );
  112 |   expect(dbCaseResult.rows.length).toBe(1);
  113 |   const caseId = dbCaseResult.rows[0].case_id;
  114 | 
  115 |   // Assert structured symptoms count is 10
  116 |   const symptoms = await getSymptomsFromDb(caseId);
  117 |   expect(symptoms.length).toBe(11);
  118 | 
  119 |   // Assert free-text symptom was saved
  120 |   const rawResult = await pool.query(
  121 |     `SELECT raw_symptoms FROM raw_text_symptoms
  122 |      INNER JOIN case_symptoms ON raw_text_symptoms.raw_id = case_symptoms.raw_id
  123 |      WHERE case_symptoms.case_id = $1`,
  124 |     [caseId]
  125 |   );
  126 |   expect(rawResult.rows.length).toBeGreaterThan(0);
  127 |   expect(rawResult.rows[0].raw_symptoms).toContain("Starkes Sodbrennen");
  128 | });
  129 | 
```