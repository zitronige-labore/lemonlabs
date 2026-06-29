/*
  Verbindliche Hinweis-Seite vor Beginn der medizinischen Ersteinschätzung.

  Sie grenzt die Anwendung von Diagnose und Beratung ab, weist auf akute
  Notfälle hin und verlangt eine bewusste Bestätigung vor der Red-Flag-Prüfung.
*/
import { useState } from "react";

/* Gemeinsame Styles für Startseite, Hinweise, Navigation und Notfallzugriff. */
import homeStyles from "../../Home.module.css";

/* Wiederverwendbarer Dialog mit direktem Telefon-Link zur 112. */
import { SosModal } from "./SosModal";

/*
  Eigenschaften der Hinweis-Seite.

  hinweiseBestaetigt / setHinweiseBestaetigt:
  Lesen und aktualisieren die Bestätigung im zentralen Zustand der Hauptseite.

  onBack:
  Führt ohne Start des Assessments zur Startseite zurück.

  onContinue:
  Öffnet nach der Bestätigung als Nächstes die medizinische Warnzeichen-Prüfung.
*/
type HinweiseScreenProps = {
  hinweiseBestaetigt: boolean;

  setHinweiseBestaetigt: (checked: boolean) => void;

  onBack: () => void;

  onContinue: () => void;

  onOpenDatenschutz: () => void;

  onOpenImpressum: () => void;

  onOpenKontakt: () => void;

  onOpenSupport: () => void;
};

export function HinweiseScreen({
  hinweiseBestaetigt,
  setHinweiseBestaetigt,
  onBack,
  onContinue,
  onOpenDatenschutz,
  onOpenImpressum,
  onOpenKontakt,
  onOpenSupport,
}: HinweiseScreenProps) {
  /* Das SOS-Modal ist ein rein lokaler UI-Zustand dieser Seite. */
  const [showSos, setShowSos] = useState(false);

  return (
    <>
      {/* Eigenständige Hinweisansicht im Layout der Startseite. */}
      <div className={homeStyles.hauptbox}>
        <div className={homeStyles.kopfbox}>
          {/* Produktkopf zur eindeutigen Zuordnung vor Beginn des Ablaufs. */}
          <div className={homeStyles.header}>
            <h1 className={homeStyles.title}>Symptometer</h1>

            <h2 className={homeStyles.subtitle}>
              <span>by lemonlabs</span>
            </h2>
          </div>

          {/* Zweck und medizinische Grenzen der Anwendung klar voneinander trennen. */}
          <p className={homeStyles.warningText}>
            Diese Anwendung unterstützt Sie nur bei einer ersten Einschätzung
            Ihrer Beschwerden.
          </p>

          <p className={homeStyles.warningText}>
            Sie ersetzt keine ärztliche Diagnose und keine medizinische Beratung.
          </p>

          {/* Akute Warnzeichen haben immer Vorrang vor der digitalen Ersteinschätzung. */}
          <div className={homeStyles.notrufBox}>
            Bei akuten Beschwerden wie Atemnot, Bewusstlosigkeit oder starken
            Brustschmerzen wählen Sie sofort den Notruf 112.
          </div>

          {/* Die kontrollierte Checkbox schreibt die Bestätigung in den Hauptzustand. */}
          <label className={homeStyles.checkboxLabel} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <input
              type="checkbox"
              checked={hinweiseBestaetigt}
              onChange={(event) =>
                setHinweiseBestaetigt(event.target.checked)
              }
              style={{ marginTop: "4px" }}
            />
            <span style={{ fontSize: "0.95rem", lineHeight: "1.4" }}>
              Ich habe die Hinweise und die{" "}
              <button
                type="button"
                onClick={onOpenDatenschutz}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "var(--primary)",
                  textDecoration: "underline",
                  cursor: "pointer",
                  font: "inherit",
                  display: "inline",
                }}
              >
                Datenschutzerklärung
              </button>{" "}
              gelesen und willige in die Verarbeitung meiner Gesundheitsdaten ein.
            </span>
          </label>

          {/* Fortfahren ist erst nach ausdrücklicher Bestätigung möglich. */}
          <div className={homeStyles.buttonBox}>
            <button
              type="button"
              className={homeStyles.primaryButton}
              disabled={!hinweiseBestaetigt}
              onClick={onContinue}
            >
              Weiter zur Ersteinschätzung
            </button>
            <button
              type="button"
              className={homeStyles.secondaryButton}
              onClick={onBack}
            >
              Zurück
            </button>
          </div>
        </div>
      </div>

      {/* Der Notruf bleibt unabhängig von der Bestätigung direkt erreichbar. */}
      <button
        type="button"
        onClick={() => setShowSos(true)}
        className={homeStyles.sosButton}
        aria-label="SOS Notfallhilfe öffnen"
      >
        SOS
      </button>

      {/* Das Modal wird erst bei Bedarf inhaltlich sichtbar. */}
      <SosModal isOpen={showSos} onClose={() => setShowSos(false)} />

      {/* Derzeit rein visuelle Fußzeilen-Einträge ohne hinterlegte Navigation. */}
      <footer className={homeStyles.footer}>
        <button type="button" className={homeStyles.footerLink} onClick={onOpenKontakt}>
          Kontakt
        </button>

        <button type="button" className={homeStyles.footerLink} onClick={onOpenDatenschutz}>
          Datenschutz
        </button>

        <button type="button" className={homeStyles.footerLink} onClick={onOpenSupport}>
          Support
        </button>

        <button type="button" className={homeStyles.footerLink} onClick={onOpenImpressum}>
          Impressum
        </button>
      </footer>
    </>
  );
}
