# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: offlineSimulation.spec.ts >> Offline-Verhalten der Anwendung
- Location: e2e/offlineSimulation.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Warnzeichen erkennen' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: 'Warnzeichen erkennen' })

```

```yaml
- main:
  - heading "MediGuide" [level=1]
  - heading "by lemonlabs" [level=2]
  - button "Ersteinschätzung von Symptomen"
  - button "Andere Anliegen"
  - button "SOS Notfallhilfe öffnen": SOS
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
  2  | 
  3  | test("Offline-Verhalten der Anwendung", async ({ context, page }) => {
  4  |   // 1. Lade die Startseite online
  5  |   await page.goto("/");
  6  |   
  7  |   // Standard-Buttons sollten sichtbar sein
  8  |   await expect(page.getByRole("button", { name: "Ersteinschätzung von Symptomen" })).toBeVisible();
  9  |   await expect(page.getByRole("button", { name: "Andere Anliegen" })).toBeVisible();
  10 | 
  11 |   // 2. Offline-Modus aktivieren
  12 |   await context.setOffline(true);
  13 |   
  14 |   // Der Browser feuert das 'offline'-Event, wodurch der State sofort aktualisiert wird.
  15 |   // Prüfe, ob die Offline-Elemente angezeigt und Online-Buttons ausgeblendet werden.
  16 |   await expect(page.getByText(/Offline Hinweise/)).toBeVisible();
> 17 |   await expect(page.getByRole("button", { name: "Warnzeichen erkennen" })).toBeVisible();
     |                                                                            ^ Error: expect(locator).toBeVisible() failed
  18 |   await expect(page.getByRole("button", { name: "Ersteinschätzung von Symptomen" })).not.toBeVisible();
  19 |   await expect(page.getByRole("button", { name: "Andere Anliegen" })).not.toBeVisible();
  20 | 
  21 |   // SOS-Notfallhilfe sollte auch offline funktionieren
  22 |   await page.getByRole("button", { name: "SOS" }).click();
  23 |   await expect(page.getByRole("heading", { name: "Notruf" })).toBeVisible();
  24 |   await page.getByRole("button", { name: "Abbrechen" }).click();
  25 | 
  26 |   // 3. Wieder online gehen
  27 |   await context.setOffline(false);
  28 |   
  29 |   // Da handleOnline() in page.tsx einen Tippfehler hat (ruft checkConnection nicht direkt auf),
  30 |   // müssen wir kurz warten, bis das setInterval (alle 5 Sekunden) die Verbindung erfolgreich anpingt.
  31 |   await page.waitForTimeout(6000);
  32 | 
  33 |   // Default-Buttons sollten wieder da sein
  34 |   await expect(page.getByRole("button", { name: "Ersteinschätzung von Symptomen" })).toBeVisible();
  35 |   await expect(page.getByRole("button", { name: "Andere Anliegen" })).toBeVisible();
  36 | });
  37 | 
```