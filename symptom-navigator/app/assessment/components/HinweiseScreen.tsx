import { useState } from "react";

/*
  Import der CSS-Module der Start- und Hinweisseiten.

  Diese Styles werden für das Layout,
  die Buttons und die Warnhinweise verwendet.
*/
import homeStyles from "../../Home.module.css";

/*
  Import der SosModal-Komponente
*/
import { SosModal } from "./SosModal";

type HinweiseScreenProps = {
  hinweiseBestaetigt: boolean;

  setHinweiseBestaetigt: (checked: boolean) => void;

  onContinue: () => void;
};

export function HinweiseScreen({
  hinweiseBestaetigt,
  setHinweiseBestaetigt,
  onBack,
  onContinue,
}: HinweiseScreenProps) {
  const [showSos, setShowSos] = useState(false);

  return (
    <>
      {/* Hauptcontainer der Hinweis-Seite */}
      <div className={homeStyles.hauptbox}>
        <div className={homeStyles.kopfbox}>
          {/* Kopfbereich mit Titel und Logo */}
          <div className={homeStyles.header}>
            <h1 className={homeStyles.title}>MediGuide</h1>

            <h2 className={homeStyles.subtitle}>
              <span>by lemonlabs</span>

              <img
                src="/images/logo778899.svg"
                alt="Lemonlabs Logo"
                className={homeStyles.logo}
              />
            </h2>
          </div>

          {/* Allgemeiner Hinweis zur Anwendung */}
          <p className={homeStyles.warningText}>
            Diese Anwendung unterstützt Sie nur bei einer ersten Einschätzung
            Ihrer Beschwerden.
          </p>

          {/* Hinweis zur fehlenden medizinischen Diagnose */}
          <p className={homeStyles.warningText}>
            Sie ersetzt keine ärztliche Diagnose und keine medizinische Beratung.
          </p>

          {/* Hinweis auf medizinische Notfälle */}
          <div className={homeStyles.notrufBox}>
            Bei akuten Beschwerden wie Atemnot, Bewusstlosigkeit oder starken
            Brustschmerzen wählen Sie sofort den Notruf 112.
          </div>

          {/* Checkbox zur Bestätigung der Hinweise */}
          <label className={homeStyles.checkboxLabel}>
            <input
              type="checkbox"
              checked={hinweiseBestaetigt}
              onChange={(event) =>
                setHinweiseBestaetigt(event.target.checked)
              }
            />

            Ich habe die Hinweise gelesen und verstanden.
          </label>

          {/* Navigationsbuttons */}
          <div className={homeStyles.buttonBox}>
            <button
              type="button"
              className={homeStyles.primaryButton}
              disabled={!hinweiseBestaetigt}
              onClick={onContinue}
            >
              Weiter zur Ersteinschätzung
            </button>
          </div>
        </div>
      </div>

      {/* Schnellzugriff auf den Notruf */}
      <button
        type="button"
        onClick={() => setShowSos(true)}
        className={homeStyles.sosButton}
      >
        SOS
      </button>

      {/* Das Notruf-Modal */}
      <SosModal
        isOpen={showSos}
        onClose={() => setShowSos(false)}
      />

      {/* Fußzeile der Seite */}
      <footer className={homeStyles.footer}>
        <button type="button" className={homeStyles.footerLink}>
          Kontakt
        </button>

        <button type="button" className={homeStyles.footerLink}>
          Datenschutz
        </button>

        <button type="button" className={homeStyles.footerLink}>
          Support
        </button>

        <button type="button" className={homeStyles.footerLink}>
          Impressum
        </button>
      </footer>
    </>
  );
}
