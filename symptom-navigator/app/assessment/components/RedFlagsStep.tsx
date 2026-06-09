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
import type { RedFlags } from "../../types/assessment";

type RedFlagsStepProps = {
  redFlags: RedFlags;

  noRedFlags: boolean;
  hasEmergency: boolean;
  isOffline: boolean;

  updateRedFlag: (
    key: keyof RedFlags,
    checked: boolean
  ) => void;

  selectNoRedFlags: (checked: boolean) => void;

  onContinue: () => void;
};

export function RedFlagsStep({
  redFlags,
  noRedFlags,
  hasEmergency,
  updateRedFlag,
  selectNoRedFlags,
  onContinue,
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

        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={redFlags.chestPain}
            onChange={(event) =>
              updateRedFlag("chestPain", event.target.checked)
            }
          />
          Starke Brustschmerzen
        </label>

        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={redFlags.breathingProblems}
            onChange={(event) =>
              updateRedFlag("breathingProblems", event.target.checked)
            }
          />
          Atemnot oder starke Atemprobleme
        </label>

        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={redFlags.unconsciousness}
            onChange={(event) =>
              updateRedFlag("unconsciousness", event.target.checked)
            }
          />
          Bewusstlosigkeit oder starke Benommenheit
        </label>

        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={redFlags.severeBleeding}
            onChange={(event) =>
              updateRedFlag("severeBleeding", event.target.checked)
            }
          />
          Starke Blutung
        </label>

        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={redFlags.strokeSymptoms}
            onChange={(event) =>
              updateRedFlag("strokeSymptoms", event.target.checked)
            }
          />
          Lähmung, Sprachstörung oder Verdacht auf Schlaganfall
        </label>

        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={redFlags.highFeverConfusion}
            onChange={(event) =>
              updateRedFlag("highFeverConfusion", event.target.checked)
            }
          />
          Hohes Fieber mit Verwirrtheit
        </label>

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

      {!hasEmergency && !isOffline && (
        <button
          type="button"
          className={assessmentStyles.primaryButton}
          onClick={onContinue}
          disabled={!noRedFlags}
        >
          Weiter
        </button>
      )}
      {!hasEmergency && isOffline && specificallyNoEmergency && (
        <p>
          Im Offline Modus geht es hier nicht weiter. Sobald eine Internetverbindung besteht, können Sie hier Symptome angeben aus auswerten lassen.
        </p>
      )}
    </>
  );
}
