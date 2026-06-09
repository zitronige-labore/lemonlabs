import { useState } from "react";
import homeStyles from "../../Home.module.css";
import type { Step } from "../../types/assessment";
import { SosModal } from "./SosModal";

type StartScreenProps = {
  onStartAssessment: () => void;
  resetProcess: () => void;
  setStep: (step: Step) => void;
};

export function StartScreen({
  onStartAssessment,
  resetProcess,
  setStep,
}: StartScreenProps) {
  const [showSos, setShowSos] = useState(false);

  return (
    <>
      <div className={homeStyles.hauptbox}>
        <div className={homeStyles.kopfbox}>
          <div className={homeStyles.header}>
            <h1 className={homeStyles.title}>MediGuide</h1>

            <h2 className={homeStyles.subtitle}>
              <span>by lemonlabs</span>
            </h2>
          </div>

          <p className={homeStyles.intro}>Was ist dein Anliegen?</p>

          <div className={homeStyles.buttonBox}>
            <section
              className={`${homeStyles.actionCard} ${homeStyles.primaryActionCard}`}
            >
              <button
                type="button"
                className={homeStyles.primaryButton}
                onClick={() => {
                  onStartAssessment();
                  resetProcess();
                }}
              >
                Ersteinschätzung von Symptomen
              </button>
              <p className={homeStyles.actionDescription}>
                Geführte Einschätzung mit Warnzeichen-Prüfung, Körperregion und
                anschließender Zusammenfassung.
              </p>
            </section>

            <section className={homeStyles.actionCard}>
              <button
                type="button"
                className={homeStyles.secondaryButton}
                onClick={() => setStep("other")}
              >
                Andere Anliegen
              </button>
              <p className={homeStyles.actionDescription}>
                Termine, Online-Rezepte und gespeicherte Daten verwalten.
              </p>
            </section>
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
