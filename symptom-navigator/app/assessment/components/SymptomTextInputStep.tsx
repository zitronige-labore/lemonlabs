/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

/*
  useState wird für die lokale Freitexteingabe,
  die optionale Schmerzskala und die Schmerz-Auswahl benötigt.
*/
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
  Eigenschaften der SymptomTextInputStep-Komponente.

  selectedSubRegion:
  Die zuletzt ausgewählte Unterregion der Körperkarte.
  Sie wird zusammen mit dem Freitext gespeichert.

  symptomText:
  Bereits gespeicherte Freitextsymptome.
  Der Wert wird hier nicht direkt gerendert, bleibt aber Teil
  der Schnittstelle zum zentralen Assessment-State.

  addSymptomText:
  Übergibt den neu formulierten Freitext an page.tsx.

  onContinue:
  Wechselt nach dem Speichern zum nächsten Schritt.
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

  /*
    Speichert den aktuell eingegebenen Freitext,
    bevor er in die zentrale Symptomliste übernommen wird.
  */
  const [currentText, setCurrentText] = useState("");

  /*
    Speichert die optionale Schmerzstärke.

    Der Wert kommt vom Range-Input als String,
    kann aber fachlich als Zahl verstanden werden.
  */
  const [painscale, setPainscale] = useState<string | number>();

  /*
    Steuert, ob die zusätzliche Schmerzskala eingeblendet wird.
  */
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

        {/* Optionale Einordnung, ob die freie Beschwerde Schmerzen enthält */}
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
          /*
            Schmerzskala nur anzeigen, wenn der Freitext
            als Schmerzsymptom markiert wurde.
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

        {/* Speichert den Freitext mit Region und optionaler Schmerzstärke */}
        <button
          type="button"
          className={assessmentStyles.primaryButton}
          onClick={() => {
            /*
              Der Freitext wird als JSON-ähnlicher String gespeichert,
              weil CheckInfo, ResultStep und Datenverwaltung diese Struktur
              später wieder auslesen.
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
