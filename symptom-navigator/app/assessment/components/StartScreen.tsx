import { useState } from "react";

/*
  Styles und Typen für die Startseite.

  Die Startseite verwendet die Home-Styles,
  weil sie außerhalb des Assessment-Formularlayouts angezeigt wird.
*/
import homeStyles from "../../Home.module.css";
import type { Step } from "../../types/assessment";

/*
  Modal für den direkten Zugriff auf Notfallinformationen.
*/
import { SosModal } from "./SosModal";

/*
  Eigenschaften der StartScreen-Komponente.

  onStartAssessment:
  Wechselt in den Hinweis- beziehungsweise Assessment-Ablauf.

  resetProcess:
  Löscht vorherige Eingaben, damit ein neuer Durchlauf
  nicht mit alten Daten startet.

  setStep:
  Navigiert zu Startseiten-Bereichen wie "Andere Anliegen"
  oder Datenschutz.

  isOffline:
  Entscheidet, ob die Online- oder Offline-Variante der Startseite
  angezeigt wird.

  setStartFormOffline:
  Merkt, ob die Ersteinschätzung im eingeschränkten Offline-Modus
  begonnen wurde.
*/
type StartScreenProps = {
  onStartAssessment: () => void;
  resetProcess: () => void;
  setStep: (step: Step) => void;
  isOffline: boolean;
  setStartFormOffline: (startFormOffline: boolean) => void;
};

export function StartScreen({
  onStartAssessment,
  resetProcess,
  setStep,
  setStartFormOffline,
  isOffline,
}: StartScreenProps) {
  /*
    Speichert, ob das SOS-Modal auf der Startseite geöffnet ist.
  */
  const [showSos, setShowSos] = useState(false);

  return (
    <>
      {/* Hauptbereich der Startseite mit Logo und Einstiegsauswahl */}
      <div className={homeStyles.hauptbox}>
        <div className={homeStyles.kopfbox}>
          {/* Kopfbereich mit Produktname und Branding */}
          <div className={homeStyles.header}>
            <h1 className={homeStyles.title}>Symptometer</h1>

            <h2 className={homeStyles.subtitle}>
              <span>by lemonlabs</span>
            </h2>
          </div>

          {/* Auswahl der möglichen Startaktionen */}
          <div className={homeStyles.buttonBox}>
            {/*
              Online-Modus:
              Die vollständige Ersteinschätzung und weitere Anliegen
              sind verfügbar.
            */}
            {!isOffline && (
              <>
                <button
                  type="button"
                  className={`${homeStyles.primaryButton} ${homeStyles.startActionButton}`}
                  onClick={() => {
                    /*
                      Alte Angaben werden vor dem Start gelöscht,
                      damit der neue Durchlauf sauber beginnt.
                    */
                    onStartAssessment();
                    resetProcess();
                  }}
                >
                  Ersteinschätzung von Symptomen
                </button>

                <button
                  type="button"
                  className={`${homeStyles.secondaryButton} ${homeStyles.startActionButton}`}
                  onClick={() => setStep("other")}
                >
                  Andere Anliegen
                </button>
              </>
            )}

            {/*
              Offline-Modus:
              Der Ablauf wird eingeschränkt gestartet, weil serverbasierte
              Funktionen nicht zuverlässig verfügbar sind.
            */}
            {isOffline && (
              <>
                <p>Hier Offline Hinweise oder Buttons einfügen</p>

                <button
                  type="button"
                  className={homeStyles.primaryButton}
                  onClick={() => {
                    onStartAssessment();
                    resetProcess();
                    /*
                      Nur die Warnzeichenprüfung wird vorbereitet.
                      Danach soll kein vollständiges Offline-Formular starten.
                    */
                    setStartFormOffline(false)
                  }}
                >
                  Warnzeichen erkennen
                </button>

                <button
                  type="button"
                  className={homeStyles.primaryButton}
                  onClick={() => {
                    onStartAssessment();
                    resetProcess();
                    /*
                      Merkt den Offline-Start, damit spätere Schritte
                      den eingeschränkten Ablauf berücksichtigen können.
                    */
                    setStartFormOffline(true)
                  }}
                >
                  Ersteinschätzung von Symptomen offline starten
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Schnellzugriff auf Notfallhilfe, unabhängig vom gewählten Startpfad */}
      <button
        type="button"
        onClick={() => setShowSos(true)}
        className={homeStyles.sosButton}
        aria-label="SOS Notfallhilfe öffnen"
      >
        SOS
      </button>

      {/* Notfall-Modal der Startseite */}
      <SosModal isOpen={showSos} onClose={() => setShowSos(false)} />

      {/* Fußzeile mit Startseiten-Navigation */}
      <footer className={homeStyles.footer}>
        <button type="button" className={homeStyles.footerLink}>
          Kontakt
        </button>

        {/* Datenschutz ist als eigener Schritt im Startseitenbereich eingebunden */}
        <button type="button" className={homeStyles.footerLink}onClick={() => setStep("datenschutz")}>
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
