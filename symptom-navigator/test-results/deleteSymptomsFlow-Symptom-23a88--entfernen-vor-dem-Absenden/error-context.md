# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: deleteSymptomsFlow.spec.ts >> Symptome auf CheckInfo-Seite entfernen vor dem Absenden
- Location: e2e/deleteSymptomsFlow.spec.ts:9:5

# Error details

```
Error: Channel closed
```

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
  - button "Daten ausblenden"
  - paragraph:
    - text: "Alter:"
    - strong: "60"
  - paragraph:
    - text: "Geschlecht:"
    - strong: männlich
  - button "Basisdaten bearbeiten"
  - paragraph: "Beschwerden selbst geschrieben:"
  - strong: Keine Angabe
  - paragraph: "Symptome:"
  - strong:
    - list:
      - listitem:
        - text: "Bezeichnung: Tinnitus: Pfeifen, Brummen, Rauschen, Zischen, Hämmern"
        - button "Symptom entfernen"
  - button "weitere Symptome angeben"
  - separator
  - paragraph: Zusatzangaben
  - paragraph:
    - text: "Medikamente:"
    - strong: Keine Angabe
  - paragraph:
    - text: "Vorerkrankungen:"
    - strong: Keine Angabe
  - paragraph:
    - text: "Allergien:"
    - strong: Keine Angabe
  - paragraph:
    - text: "Fieber:"
    - strong: Keine Angabe
  - paragraph:
    - text: "Beschwerden werden stärker:"
    - strong: Keine Angabe
  - paragraph:
    - text: "Weitere Informationen:"
    - strong: Keine Angabe
  - button "Zusatzangaben bearbeiten"
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
  1  | import { test, expect } from '@playwright/test';
  2  | import { resetDb, pool } from './helpers/resetTestDb';
  3  | import { getSymptomsFromDb } from './helpers/dbAssert';
  4  | 
  5  | test.beforeEach(async () => {
  6  |   await resetDb();
  7  | });
  8  | 
  9  | test("Symptome auf CheckInfo-Seite entfernen vor dem Absenden", async ({ page }) => {
  10 |   // 1. Starte Assessment
  11 |   await page.goto("/");
  12 |   await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  13 | 
  14 |   await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  15 |   await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
  16 | 
  17 |   await page.getByLabel("Keines davon trifft zu").check();
  18 |   await page.getByRole("button", { name: "Weiter" }).click();
  19 | 
  20 |   await page.getByPlaceholder("Zum Beispiel: 25").fill("60");
  21 |   await page.locator('select').nth(0).selectOption("Männlich");
  22 |   await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();
  23 | 
  24 |   // 2. Ohren -> Innenohr
  25 |   await page.getByRole("button", { name: "Kopf & Gesicht" }).click();
  26 |   await page.getByRole("button", { name: "Ohren", exact: true }).click();
  27 |   await page.getByRole("button", { name: "Weiter" }).last().click();
  28 | 
  29 |   await page.getByRole("button", { name: /innenohr/i }).click();
  30 | 
  31 |   // Beide Symptome auswählen
  32 |   await page.getByLabel("Tinnitus (Pfeifen, Brummen, Rauschen)").check();
  33 |   await page.getByLabel("Hörsturz (Plötzliche Taubheit)").check();
  34 | 
  35 |   await page.getByRole("button", { name: "Weiter" }).click();
  36 | 
  37 |   // 3. Keine weiteren Symptome
  38 |   await page.getByRole("button", { name: "nein" }).click();
  39 | 
  40 |   // 4. Zusatzangaben überspringen/weiter
  41 |   await page.getByRole("button", { name: "weiter" }).click();
  42 | 
  43 |   // 5. Überprüfung anzeigen
  44 |   await page.getByRole("button", { name: "Daten zur Überprüfung anzeigen" }).click();
  45 | 
  46 |   // Prüfen, ob beide Symptome gelistet sind
  47 |   await expect(page.locator('li', { hasText: 'Tinnitus' })).toBeVisible();
  48 |   await expect(page.locator('li', { hasText: 'Hörsturz' })).toBeVisible();
  49 | 
  50 |   // 6. "Hörsturz" entfernen
  51 |   await page.locator('li', { hasText: 'Hörsturz' }).getByRole('button', { name: 'Symptom entfernen' }).click();
  52 | 
  53 |   // Prüfen, ob es verschwunden ist
  54 |   await expect(page.locator('li', { hasText: 'Hörsturz' })).not.toBeVisible();
  55 |   await expect(page.locator('li', { hasText: 'Tinnitus' })).toBeVisible();
  56 | 
  57 |   // 7. Abschicken
  58 |   await page.getByRole("button", { name: "Einschätzung abschließen" }).click();
  59 | 
  60 |   // 8. Auf Ergebnis warten
> 61 |   await expect(page.getByText(/Dringlichkeitsstufe/)).toBeVisible({ timeout: 60_000 });
     |                                                       ^ Error: expect(locator).toBeVisible() failed
  62 | 
  63 |   // 9. Extrahiere den Zugangscode
  64 |   const codeLocator = page.getByText(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  65 |   await expect(codeLocator).toBeVisible();
  66 |   const rawCode = await codeLocator.textContent();
  67 |   expect(rawCode).not.toBeNull();
  68 |   const accessCode = rawCode!.trim();
  69 | 
  70 |   // 10. Datenbank-Prüfung über den exakten Zugriffscode
  71 |   const dbCaseResult = await pool.query(
  72 |     `SELECT case_id FROM cases WHERE access_code = $1`,
  73 |     [accessCode]
  74 |   );
  75 |   expect(dbCaseResult.rows.length).toBe(1);
  76 |   const caseId = dbCaseResult.rows[0].case_id;
  77 | 
  78 |   const symptoms = await getSymptomsFromDb(caseId);
  79 |   // Es sollte nur noch 1 Symptom in der DB existieren
  80 |   expect(symptoms.length).toBe(1);
  81 | 
  82 |   // Da getSymptomsFromDb nur die IDs speichert, holen wir die Details über einen Query oder prüfen
  83 |   // ob das verbleibende Tinnitus ist:
  84 |   // case_symptoms hat: case_id, symptom_id, name_de
  85 |   // Let's assert database details directly
  86 |   const tinnitusSymptom = symptoms.find((s: any) => s.name_de && s.name_de.includes("Tinnitus"));
  87 |   const hoersturzSymptom = symptoms.find((s: any) => s.name_de && s.name_de.includes("Hörsturz"));
  88 |   
  89 |   expect(tinnitusSymptom).toBeTruthy();
  90 |   expect(hoersturzSymptom).toBeFalsy();
  91 | });
  92 | 
```