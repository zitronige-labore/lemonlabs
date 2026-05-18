/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

// state fuer currentText
import { useState } from "react";

/*
  Import der benötigten Typdefinitionen.

  SubRegion:
  Ausgewählte Unterregion der Körperkarte
*/
import type {
  SubRegion,
} from "../../types/assessment";

/*
  Eigenschaften der SymptomInputStep-Komponente.
*/
type SymptomTextInputStepProps = {
  selectedSubRegion: SubRegion | null;

  symptomText: string[];

  addSymptomText: (text: string) => void;

  onContinue: () => void;
};

/*
  Dieser Schritt ermöglicht die eigentliche Eingabe
  der Beschwerden.
*/
export function SymptomTextInputStep({
  selectedSubRegion,
  symptomText,
  addSymptomText,
  onContinue
}: SymptomTextInputStepProps) {

  const [currentText, setCurrentText] = useState("");
  const [painscale, setPainscale] = useState<string | number>();
  const [isPainSymptom, setIsPainSymptom] = useState(false);

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

        <label className={assessmentStyles.formLabel}>
          Beschreiben Sie Ihre Beschwerden:

          <textarea
            className={assessmentStyles.input}
            onChange={(event) => {
              setCurrentText(event.target.value);
            }}
            placeholder="Beschreiben Sie Ihre Symptome..."
            maxLength={1000}
          />

          {/* Anzeige der aktuellen Zeichenanzahl */}
          <span className={assessmentStyles.characterCounter}>
            {currentText.length}/1000 Zeichen
          </span>
        </label>

        <label className={assessmentStyles.label}>
          <input
            type="checkbox"
            checked={isPainSymptom}
            onChange={() => {
              setIsPainSymptom(!isPainSymptom);
            }}
          />
          Handelt es sich um Schmerzen?
        </label>

        {isPainSymptom && (
           <fieldset className={assessmentStyles.fieldset}>
            <legend className={assessmentStyles.legend}>
              Schmerzstärke
            </legend>
            <p className={assessmentStyles.text}>
              Wie stark sind Ihre Schmerzen?
            </p>
            <strong className={assessmentStyles.selectedText}>{painscale || "nicht gewählt"}/10</strong>

            <input
              className={assessmentStyles.slider}
              type="range"
              min="0"
              max="10"
              step="1"
              onChange={(event) =>
                setPainscale(event.target.value)
              }
            />
            <p className={assessmentStyles.sliderHint}>
              0 = kein Schmerz · 10 = stärkster vorstellbarer Schmerz
            </p>
            </fieldset>
        )}

        {/* Button zum Wechseln zum nächsten Schritt */}
        <button
          type="button"
          className={assessmentStyles.primaryButton}
          onClick={() => {
            addSymptomText(
              `{"text_symptom":"${currentText}","bodyregion":"${selectedSubRegion}","painscale":${isPainSymptom ? painscale ?? null : null}}`
            );
            onContinue();
          }}
          disabled={currentText.length === 0}
        >
          Weiter
        </button>
      </fieldset>
    </>
  );
}
