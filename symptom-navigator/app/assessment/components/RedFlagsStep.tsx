import { useState } from "react";

/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

/*
  Import der SosModal-Komponente
*/
import { SosModal } from "./SosModal";

/*
  Import des Typs für medizinische Warnzeichen.
*/
import type { RedFlags, Step } from "../../types/assessment";

// import of objects that also contain button text
import { redFlagCheckboxes} from "../medicalLogic/redFlagCheckboxes";

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
  const [showSos, setShowSos] = useState(false);
  const [specificallyNoEmergency, setSpecificallyNoEmergency] = useState(false);

  return (
    <>
      <p className={assessmentStyles.text}>
        Bitte prüfen Sie zuerst, ob akute Warnzeichen vorliegen.
      </p>

      <fieldset className={assessmentStyles.fieldset}>
        <legend className={assessmentStyles.legend}>
          Warnzeichen
        </legend>

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

        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={noRedFlags}
            onChange={(event) =>{
              selectNoRedFlags(event.target.checked);
              setSpecificallyNoEmergency(true);
            }}
          />
          Keines davon trifft zu
        </label>
      </fieldset>

      {hasEmergency && (
        <div className={assessmentStyles.emergencyBox}>
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

      <SosModal
        isOpen={showSos}
        onClose={() => setShowSos(false)}
      />

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
