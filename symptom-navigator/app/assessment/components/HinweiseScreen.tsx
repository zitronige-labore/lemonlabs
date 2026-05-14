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

/*
  Eigenschaften der HinweiseScreen-Komponente.

  hinweiseBestaetigt:
  Speichert, ob die Hinweise bestätigt wurden

  setHinweiseBestaetigt:
  Funktion zum Aktualisieren der Checkbox

  onBack:
  Funktion zum Zurückkehren zur Startseite

  onContinue:
  Funktion zum Wechseln zum nächsten Schritt
*/
type HinweiseScreenProps = {
  hinweiseBestaetigt: boolean;

  setHinweiseBestaetigt: (checked: boolean) => void;

  onBack: () => void;
  onContinue: () => void;
};

/*
  Diese Komponente zeigt wichtige Hinweise
  vor Beginn der medizinischen Ersteinschätzung an.

  Die Nutzerin oder der Nutzer muss die Hinweise
  zuerst bestätigen, bevor fortgefahren werden kann.
*/
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
                src="/images/lemonlabslogo_blue.png"
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
            {/* Zurück zur Startseite */}
            <button
              type="button"
              className={homeStyles.secondaryButton}
              onClick={onBack}
            >
              Zurück
            </button>

            {/* Weiter zur Ersteinschätzung */}
            <button
              type="button"
              className={homeStyles.primaryButton}

              /*
                Der Button bleibt deaktiviert,
                solange die Hinweise nicht bestätigt wurden.
              */
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

      {/* Das Notruf-Modal (Zwischenschritt) */}
      <SosModal isOpen={showSos} onClose={() => setShowSos(false)} />

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