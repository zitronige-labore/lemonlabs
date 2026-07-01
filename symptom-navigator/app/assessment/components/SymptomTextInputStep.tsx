/*
  Import the CSS module used by the assessment views.
*/
import assessmentStyles from "../Assessment.module.css";

/*
  useState is used for the local symptom text,
  the optional pain scale, and the pain selection.
*/
import { useState } from "react";

/*
  Import the required type definitions.

  SubRegion:
  The selected body map subregion.
*/
import type {
  SubRegion,
} from "../../types/assessment";

/*
  Props for the SymptomTextInputStep component.

  selectedSubRegion:
  The most recently selected body map subregion.
  It is stored together with the symptom description.

  symptomText:
  Previously saved free-text symptoms.
  The value is not rendered here directly but remains
  part of the shared assessment state.

  addSymptomText:
  Passes the newly entered symptom description
  to page.tsx.

  onContinue:
  Navigates to the next assessment step
  after the symptom has been saved.
*/
type SymptomTextInputStepProps = {
  selectedSubRegion: SubRegion | null;

  symptomText: string[];

  addSymptomText: (text: string) => void;

  onContinue: () => void;
};

/*
  This step allows the user to describe
  their symptoms in free text.
*/
export function SymptomTextInputStep({
  selectedSubRegion,
  symptomText,
  addSymptomText,
  onContinue
}: SymptomTextInputStepProps) {

  /*
  Stores the currently entered symptom description
  before it is added to the central symptom list.
*/
  const [currentText, setCurrentText] = useState("");

   /*
    Stores the optional pain intensity.

    The value comes from the range input as a string,
    but conceptually represents a numeric value.
  */
  const [painscale, setPainscale] = useState<string | number>();

  /*
    Controls whether the pain scale
    is displayed.
  */
  const [isPainSymptom, setIsPainSymptom] = useState(false);

  return (
    <>
      {/* Display the selected body region. */}
      <p className={assessmentStyles.text}>
        Ausgewählte Region:{" "}
        <strong>{selectedSubRegion}</strong>
      </p>

      {/* Symptom input formular. */}
      <fieldset className={assessmentStyles.fieldset}>
        <legend className={assessmentStyles.legend}>
          Beschwerden
        </legend>

        <label htmlFor="symptom-text-desc" className={assessmentStyles.formLabel}>
          Beschreiben Sie Ihre Beschwerden:
        </label>
        <textarea
          id="symptom-text-desc"
          className={assessmentStyles.input}
          onChange={(event) => {
            setCurrentText(event.target.value);
          }}
          placeholder="Beschreiben Sie Ihre Symptome..."
          maxLength={1000}
        />

        {/* Display the current character count. */}
        <span className={assessmentStyles.characterCounter}>
          {currentText.length}/1000 Zeichen
        </span>

        {/* Optional indication whether the symptom involves pain. */}
        <label htmlFor="is-pain-symptom-checkbox" className={assessmentStyles.label}>
          <input
            id="is-pain-symptom-checkbox"
            type="checkbox"
            checked={isPainSymptom}
            onChange={() => {
              setIsPainSymptom(!isPainSymptom);
            }}
          />
          Handelt es sich um Schmerzen?
        </label>

        {isPainSymptom && (
          /*
            Show the pain scale only if the symptom
            has been marked as pain.
          */
          <fieldset className={assessmentStyles.fieldset}>
            <legend className={assessmentStyles.legend}>
              Schmerzstärke
            </legend>
            <p className={assessmentStyles.text}>
              Wie stark sind Ihre Schmerzen?
            </p>
            <strong className={assessmentStyles.selectedText}>{painscale || "nicht gewählt"}/10</strong>

            <input
              id="pain-intensity-slider"
              className={assessmentStyles.slider}
              type="range"
              min="0"
              max="10"
              step="1"
              aria-label="Schmerzstärke"
              onChange={(event) =>
                setPainscale(event.target.value)
              }
            />
            <p className={assessmentStyles.sliderHint}>
              0 = kein Schmerz · 10 = stärkster vorstellbarer Schmerz
            </p>
          </fieldset>
        )}

        {/* Save the symptom together with the selected region and optional pain scale. */}
        <button
          type="button"
          className={assessmentStyles.primaryButton}
          onClick={() => {
            /*
              The symptom is stored as a JSON-like string because
              CheckInfo, ResultStep, and the data management view
              later read and parse the same structure.
            */
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
