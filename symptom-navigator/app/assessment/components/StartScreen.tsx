import { useState } from "react";
import homeStyles from "../../Home.module.css";
import type { Step } from "../../types/assessment";
import { SosModal } from "./SosModal";

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
  const [showSos, setShowSos] = useState(false);

  return (
    <>
      <div className={homeStyles.hauptbox}>
        <div className={homeStyles.kopfbox}>
          <div className={homeStyles.header}>
            <h1 className={homeStyles.title}>Symptometer</h1>

            <h2 className={homeStyles.subtitle}>
              <span>by lemonlabs</span>
            </h2>
          </div>

          <div className={homeStyles.buttonBox}>
            {!isOffline && (
              <>
                <button
                  type="button"
                  className={`${homeStyles.primaryButton} ${homeStyles.startActionButton}`}
                  onClick={() => {
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

            {isOffline && (
              <>
                <p>Hier Offline Hinweise oder Buttons einfügen</p>

                <button
                  type="button"
                  className={homeStyles.primaryButton}
                  onClick={() => {
                    onStartAssessment();
                    resetProcess();
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

      <button
        type="button"
        onClick={() => setShowSos(true)}
        className={homeStyles.sosButton}
        aria-label="SOS Notfallhilfe öffnen"
      >
        SOS
      </button>

      <SosModal isOpen={showSos} onClose={() => setShowSos(false)} />

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
