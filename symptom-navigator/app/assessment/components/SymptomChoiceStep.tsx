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
  Eigenschaften der SymptomChoiceStep-Komponente.

  selectedSubRegion:
  Aktuell ausgewählte Unterregion

  setInputMode:
  Funktion zum Festlegen der Eingabeart

  onContinue:
  Funktion zum Wechseln zum nächsten Schritt
*/
type SymptomChoiceStepProps = {
  selectedSubRegion: SubRegion | null;

  setInputMode: (mode: InputMode) => void;

  onContinue: () => void;
};

/*
  Dieser Schritt ermöglicht die Auswahl,
  wie Beschwerden angegeben werden sollen.

  Zur Auswahl stehen:
  - Freitextbeschreibung
  - Auswahl typischer Symptome
*/
export function SymptomChoiceStep({
  selectedSubRegion,
  setInputMode,
  onContinue,
}: SymptomChoiceStepProps) {
  return (
    <>
      {/* Anzeige der ausgewählten Unterregion */}
      <p className={assessmentStyles.text}>
        Ausgewählte Region:{" "}
        <strong>{selectedSubRegion}</strong>
      </p>

      {/* Auswahlbereich für die Eingabeart */}
      <fieldset className={assessmentStyles.fieldset}>
        <legend className={assessmentStyles.legend}>
          Wie möchten Sie Ihre Beschwerden angeben?
        </legend>

        <div className={assessmentStyles.quickSelect}>
          {/* Auswahl: Freitext */}
          <button
            type="button"
            className={assessmentStyles.regionButton}

            onClick={() => {
              /*
                Setzt die Eingabeart auf Freitext.
              */
              setInputMode("text");

              /*
                Wechselt zum nächsten Schritt.
              */
              onContinue();
            }}
          >
            Freitext eingeben
          </button>

          {/* Auswahl: Symptomauswahl */}
          <button
            type="button"
            className={assessmentStyles.regionButton}

            onClick={() => {
              /*
                Setzt die Eingabeart
                auf Symptomauswahl.
              */
              setInputMode("select");

              /*
                Wechselt zum nächsten Schritt.
              */
              onContinue();
            }}
          >
            Symptome auswählen
          </button>
        </div>
      </fieldset>
    </>
  );
}