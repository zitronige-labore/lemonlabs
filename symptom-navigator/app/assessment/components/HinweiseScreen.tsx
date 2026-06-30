/*
  Mandatory information screen before starting the medical initial assessment.

  It clearly distinguishes the application from medical diagnosis and advice,
  highlights acute emergencies, and requires explicit confirmation before the
  red flag screening begins.
*/
import { useState } from "react";

/* Shared styles for the start page, information, navigation, and emergency access. */
import homeStyles from "../../Home.module.css";

/* Reusable modal with a direct phone link to the emergency number (112). */
import { SosModal } from "./SosModal";

/*
  Properties of the information screen.

  hinweiseBestaetigt / setHinweiseBestaetigt:
  Read and update the confirmation state stored in the application's central state.

  onBack:
  Returns to the home page without starting the assessment.

  onContinue:
  Opens the medical warning signs (red flag) screening after confirmation.
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
  /* The SOS modal is a local UI state used only on this screen. */
  const [showSos, setShowSos] = useState(false);

  return (
    <>
      {/* Standalone information screen using the home page layout. */}
      <div className={homeStyles.hauptbox}>
        <div className={homeStyles.kopfbox}>
          {/* Product header for clear identification before the assessment starts. */}
          <div className={homeStyles.header}>
            <h1 className={homeStyles.title}>Symptometer</h1>

            <h2 className={homeStyles.subtitle}>
              <span>by lemonlabs</span>
            </h2>
          </div>

          {/* Clearly communicate the purpose and medical limitations of the application. */}
          <p className={homeStyles.warningText}>
            Diese Anwendung unterstützt Sie nur bei einer ersten Einschätzung
            Ihrer Beschwerden.
          </p>

          <p className={homeStyles.warningText}>
            Sie ersetzt keine ärztliche Diagnose und keine medizinische Beratung.
          </p>

          {/* Emergency warning signs always take priority over the digital assessment. */}
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

          {/* Continuing is only possible after explicit confirmation. */}
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

      {/* Emergency access remains available regardless of confirmation. */}
      <button
        type="button"
        onClick={() => setShowSos(true)}
        className={homeStyles.sosButton}
        aria-label="SOS Notfallhilfe öffnen"
      >
        SOS
      </button>

      {/* The modal content is only displayed when needed. */}
      <SosModal isOpen={showSos} onClose={() => setShowSos(false)} />

      {/* Footer entries are currently visual only and have no navigation assigned yet. */}
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
