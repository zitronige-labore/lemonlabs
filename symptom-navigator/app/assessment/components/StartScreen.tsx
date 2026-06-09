import { useEffect, useState } from "react";
import homeStyles from "../../Home.module.css";
import type { Step } from "../../types/assessment";
import { SosModal } from "./SosModal";

type StartScreenProps = {
  onStartAssessment: () => void;
  resetProcess: () => void;
  setStep: (step: Step) => void;
  isOffline: boolean;
};

export function StartScreen({
  onStartAssessment,
  resetProcess,
  setStep,
  isOffline,
}: StartScreenProps) {
  const [showSos, setShowSos] = useState(false);
  const [showStartHints, setShowStartHints] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowStartHints(false);
    }, 10000);

    return () => window.clearTimeout(timer);
  }, []);

  const hideStartHints = () => setShowStartHints(false);

  return (
    <>
      <div className={homeStyles.hauptbox}>
        <div className={homeStyles.kopfbox}>
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

          <p className={homeStyles.intro}>Was ist dein Anliegen?</p>

          <div className={homeStyles.buttonBox}>

            {!isOffline && (
            <>
            <div className={homeStyles.startHintTarget}>
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

              {showStartHints && (
                <button
                  type="button"
                  className={homeStyles.startHint}
                  onClick={hideStartHints}
                >
                  Startet die geführte Symptomeinschätzung Schritt für Schritt.
                </button>
              )}
            </div>

            <div className={homeStyles.startHintTarget}>
              <button
                type="button"
                className={homeStyles.secondaryButton}
                onClick={() => setStep("other")}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                Andere Anliegen
              </button>

              {showStartHints && (
                <button
                  type="button"
                  className={homeStyles.startHint}
                  onClick={hideStartHints}
                >
                  Öffnet Termine, Online-Rezepte und die Datenverwaltung.
                </button>
              )}
            </div>
            </>
            )}
            {isOffline && (
              <>
              <p>
                Hier Offline Hinweise oder Buttons einfügen
              </p>
            
              <button
                type="button"
                className={homeStyles.primaryButton}
                onClick={() => {
                  onStartAssessment();
                  resetProcess();
                }}
              >
                Warnzeichen erkennen
              </button>
              </>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          hideStartHints();
          setShowSos(true);
        }}
        className={homeStyles.sosButton}
      >
        SOS
      </button>

      {showStartHints && (
        <>
          <button
            type="button"
            className={`${homeStyles.startHint} ${homeStyles.sosHint}`}
            onClick={hideStartHints}
          >
            Öffnet schnelle Hinweise für akute Notfälle.
          </button>

          <button
            type="button"
            className={`${homeStyles.startHint} ${homeStyles.tutorialHint}`}
            onClick={hideStartHints}
          >
            Erklärt den aktuellen Schritt der Anwendung.
          </button>
        </>
      )}

      <SosModal
        isOpen={showSos}
        onClose={() => setShowSos(false)}
      />

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
