/*
  First medical screening step of the assessment.

  Acute warning signs interrupt the normal workflow and lead to the
  emergency notice. The assessment can only continue if the user
  explicitly confirms that no warning signs are present.
*/
import { useState } from "react";

/* Shared styles for the form, emergency notice, and action buttons. */
import assessmentStyles from "../Assessment.module.css";

/* Confirmation dialog before directly calling the emergency number. */
import { SosModal } from "./SosModal";

/* Types for warning signs and the central step navigation. */
import type { RedFlags, Step } from "../../types/assessment";

/* Central configuration for the available warning signs and their labels. */
import { redFlagCheckboxes } from "../medicalLogic/redFlagCheckboxes";

/*
  Props for the Red Flags step.

  redFlags / noRedFlags:
  Store the current selection. The parent component ensures that both
  states are mutually exclusive through its update functions.

  hasEmergency:
  Indicates whether at least one warning sign has been selected.

  isOffline / startFormOffline:
  Distinguish between an assessment that was intentionally started
  offline and one that lost its internet connection after starting online.

  updateRedFlag / selectNoRedFlags:
  Update the centrally stored responses.

  onContinue / setStep:
  Continue to the next assessment step or return to the start page.
*/
type RedFlagsStepProps = {
  redFlags: RedFlags;

  noRedFlags: boolean;
  hasEmergency: boolean;
  isOffline: boolean;
  startFormOffline: boolean;

  updateRedFlag: (
    key: keyof RedFlags,
    checked: boolean
  ) => void;

  selectNoRedFlags: (checked: boolean) => void;

  onContinue: () => void;
  setStep: (step: Step) => void;
};

export function RedFlagsStep({
  redFlags,
  noRedFlags,
  hasEmergency,
  startFormOffline,
  updateRedFlag,
  selectNoRedFlags,
  onContinue,
  setStep,
  isOffline,
}: RedFlagsStepProps) {
  /* Controls the SOS dialog without changing the central assessment state. */
  const [showSos, setShowSos] = useState(false);

  /*
   Tracks whether the user explicitly selected "Keines davon trifft zu".

   This allows the assessment to return safely if the connection
   is lost during the process.
 */
  const [specificallyNoEmergency, setSpecificallyNoEmergency] = useState(false);

  return (
    <>
      {/* Warning signs are checked before collecting any other health information. */}
      <p className={assessmentStyles.text}>
        Bitte prüfen Sie zuerst, ob akute Warnzeichen vorliegen.
      </p>

      <fieldset className={assessmentStyles.fieldset}>
        <legend className={assessmentStyles.legend}>
          Warnzeichen
        </legend>

        {/* The central configuration keeps the data model and displayed options in sync. */}
        {redFlagCheckboxes.map(({ key, label }) => (
          <label key={key} className={assessmentStyles.label}>
            <input
              type="checkbox"
              checked={redFlags[key]}
              onChange={(event) => updateRedFlag(key, event.target.checked)}
            />
            {label}
          </label>
        ))}

        {/* An explicit negative selection is required before continuing. */}
        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={noRedFlags}
            onChange={(event) => {
              selectNoRedFlags(event.target.checked);
              setSpecificallyNoEmergency(true);
            }}
          />
          Keines davon trifft zu
        </label>
      </fieldset>

      {/* Any selected warning sign interrupts the normal assessment flow. */}
      {hasEmergency && (
        <div className={assessmentStyles.emergencyBox} role="alert">
          <h2 className={assessmentStyles.emergencyTitle}>
            Notfallhinweis
          </h2>

          <p>
            Bei diesen Beschwerden sollten Sie sofort den Notruf wählen.
          </p>

          <button
            type="button"
            onClick={() => setShowSos(true)}
            className={assessmentStyles.emergencyButton}
          >
            112 anrufen
          </button>
        </div>
      )}

      {/* The actual phone link is provided by the reusable SOS modal. */}
      <SosModal
        isOpen={showSos}
        onClose={() => setShowSos(false)}
      />

      {/* Continue normally if online or if the assessment was intentionally started offline. */}
      {!hasEmergency && (!isOffline || startFormOffline) && (
        <button
          type="button"
          className={assessmentStyles.primaryButton}
          onClick={onContinue}
          disabled={!noRedFlags}
        >
          Weiter
        </button>
      )}
      {/*
        Ends the assessment in a controlled way if the connection
        was lost after an online start and a server-based continuation
        is no longer possible.
      */}
      {!hasEmergency && isOffline && specificallyNoEmergency && !startFormOffline && (
        <button
          type="button"
          className={assessmentStyles.primaryButton}
          onClick={() => setStep("start")}
        >
          Zurück zur Startseite
        </button>
      )}
    </>
  );
}
