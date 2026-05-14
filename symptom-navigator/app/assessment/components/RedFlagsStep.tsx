/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

/*
  Import des Typs für medizinische Warnzeichen.
*/
import type { RedFlags } from "../../types/assessment";

/*
  Eigenschaften der RedFlagsStep-Komponente.

  redFlags:
  Enthält die aktuell ausgewählten Warnzeichen

  noRedFlags:
  Gibt an, ob "Keines davon trifft zu" ausgewählt wurde

  hasEmergency:
  Gibt an, ob mindestens ein Warnzeichen aktiv ist

  updateRedFlag:
  Funktion zum Aktualisieren einzelner Warnzeichen

  selectNoRedFlags:
  Funktion zum Aktivieren oder Deaktivieren
  von "Keines davon trifft zu"

  onContinue:
  Funktion zum Wechseln zum nächsten Schritt
*/
type RedFlagsStepProps = {
  redFlags: RedFlags;

  noRedFlags: boolean;
  hasEmergency: boolean;

  updateRedFlag: (
    key: keyof RedFlags,
    checked: boolean
  ) => void;

  selectNoRedFlags: (checked: boolean) => void;

  onContinue: () => void;
};

/*
  Dieser Schritt überprüft,
  ob akute medizinische Warnzeichen vorliegen.

  Falls Warnzeichen ausgewählt werden,
  erscheint ein deutlicher Notfallhinweis.
*/
export function RedFlagsStep({
  redFlags,
  noRedFlags,
  hasEmergency,
  updateRedFlag,
  selectNoRedFlags,
  onContinue,
}: RedFlagsStepProps) {
  return (
    <>
      {/* Beschreibung des aktuellen Schritts */}
      <p className={assessmentStyles.text}>
        Bitte prüfen Sie zuerst, ob akute Warnzeichen vorliegen.
      </p>

      {/* Formularbereich für Warnzeichen */}
      <fieldset className={assessmentStyles.fieldset}>
        <legend className={assessmentStyles.legend}>
          Warnzeichen
        </legend>

        {/* Starke Brustschmerzen */}
        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={redFlags.chestPain}
            onChange={(event) =>
              updateRedFlag(
                "chestPain",
                event.target.checked
              )
            }
          />

          Starke Brustschmerzen
        </label>

        {/* Atemnot oder starke Atemprobleme */}
        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={redFlags.breathingProblems}
            onChange={(event) =>
              updateRedFlag(
                "breathingProblems",
                event.target.checked
              )
            }
          />

          Atemnot oder starke Atemprobleme
        </label>

        {/* Bewusstlosigkeit oder starke Benommenheit */}
        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={redFlags.unconsciousness}
            onChange={(event) =>
              updateRedFlag(
                "unconsciousness",
                event.target.checked
              )
            }
          />

          Bewusstlosigkeit oder starke Benommenheit
        </label>

        {/* Starke Blutung */}
        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={redFlags.severeBleeding}
            onChange={(event) =>
              updateRedFlag(
                "severeBleeding",
                event.target.checked
              )
            }
          />

          Starke Blutung
        </label>

        {/* Schlaganfall-Symptome */}
        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={redFlags.strokeSymptoms}
            onChange={(event) =>
              updateRedFlag(
                "strokeSymptoms",
                event.target.checked
              )
            }
          />

          Lähmung, Sprachstörung oder Verdacht auf Schlaganfall
        </label>

        {/* Hohes Fieber mit Verwirrtheit */}
        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={redFlags.highFeverConfusion}
            onChange={(event) =>
              updateRedFlag(
                "highFeverConfusion",
                event.target.checked
              )
            }
          />

          Hohes Fieber mit Verwirrtheit
        </label>

        {/* Option: Kein Warnzeichen trifft zu */}
        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={noRedFlags}
            onChange={(event) =>
              selectNoRedFlags(event.target.checked)
            }
          />

          Keines davon trifft zu
        </label>
      </fieldset>

      {/* Notfallhinweis bei akuten Warnzeichen */}
      {hasEmergency && (
        <div className={assessmentStyles.emergencyBox}>
          <h2 className={assessmentStyles.emergencyTitle}>
            Notfallhinweis
          </h2>

          <p>
            Bei diesen Beschwerden sollten Sie sofort den Notruf wählen.
          </p>

          {/* Direktwahl des Notrufs */}
          <a
            href="tel:112"
            className={assessmentStyles.emergencyButton}
          >
            112 anrufen
          </a>
        </div>
      )}

      {/* Weiter-Button nur ohne Warnzeichen */}
      {!hasEmergency && (
        <button
          type="button"
          className={assessmentStyles.primaryButton}

          onClick={onContinue}

          /*
            Der Button bleibt deaktiviert,
            solange "Keines davon trifft zu"
            nicht bestätigt wurde.
          */
          disabled={!noRedFlags}
        >
          Weiter
        </button>
      )}
    </>
  );
}