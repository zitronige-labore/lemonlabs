# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation & UI-Verhalten >> Basisdaten: Weiblich zeigt Schwangerschaftsfeld an
- Location: e2e/navigation.spec.ts:118:7

# Error details

```
Error: locator.click: Test ended.
Call log:
  - waiting for getByRole('button', { name: 'Ersteinschätzung von Symptomen' })

```

# Test source

```ts
  20  | 
  21  |     // SOS-Button vorhanden
  22  |     await expect(
  23  |       page.getByRole("button", { name: "SOS Notfallhilfe öffnen" })
  24  |     ).toBeVisible();
  25  |   });
  26  | 
  27  |   test("Disclaimer: Weiter-Button ist deaktiviert ohne Checkbox", async ({ page }) => {
  28  |     await page.goto("/");
  29  |     await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  30  | 
  31  |     // "Weiter zur Ersteinschätzung" muss deaktiviert sein
  32  |     const weiterButton = page.getByRole("button", { name: "Weiter zur Ersteinschätzung" });
  33  |     await expect(weiterButton).toBeDisabled();
  34  |   });
  35  | 
  36  |   test("Disclaimer: Weiter-Button wird aktiv nach Checkbox-Bestätigung", async ({ page }) => {
  37  |     await page.goto("/");
  38  |     await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  39  | 
  40  |     await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  41  | 
  42  |     const weiterButton = page.getByRole("button", { name: "Weiter zur Ersteinschätzung" });
  43  |     await expect(weiterButton).toBeEnabled();
  44  |   });
  45  | 
  46  |   test("Disclaimer: Zurück-Button führt zurück zur Startseite", async ({ page }) => {
  47  |     await page.goto("/");
  48  |     await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  49  | 
  50  |     await page.getByRole("button", { name: "Zurück" }).click();
  51  | 
  52  |     // zurück auf Startseite
  53  |     await expect(
  54  |       page.getByRole("button", { name: "Ersteinschätzung von Symptomen" })
  55  |     ).toBeVisible();
  56  |   });
  57  | 
  58  |   test("Red Flags: Weiter-Button ist deaktiviert ohne Auswahl", async ({ page }) => {
  59  |     await page.goto("/");
  60  |     await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  61  |     await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  62  |     await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
  63  | 
  64  |     // Kein Red Flag ausgewählt → "Weiter" deaktiviert
  65  |     const weiterButton = page.getByRole("button", { name: "Weiter" });
  66  |     await expect(weiterButton).toBeDisabled();
  67  |   });
  68  | 
  69  |   test("Red Flags: Notfallhinweis erscheint bei Red-Flag-Auswahl", async ({ page }) => {
  70  |     await page.goto("/");
  71  |     await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  72  |     await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  73  |     await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
  74  | 
  75  |     // Warnzeichen auswählen
  76  |     await page.getByLabel("Starke Brustschmerzen").check();
  77  | 
  78  |     // Notfallhinweis erscheint
  79  |     await expect(page.getByText("Notfallhinweis")).toBeVisible();
  80  |     await expect(page.getByText(/sofort den Notruf/)).toBeVisible();
  81  |   });
  82  | 
  83  |   test("Red Flags: '112 anrufen' Button erscheint bei Red-Flag-Auswahl", async ({ page }) => {
  84  |     await page.goto("/");
  85  |     await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  86  |     await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  87  |     await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
  88  | 
  89  |     await page.getByLabel("Atemnot oder starke Atemprobleme").check();
  90  | 
  91  |     await expect(page.getByRole("button", { name: "112 anrufen" })).toBeVisible();
  92  |   });
  93  | 
  94  |   test("Red Flags: Notfallhinweis verschwindet wenn Auswahl aufgehoben wird", async ({ page }) => {
  95  |     await page.goto("/");
  96  |     await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  97  |     await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  98  |     await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
  99  | 
  100 |     // Red Flag setzen und wieder entfernen
  101 |     await page.getByLabel("Starke Brustschmerzen").check();
  102 |     await expect(page.getByText("Notfallhinweis")).toBeVisible();
  103 |     await page.getByLabel("Starke Brustschmerzen").uncheck();
  104 | 
  105 |     // Hinweis verschwindet
  106 |     await expect(page.getByText("Notfallhinweis")).not.toBeVisible();
  107 |   });
  108 | 
  109 |   test("SOS-Button öffnet das SOS-Modal", async ({ page }) => {
  110 |     await page.goto("/");
  111 | 
  112 |     await page.getByRole("button", { name: "SOS Notfallhilfe öffnen" }).click();
  113 | 
  114 |     // SOS-Modal öffnet sich (wir prüfen die Überschrift des Modals)
  115 |     await expect(page.getByRole('heading', { name: 'Notruf' })).toBeVisible();
  116 |   });
  117 | 
  118 |   test("Basisdaten: Weiblich zeigt Schwangerschaftsfeld an", async ({ page }) => {
  119 |     await page.goto("/");
> 120 |     await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
      |                                                                                ^ Error: locator.click: Test ended.
  121 |     await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  122 |     await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
  123 |     await page.getByLabel("Keines davon trifft zu").check();
  124 |     await page.getByRole("button", { name: "Weiter" }).click();
  125 | 
  126 |     await page.locator('select').nth(0).selectOption("Weiblich");
  127 | 
  128 |     // Schwangerschaftsdropdown erscheint
  129 |     await expect(page.locator('select').nth(1)).toBeVisible();
  130 |   });
  131 | 
  132 |   test("Basisdaten: Männlich zeigt kein Schwangerschaftsfeld an", async ({ page }) => {
  133 |     await page.goto("/");
  134 |     await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  135 |     await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  136 |     await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
  137 |     await page.getByLabel("Keines davon trifft zu").check();
  138 |     await page.getByRole("button", { name: "Weiter" }).click();
  139 | 
  140 |     await page.locator('select').nth(0).selectOption("Männlich");
  141 | 
  142 |     // Nur ein select vorhanden (kein Schwangerschaftsdropdown)
  143 |     await expect(page.locator('select')).toHaveCount(1);
  144 |   });
  145 | 
  146 |   test("Körperregion: Auswahl einer Region zeigt Unterregionen an", async ({ page }) => {
  147 |     await page.goto("/");
  148 |     await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  149 |     await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  150 |     await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
  151 |     await page.getByLabel("Keines davon trifft zu").check();
  152 |     await page.getByRole("button", { name: "Weiter" }).click();
  153 |     await page.getByPlaceholder("Zum Beispiel: 25").fill("30");
  154 |     await page.locator('select').nth(0).selectOption("Männlich");
  155 |     await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();
  156 | 
  157 |     // Klick auf Körperregion "Kopf & Gesicht"
  158 |     await page.getByRole("button", { name: "Kopf & Gesicht" }).click();
  159 | 
  160 |     // Unterregionen erscheinen
  161 |     await expect(page.getByRole("button", { name: "Kopf", exact: true })).toBeVisible();
  162 |     await expect(page.getByRole("button", { name: "Nase", exact: true })).toBeVisible();
  163 |   });
  164 | 
  165 |   test("Körperregion: Weiter-Button ohne Unterregion ist deaktiviert", async ({ page }) => {
  166 |     await page.goto("/");
  167 |     await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
  168 |     await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  169 |     await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
  170 |     await page.getByLabel("Keines davon trifft zu").check();
  171 |     await page.getByRole("button", { name: "Weiter" }).click();
  172 |     await page.getByPlaceholder("Zum Beispiel: 25").fill("30");
  173 |     await page.locator('select').nth(0).selectOption("Männlich");
  174 |     await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();
  175 | 
  176 |     // Region anklicken, aber keine Unterregion auswählen
  177 |     await page.getByRole("button", { name: "Kopf & Gesicht" }).click();
  178 | 
  179 |     // Weiter-Button sollte deaktiviert sein
  180 |     await expect(page.getByRole("button", { name: "Weiter" }).last()).toBeDisabled();
  181 |   });
  182 | });
  183 | 
```