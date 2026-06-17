import { test, expect } from '@playwright/test';

test("Globales Tutorial öffnen und kontextsensitiv durchgehen", async ({ page }) => {
  // 1. Startseite aufrufen
  await page.goto("/");

  // 2. Tutorial auf Startseite öffnen
  await page.getByRole("button", { name: "Tutorial öffnen" }).click();
  
  // Prüfen, ob das Tutorial-Modal geöffnet ist und den Titel "Start" trägt
  await expect(page.getByRole("heading", { name: "Start" })).toBeVisible();
  await expect(page.getByText("Hier beginnst du die Ersteinschätzung oder klärst andere Anliegen.")).toBeVisible();

  // Tutorial modal schlagen/schließen
  await page.getByRole("button", { name: "Verstanden" }).click();
  await expect(page.getByRole("heading", { name: "Start" })).not.toBeVisible();

  // 3. Gehe zum Disclaimer
  await page.getByRole("button", { name: "Ersteinschätzung von Symptomen" }).click();

  // Tutorial öffnen (während wir auf der Hinweisseite sind)
  await page.getByRole("button", { name: "Tutorial öffnen" }).click();
  
  // Prüfen, ob der Inhalt passend zur Hinweisseite ist
  await expect(page.getByRole("heading", { name: "Wichtige Hinweise" })).toBeVisible();
  await expect(page.getByText("Lies die Hinweise aufmerksam, bevor du mit der Ersteinschätzung fortfährst.")).toBeVisible();

  await page.getByRole("button", { name: "Verstanden" }).click();

  // 4. Gehe zu den Red Flags (Warnzeichen)
  await page.getByLabel("Ich habe die Hinweise gelesen und verstanden.").check();
  await page.getByRole("button", { name: "Weiter zur Ersteinschätzung" }).click();

  // Tutorial auf Red Flags Seite öffnen
  await page.getByRole("button", { name: "Tutorial öffnen" }).click();
  
  // Prüfen, ob der Inhalt passend zur Red Flags Seite ist
  await expect(page.getByRole("heading", { name: "Warnzeichen" })).toBeVisible();
  await expect(page.getByText("Dieser Schritt prüft, ob Anzeichen für einen medizinischen Notfall vorliegen.")).toBeVisible();

  await page.getByRole("button", { name: "Verstanden" }).click();
});
