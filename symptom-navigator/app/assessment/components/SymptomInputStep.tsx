/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

/*
  Import der benötigten Typdefinitionen.

  InputMode:
  Art der Symptomeingabe

  SubRegion:
  Ausgewählte Unterregion der Körperkarte
*/
import type {
  InputMode,
  SubRegion,
} from "../../types/assessment";

/*
  Import der Hilfsfunktion,
  die passende Symptome
  zur gewählten Unterregion liefert.
*/
import { getSymptomsForSubRegion } from "../utils/assessmentData";

/*
  Eigenschaften der SymptomInputStep-Komponente.

  selectedSubRegion:
  Aktuell ausgewählte Unterregion

  inputMode:
  Art der Symptomeingabe

  symptomText:
  Inhalt der Freitextbeschreibung

  setSymptomText:
  Funktion zum Aktualisieren des Freitexts

  selectedSymptoms:
  Liste aktuell ausgewählter Symptome

  toggleSymptom:
  Funktion zum Hinzufügen oder Entfernen eines Symptoms

  onContinue:
  Funktion zum Wechseln zum nächsten Schritt
*/
type SymptomInputStepProps = {
  selectedSubRegion: SubRegion | null;

  inputMode: InputMode;

  symptomText: string;
  setSymptomText: (text: string) => void;

  selectedSymptoms: string[];

  toggleSymptom: (symptom: string) => void;

  onContinue: () => void;
};

/*
  Dieser Schritt ermöglicht die eigentliche Eingabe
  der Beschwerden.

  Je nach zuvor gewählter Eingabeart können:
  - Symptome frei beschrieben werden
  - oder aus einer Liste ausgewählt werden
*/
export function SymptomInputStep({
  selectedSubRegion,
  inputMode,
  symptomText,
  setSymptomText,
  selectedSymptoms,
  toggleSymptom,
  onContinue,
}: SymptomInputStepProps) {
  return (
    <>
      {/* Anzeige der ausgewählten Unterregion */}
      <p className={assessmentStyles.text}>
        Ausgewählte Region:{" "}
        <strong>{selectedSubRegion}</strong>
      </p>

      {/* Formularbereich für Beschwerden */}
      <fieldset className={assessmentStyles.fieldset}>
        <legend className={assessmentStyles.legend}>
          Beschwerden
        </legend>

        {/*
          Freitext-Eingabe der Beschwerden.

          Dieser Bereich wird angezeigt,
          wenn "text" als Eingabeart gewählt wurde.
        */}
        {inputMode === "text" && (
          <label className={assessmentStyles.formLabel}>
            Beschreiben Sie Ihre Beschwerden:

            <textarea
              className={assessmentStyles.input}
              value={symptomText}

              onChange={(event) =>
                setSymptomText(event.target.value)
              }

              placeholder="Beschreiben Sie Ihre Symptome..."

              maxLength={1000}
            />

            {/* Anzeige der aktuellen Zeichenanzahl */}
            <span
              className={assessmentStyles.characterCounter}
            >
              {symptomText.length}/1000 Zeichen
            </span>
          </label>
        )}

        {/*
          Auswahl typischer Symptome per Checkbox.

          Die Symptome werden passend
          zur Unterregion geladen.
        */}
        {inputMode === "select" &&
          getSymptomsForSubRegion(
            selectedSubRegion
          ).map((symptom) => (
            <label
              key={symptom}
              className={assessmentStyles.label}
            >
              <input
                type="checkbox"

                checked={selectedSymptoms.includes(
                  symptom
                )}

                onChange={() =>
                  toggleSymptom(symptom)
                }
              />

              {symptom}
            </label>
          ))}
      </fieldset>

      {/* Button zum Wechseln zum nächsten Schritt */}
      <button
        type="button"
        className={assessmentStyles.primaryButton}
        onClick={onContinue}

        /*
          Der Button bleibt deaktiviert,
          solange keine Beschwerden angegeben wurden.
        */
        disabled={
          inputMode === "text"
            ? symptomText.trim().length === 0
            : selectedSymptoms.length === 0
        }
      >
        Weiter
      </button>
    </>
  );
}