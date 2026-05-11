/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

/*
  Import der benötigten Typdefinitionen.

  BasisData:
  Allgemeine Angaben und Beschwerdedaten

  InputMode:
  Art der Symptomeingabe

  MainRegion:
  Ausgewählte Hauptregion der Körperkarte

  SubRegion:
  Ausgewählte Unterregion der Körperkarte
*/
import type {
  BasisData,
  InputMode,
  MainRegion,
  SubRegion,
} from "../../types/assessment";

/*
  Eigenschaften der ResultStep-Komponente.

  basisData:
  Allgemeine Angaben und Beschwerdedaten

  selectedMainRegion:
  Gewählte Hauptregion

  selectedSubRegion:
  Gewählte Unterregion

  inputMode:
  Art der Symptomeingabe

  symptomText:
  Freitextbeschreibung der Beschwerden

  selectedSymptoms:
  Liste ausgewählter Symptome

  onGoHome:
  Funktion zum Zurückkehren zur Startseite
*/
type ResultStepProps = {
  basisData: BasisData;

  selectedMainRegion: MainRegion | null;
  selectedSubRegion: SubRegion | null;

  inputMode: InputMode;

  symptomText: string;
  selectedSymptoms: string[];
  aiAnswer: any;

  onGoHome: () => void;
};

/*
  Dieser Schritt zeigt eine Zusammenfassung
  aller eingegebenen Informationen an.

  Die Angaben dienen aktuell nur
  der Übersicht und werden noch nicht
  an ein Backend übertragen.
*/
export function ResultStep({
  basisData,
  selectedMainRegion,
  selectedSubRegion,
  inputMode,
  symptomText,
  selectedSymptoms,
  aiAnswer,
  onGoHome,
}: ResultStepProps) {

  // test log
  console.log("aiAnswer in ResultStep:", aiAnswer);

  return (
    <div className={assessmentStyles.resultBox}>
      {/* Hinweis auf erfolgreich erfasste Angaben */}
      <p className={assessmentStyles.selectedText}>
        Ihre Angaben wurden erfasst.
      </p>

      {/* Alter */}
      <p>
        Alter: <strong>{basisData.age}</strong>
      </p>

      {/* Geschlecht */}
      <p>
        Geschlecht: <strong>{basisData.gender}</strong>
      </p>

      {/*
        Schwangerschaft oder Stillzeit
        wird nur angezeigt,
        wenn "weiblich" ausgewählt wurde.
      */}
      {basisData.gender === "weiblich" && (
        <p>
          Schwangerschaft oder Stillzeit:{" "}
          <strong>{basisData.pregnancy}</strong>
        </p>
      )}

      {/* Ausgewählte Hauptregion */}
      <p>
        Hauptregion: <strong>{selectedMainRegion}</strong>
      </p>

      {/* Ausgewählte Unterregion */}
      <p>
        Unterregion: <strong>{selectedSubRegion}</strong>
      </p>

      {/*
        Anzeige der Freitextbeschreibung,
        falls Freitext als Eingabeart gewählt wurde.
      */}
      {inputMode === "text" && (
        <p>
          Beschreibung: <strong>{symptomText}</strong>
        </p>
      )}

      {/*
        Anzeige der ausgewählten Symptome,
        falls die Symptomauswahl verwendet wurde.
      */}
      {inputMode === "select" && (
        <p>
          Symptome:{" "}
          <strong>{selectedSymptoms.join(", ")}</strong>
        </p>
      )}

      {/* Dauer der Beschwerden */}
      <p>
        Dauer: <strong>{basisData.duration}</strong>
      </p>

      {/* Schmerzintensität */}
      <p>
        Stärke: <strong>{basisData.intensity}</strong>
      </p>

      {aiAnswer?.assessment?.urgency && (
      <>
        <p>
          Dringlichkeitsstufe: {aiAnswer.assessment.urgency}: 
          {aiAnswer.assessment.urgencyText} 
        </p>

        <p>
          Handlungsempfehlung: {aiAnswer.assessment.nextSteps} 
        </p>
        </>
        )}

        {!aiAnswer?.assessment?.urgency && (
        <>
        <p>
          Die Auswertung laedt noch...
        </p>
      </>
      )}

      {/* Zurück zur Startseite */}
      <button
        type="button"
        className={assessmentStyles.continueButton}
        onClick={onGoHome}
      >
        Zur Startseite
      </button>
    </div>
  );
}