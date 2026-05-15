/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

// state fuer currentText
import { useState } from "react";

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
type SymptomTextInputStepProps = {
  selectedSubRegion: SubRegion | null;

  symptomText: string[];

  addSymptomText: (text: string) => void;

  onContinue: () => void;
};

/*
  Dieser Schritt ermöglicht die eigentliche Eingabe
  der Beschwerden.

  Je nach zuvor gewählter Eingabeart können:
  - Symptome frei beschrieben werden
  - oder aus einer Liste ausgewählt werden
*/
export function SymptomTextInputStep({
  selectedSubRegion,
  symptomText,
  addSymptomText,
  onContinue
}: SymptomTextInputStepProps) {

  const [currentText, setCurrentText] = useState("");
  const [painscale, setPainscale] = useState<string|number>();
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

        {/*
          Freitext-Eingabe der Beschwerden.

          Dieser Bereich wird angezeigt,
          wenn "text" als Eingabeart gewählt wurde.
        */}
        
          <label className={assessmentStyles.formLabel}>
            Beschreiben Sie Ihre Beschwerden:

            <textarea
              className={assessmentStyles.input}

              onChange={(event) => {
                setCurrentText(event.target.value)
              }}

              placeholder="Beschreiben Sie Ihre Symptome..."

              maxLength={1000}
            />

            {/* Anzeige der aktuellen Zeichenanzahl */}
            <span
              className={assessmentStyles.characterCounter}
            >
              {currentText.length}/1000 Zeichen
            </span>
          </label>

          <label> Handelt es sich beim angegebenen Symptom um Schmerzen?
            <input 
            className={assessmentStyles.regionButton}
            type="checkbox" 
            onClick={ () => {
              setIsPainSymptom(!isPainSymptom)
            }}
            />
          </label>

          {isPainSymptom && (
            <>
              {/* Anzeige des aktuellen Wertes */}
              <strong>{painscale || "nicht gewaehlt"}/10</strong>

              <input
                    className={assessmentStyles.slider}
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    onChange={(event) =>
                    setPainscale(event.target.value)                      
                    }
              ></input>
            </>
          )}

        
      {/* Button zum Wechseln zum nächsten Schritt */}
      <button
        type="button"
        className={assessmentStyles.primaryButton}
        onClick={() => {
          onContinue();                  
          addSymptomText(`{"text_symptom":"${currentText}","bodyregion":"${selectedSubRegion}","painscale":${painscale?? null}}`);
        }}

        /*
          Der Button bleibt deaktiviert,
          solange keine Beschwerden angegeben wurden.
        */
        disabled={
            currentText.length === 0
        }
      >
        Weiter
      </button>
      </fieldset>
    </>
  );
}