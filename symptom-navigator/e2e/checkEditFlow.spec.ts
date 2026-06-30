import { test, expect } from '@playwright/test';
import { resetDb } from './helpers/resetTestDb';
import { getCaseFromDb, getAdditionalInfoFromDb, getDetailsNoCertainCountFromDb } from './helpers/dbAssert';

test.beforeEach(async () => {
  await resetDb();
});

test("Eingegebene Daten auf CheckInfo-Seite überprüfen und bearbeiten", async ({ page }) => {
  // 1. Starte Assessment mit Weiblich, 30 Jahre
  await page.goto("/");
  await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

  await page.getByLabel("Keines davon trifft zu").check();
  await page.getByRole("button", { name: "Weiter" }).click();

  await page.getByPlaceholder("Zum Beispiel: 25").fill("30");
  await page.locator('select').nth(0).selectOption("Weiblich");
  await page.locator('select').nth(1).selectOption("Nein");
  await page.getByRole("button", { name: "Weiter zur Körperregion" }).click();

  // 2. Wähle Brust -> Brust links -> Engegefühl
  await page.getByRole("button", { name: "Brust" }).click();
  await page.getByRole("button", { name: "Brust links", exact: true }).last().click();
  await page.getByRole("button", { name: "Weiter" }).last().click();

  await page.getByLabel("Engegefühl, massiver Druck oder Brennen (Red Flag)").check();
  await page.locator('input[type="range"]').fill("8");
  await page.getByRole("button", { name: "Weiter" }).click();

  // 3. Keine weiteren Symptome
  await page.getByRole("button", { name: "nein" }).click();

  // 4. Zusatzangaben ausfüllen
  await page.getByLabel("Einnahme von Medikamenten").check();
  await page.getByPlaceholder("z. B. Ibuprofen").fill("Aspirin");
  await page.getByPlaceholder("z. B. 400").fill("500");
  await page.getByLabel("Einheit*").selectOption("mg");
  await page.getByPlaceholder("z. B. 3", { exact: true }).fill("1");
  await page.getByLabel("pro*").selectOption("Tag");
  await page.getByLabel("seit wann*").fill("2026-06-20");

  await page.getByLabel("Es liegen Allergien vor").check();
  await page.getByPlaceholder("Allergien z.B. Pollen, Penicillin...").fill("Katzen");
  await page.getByRole("button", { name: "weiter" }).click();

  // 5. Auf der Check-Info-Seite "Daten zur Überprüfung anzeigen" klicken
  await page.getByRole("button", { name: "Daten zur Überprüfung anzeigen" }).click();

  // 6. Basisdaten bearbeiten
  await page.getByRole("button", { name: "Basisdaten bearbeiten" }).click();

  // 7. Ändere Alter auf 31 und Geschlecht auf Divers
  await page.getByPlaceholder("Zum Beispiel: 25").fill("31");
  await page.locator('select').nth(0).selectOption("Divers");
  await page.getByRole("button", { name: "zurueck zur Überprüfung" }).click();

  // 8. Zusatzangaben bearbeiten
  await page.getByRole("button", { name: "Daten zur Überprüfung anzeigen" }).click();
  await page.getByRole("button", { name: "Zusatzangaben bearbeiten" }).click();
  await page.getByPlaceholder("Allergien z.B. Pollen, Penicillin...").fill("Hunde");
  await page.getByRole("button", { name: "zurück zur Überprüfung" }).click();

  // 9. Prüfen, ob die aktualisierten Daten angezeigt werden
  await page.getByRole("button", { name: "Daten zur Überprüfung anzeigen" }).click();
  await expect(page.getByText("Alter")).toBeVisible();
  await expect(page.getByText("31", { exact: true })).toBeVisible();
  await expect(page.getByText("Geschlecht")).toBeVisible();
  await expect(page.getByText("divers")).toBeVisible();
  await expect(page.getByText("Allergien")).toBeVisible();
  await expect(page.getByText("Hunde")).toBeVisible();

  // 10. Einschätzung abschließen
  await page.getByRole("button", { name: "Einschätzung abschließen" }).click();

  // 11. Auf Ergebnis warten
  await expect(page.getByText(/Dringlichkeitsstufe/)).toBeVisible({ timeout: 60_000 });

  // 12. Datenbank-Prüfung
  const dbCase = await getCaseFromDb();
  expect(dbCase).not.toBeNull();
  expect(dbCase.age).toBe(31);
  expect(dbCase.sex).toBe("d");

  const additionalInfo = await getAdditionalInfoFromDb(dbCase.case_id);
  expect(additionalInfo).not.toBeNull();

  // Assert allergies changed from "Katzen" to "Hunde"
  const allergies = await page.evaluate(async (cid) => {
    // We can run a direct DB assertion or just read from getDetailsNoCertainCountFromDb in our helper.
    // However, since we are in playwright test file, let's import the helper:
    return cid;
  }, dbCase.case_id);

  // Let's use the DB check in the test context:
  const allergiesDb = await getDetailsNoCertainCountFromDb(dbCase.case_id, "allergy");
  expect(allergiesDb).toContain("Hunde");
  expect(allergiesDb).not.toContain("Katzen");
});
