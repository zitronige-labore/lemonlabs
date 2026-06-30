import { useState } from "react";

/*
  Styles and types used by the start page.

  The start page uses the Home styles because it is displayed
  outside the assessment form layout.
*/
import homeStyles from "../../Home.module.css";
import type { Step } from "../../types/assessment";

/*
  Modal providing quick access to emergency information.
*/
import { SosModal } from "./SosModal";

/*
  Props for the StartScreen component.

  onStartAssessment:
  Starts the information page and assessment flow.

  resetProcess:
  Clears previous input so a new assessment
  always starts with a clean state.

  setStep:
  Navigates to other start page sections such as
  "Andere Anliegen" or the privacy page.

  isOffline:
  Determines whether the online or offline version
  of the start page is displayed.

  setStartFormOffline:
  Stores whether the assessment was started
  in offline mode.
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
    Tracks whether the SOS modal is open and saves it.
  */
  const [showSos, setShowSos] = useState(false);

  return (
    <>
      {/* Main start page section with branding and entry options. */}
      <div className={homeStyles.hauptbox}>
        <div className={homeStyles.kopfbox}>
          {/* Header containing the product name and branding. */}
          <div className={homeStyles.header}>
            <h1 className={homeStyles.title}>Symptometer</h1>

            <h2 className={homeStyles.subtitle}>
              <span>by lemonlabs</span>
            </h2>
          </div>

          {/* Available actions on the start page. */}
          <div className={homeStyles.buttonBox}>
            {/*
              Online mode:
              The full assessment and additional services
              are available.
            */}
            {!isOffline && (
              <>
                <button
                  type="button"
                  className={`${homeStyles.primaryButton} ${homeStyles.startActionButton}`}
                  onClick={() => {
                       /*
                      Clear any previous data before starting
                      a new assessment.
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
              Offline mode:
              The workflow is limited because server-based
              features are not available.
            */}
            {isOffline && (
              <>
                <p className={homeStyles.offlineNotices}>
                Offline kann keine umfangreicher Einschätzung von Symptomen erfolgen. <br></br>
                Falls ein Notfall vorliegt wählen Sie die 112 oder nutzen Sie den SOS Button. <br></br>
                Falls Sie nicht Wissen, ob es sich um einen Notfall handelt, können Sie unter “Warnzeichen erkennen” einige Notfallsituationen feststellen. <br></br>
                Falls unter “Warnzeichen erkennen” Ihre Situation nicht vorliegt rufen Sie den Ärztlichen Notdienst unter der Nummer 116117 an. <br></br>
                </p>

                <button
                  type="button"
                  className={homeStyles.primaryButton}
                  onClick={() => {
                    onStartAssessment();
                    resetProcess();
                     /*
                      Only prepare the red flag check.
                      A complete offline assessment should not start.
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
                      Store that the assessment was started
                      in offline mode so later steps can
                      follow the limited workflow.
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

      {/* Emergency help is always available, regardless of the selected entry path. */}
      <button
        type="button"
        onClick={() => setShowSos(true)}
        className={homeStyles.sosButton}
        aria-label="SOS Notfallhilfe öffnen"
      >
        SOS
      </button>

      {/* SOS modal displayed from the start page. */}
      <SosModal isOpen={showSos} onClose={() => setShowSos(false)} />

      {/* Footer containing navigation links. */}
      <footer className={homeStyles.footer}>
        <button type="button" className={homeStyles.footerLink}>
          Kontakt
        </button>

        {/* The privacy page is implemented as a separate application step. */}
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
