/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

/*
  Import des Typs für die allgemeinen Beschwerdedaten.
*/
import type { BasisData } from "../../types/assessment";

/*
  Eigenschaften der BasisDetailsStep-Komponente.

  basisData:
  Enthält die aktuellen Angaben zu Dauer und Schmerzstärke

  setBasisData:
  Funktion zum Aktualisieren der gespeicherten Angaben
*/
type BasisDetailsStepProps = {
  basisData: BasisData;
  setBasisData: (basisData: BasisData) => void;
};

/*
  Dieser Schritt sammelt zusätzliche Informationen
  zu den Beschwerden.

  Dazu gehören:
  - Dauer der Beschwerden
  - Schmerzintensität
*/
export function BasisDetailsStep({
  basisData,
  setBasisData,
}: BasisDetailsStepProps) {
  return (
    <>
      {/* Beschreibung des aktuellen Schritts */}
      <p className={assessmentStyles.text}>
        Bitte machen Sie noch einige Angaben zu Ihren Beschwerden.
      </p>

      {/* Formularbereich für zusätzliche Angaben */}
      <fieldset className={assessmentStyles.fieldset}>
        <legend className={assessmentStyles.legend}>
          Weitere Angaben
        </legend>

        {/* Eingabe zur Dauer der Beschwerden */}
        <label className={assessmentStyles.formLabel}>
          Seit wann bestehen die Beschwerden?

          <input
            className={assessmentStyles.input}
            type="text"
            value={basisData.duration}
            onChange={(event) =>
              setBasisData({
                ...basisData,
                duration: event.target.value,
              })
            }
            placeholder="Zum Beispiel: seit 2 Tagen"
          />
        </label>

        {/* Slider zur Auswahl der Schmerzintensität */}
        <label className={assessmentStyles.formLabel}>
          Wie stark sind die Schmerzen?

          {/* Anzeige des aktuellen Wertes */}
          <strong>{basisData.intensity || "0"}/10</strong>

          <input
            className={assessmentStyles.slider}
            type="range"
            min="0"
            max="10"
            step="1"
            value={basisData.intensity}
            onChange={(event) =>
              setBasisData({
                ...basisData,
                intensity: event.target.value,
              })
            }
          />

          {/* Erklärung der Skala */}
          <span className={assessmentStyles.sliderHint}>
            0 = keine Schmerzen, 10 = stärkste vorstellbare Schmerzen
          </span>
        </label>
      </fieldset>

      {/* Button zum Abschließen der Ersteinschätzung */}
      <button
        type="submit"
        className={assessmentStyles.primaryButton}
        disabled={!basisData.duration || !basisData.intensity}
      >
        Einschätzung abschließen
      </button>
    </>
  );
}