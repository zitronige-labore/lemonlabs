import { test, expect } from '@playwright/test';
import { resetDb } from './helpers/resetTestDb';
import { getCaseFromDb } from './helpers/dbAssert';

test.beforeEach(async () => {
  await resetDb();
});

test("Datenabruf und -löschung über Zugriffscode", async ({ page }) => {
  // 1. Führe ein normales Assessment durch
  await page.goto("/");
  await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

  await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

  await page.getByLabel("Keines davon trifft zu").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  await page.getByPlaceholder("Zum Beispiel: 25").fill("33");
  await page.locator('select').nth(0).selectOption("Männlich");
  await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

  // click "Hals" region on the SVG body map
  await page.getByRole("button", { name: "Hals", exact: true }).first().click();

  // select "Hals" as sub-region from quick-select
  await page.getByRole("button", { name: "Hals", exact: true }).last().click();
  await page.getByRole("button", { name: "Weiter" }).last().click();

  await page.getByRole("button", { name: /Kehlkopf & Luftröhre/ }).click();
  await page.getByLabel("Heiserkeit / Wegbrechen der Stimme").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  await page.getByRole("button", { name: "nein" }).click();

  await page.getByRole("button", { name: "weiter" }).click();
  await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

  // 2. Warte auf das Ergebnis
  await expect(page.getByText(/Dringlichkeitsstufe/)).toBeVisible({ timeout: 60_000 });

  // 3. Extrahiere den Zugangscode
  const codeLocator = page.getByText(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  await expect(codeLocator).toBeVisible();
  const rawCode = await codeLocator.textContent();
  expect(rawCode).not.toBeNull();
  const accessCode = rawCode!.trim();

  // 4. Zurück zur Startseite navigieren
  await page.getByRole("button", { name: "Zur Startseite" }).click();

  // 5. Über "Andere Anliegen" in die Datenverwaltung gehen
  await page.getByRole("button", { name: "Andere Anliegen" }).click();
  await page.getByRole("button", { name: "Gespeicherte Daten verwalten" }).click();

  // 6. Code eingeben und abrufen
  await page.getByPlaceholder("Code hier eingeben").fill(accessCode);
  await page.getByRole("button", { name: "Abrufen" }).click();

  // 7. Prüfe, ob die gespeicherten Daten angezeigt werden
  await expect(page.getByText("Geschlecht")).toBeVisible();
  await expect(page.getByText("männlich")).toBeVisible();
  await expect(page.getByText("Alter")).toBeVisible();
  await expect(page.getByText("33", { exact: true })).toBeVisible();
  await expect(page.getByText("Heiserkeit: Rauigkeit, behauchte Stimme")).toBeVisible();

  // 8. Daten löschen
  await page.getByRole("button", { name: "Löschen" }).click();

  // 9. Erneut abrufen und prüfen, ob Daten nicht mehr angezeigt werden
  // Wir laden die Seite neu oder leeren den State, indem wir nochmals abrufen
  await page.getByPlaceholder("Code hier eingeben").fill(accessCode);
  await page.getByRole("button", { name: "Abrufen" }).click();

  // Nach dem Löschen und erneuten Abrufen sollten die Daten weg sein
  await expect(page.getByText("männlich")).not.toBeVisible();
  await expect(page.getByText("33", { exact: true })).not.toBeVisible();
});
