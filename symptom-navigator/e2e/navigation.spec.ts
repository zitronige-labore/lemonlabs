import { test, expect } from '@playwright/test';

// Diese Testdatei prüft reine UI-Navigation und -Verhalten
// ohne KI-Aufruf oder Datenbankschreibvorgänge.

test.describe("Navigation & UI-Verhalten", () => {

  test("Startseite zeigt Hauptbuttons korrekt an", async ({ page }) => {
    await page.goto("/");

    // Hauptbutton vorhanden
    await expect(
      page.getByRole("button", { name: "Ersteinschätzung von Symptomen" })
    ).toBeVisible();

    // Sekundärbutton vorhanden
    await expect(
      page.getByRole("button", { name: "Andere Anliegen" })
    ).toBeVisible();

    // SOS-Button vorhanden
    await expect(
      page.getByRole("button", { name: "SOS Notfallhilfe öffnen" })
    ).toBeVisible();
  });

  test("Disclaimer: Weiter-Button ist deaktiviert ohne Checkbox", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

    // "Weiter zur Ersteinschätzung" muss deaktiviert sein
    const weiterButton = page.getByRole("button", { name: "Weiter zur Ersteinschätzung" });
    await expect(weiterButton).toBeDisabled();
  });

  test("Disclaimer: Weiter-Button wird aktiv nach Checkbox-Bestätigung", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

    await page.getByRole("checkbox").check();

    const weiterButton = page.getByRole("button", { name: "Weiter zur Ersteinschätzung" });
    await expect(weiterButton).toBeEnabled();
  });

  test("Disclaimer: Zurück-Button führt zurück zur Startseite", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

    await page.getByRole("button", { name: "Zurück" }).click();

    // zurück auf Startseite
    await expect(
      page.getByRole("button", { name: "Ersteinschätzung von Symptomen" })
    ).toBeVisible();
  });

  test("Red Flags: Weiter-Button ist deaktiviert ohne Auswahl", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

    // Kein Red Flag ausgewählt → "Weiter" deaktiviert
    const weiterButton = page.getByRole("button", { name: "Weiter" });
    await expect(weiterButton).toBeDisabled();
  });

  test("Red Flags: Notfallhinweis erscheint bei Red-Flag-Auswahl", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

    // Warnzeichen auswählen
    await page.getByLabel("Starke Brustschmerzen").check();

    // Notfallhinweis erscheint
    await expect(page.getByText("Notfallhinweis")).toBeVisible();
    await expect(page.getByText(/sofort den Notruf/)).toBeVisible();
  });

  test("Red Flags: '112 anrufen' Button erscheint bei Red-Flag-Auswahl", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

    await page.getByLabel("Atemnot oder starke Atemprobleme").check();

    await expect(page.getByRole("button", { name: "112 anrufen" })).toBeVisible();
  });

  test("Red Flags: Notfallhinweis verschwindet wenn Auswahl aufgehoben wird", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

    // Red Flag setzen und wieder entfernen
    await page.getByLabel("Starke Brustschmerzen").check();
    await expect(page.getByText("Notfallhinweis")).toBeVisible();
    await page.getByLabel("Starke Brustschmerzen").uncheck();

    // Hinweis verschwindet
    await expect(page.getByText("Notfallhinweis")).not.toBeVisible();
  });

  test("SOS-Button öffnet das SOS-Modal", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "SOS Notfallhilfe öffnen" }).click();

    // SOS-Modal öffnet sich (wir prüfen die Überschrift des Modals)
    await expect(page.getByRole('heading', { name: 'Notruf' })).toBeVisible();
  });

  test("Basisdaten: Weiblich zeigt Schwangerschaftsfeld an", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
    await page.getByLabel("Keines davon trifft zu").check();
    await page.getByRole("button", { name: "Weiter" }).click();

    await page.locator('select').nth(0).selectOption("Weiblich");

    // Schwangerschaftsdropdown erscheint
    await expect(page.locator('select').nth(1)).toBeVisible();
  });

  test("Basisdaten: Männlich zeigt kein Schwangerschaftsfeld an", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
    await page.getByLabel("Keines davon trifft zu").check();
    await page.getByRole("button", { name: "Weiter" }).click();

    await page.locator('select').nth(0).selectOption("Männlich");

    // Nur ein select vorhanden (kein Schwangerschaftsdropdown)
    await expect(page.locator('select')).toHaveCount(1);
  });

  test("Körperregion: Auswahl einer Region zeigt Unterregionen an", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
    await page.getByLabel("Keines davon trifft zu").check();
    await page.getByRole("button", { name: "Weiter" }).click();
    await page.getByPlaceholder("Zum Beispiel: 25").fill("30");
    await page.locator('select').nth(0).selectOption("Männlich");
    await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

    // Klick auf Körperregion "Kopf & Gesicht"
    await page.getByRole("button", { name: "Kopf & Gesicht" }).click();

    // Unterregionen erscheinen
    await expect(page.getByRole("button", { name: "Kopf", exact: true }).last()).toBeVisible();
    await expect(page.getByRole("button", { name: "Nase", exact: true }).last()).toBeVisible();
  });

  test("Körperregion: Weiter-Button ohne Unterregion ist deaktiviert", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();
    await page.getByLabel("Keines davon trifft zu").check();
    await page.getByRole("button", { name: "Weiter" }).click();
    await page.getByPlaceholder("Zum Beispiel: 25").fill("30");
    await page.locator('select').nth(0).selectOption("Männlich");
    await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

    // Region anklicken, aber keine Unterregion auswählen
    await page.getByRole("button", { name: "Kopf & Gesicht" }).click();

    // Weiter-Button sollte deaktiviert sein
    await expect(page.getByRole("button", { name: "Weiter" }).last()).toBeDisabled();
  });
});
