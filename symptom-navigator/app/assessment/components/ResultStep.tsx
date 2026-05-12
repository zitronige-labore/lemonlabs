/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

import type {
  AdditionalData,
  BasisData,
  InputMode,
  MainRegion,
  SubRegion,
} from "../../types/assessment";

type ResultStepProps = {
  basisData: BasisData;
  additionalData: AdditionalData;

  selectedMainRegion: MainRegion | null;
  selectedSubRegion: SubRegion | null;

  inputMode: InputMode;

  symptomText: string[];
  selectedSymptoms: string[];
  aiAnswer: any;

  onGoHome: () => void;
};

export function ResultStep({
  basisData,
  additionalData,
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
      <p className={assessmentStyles.selectedText}>
        Ihre Angaben wurden erfasst.
      </p>

      <p>
        Alter: <strong>{basisData.age}</strong>
      </p>

      <p>
        Geschlecht: <strong>{basisData.gender}</strong>
      </p>

      {basisData.gender === "weiblich" && (
        <p>
          Schwangerschaft oder Stillzeit:{" "}
          <strong>{basisData.pregnancy}</strong>
        </p>
      )}

      <p>
        Hauptregion: <strong>{selectedMainRegion}</strong>
      </p>

      <p>
        Unterregion: <strong>{selectedSubRegion}</strong>
      </p>

      {inputMode === "text" && (
        <p>
          Beschreibung: <strong>{symptomText}</strong>
        </p>
      )}

      {inputMode === "select" && (
        <p>
          Symptome: <strong>{selectedSymptoms.join(", ")}</strong>
        </p>
      )}

      <p>
        Dauer: <strong>{basisData.duration}</strong>
      </p>

      <p>
        Stärke: <strong>{basisData.intensity}</strong>
      </p>

      {aiAnswer?.assessment?.urgency && (
        <>
          <p>
            Dringlichkeitsstufe: {aiAnswer.assessment.urgency}:{" "}
            {aiAnswer.assessment.urgencyText}
          </p>

          <p>Handlungsempfehlung: {aiAnswer.assessment.nextSteps}</p>
        </>
      )}

      {!aiAnswer?.assessment?.urgency && (
        <p>Die Auswertung lädt noch...</p>
      )}

      <hr />

      <p className={assessmentStyles.selectedText}>Zusatzangaben</p>

      <p>
        Medikamente:{" "}
        <strong>{additionalData.medications || "Keine Angabe"}</strong>
      </p>

      <p>
        Vorerkrankungen:{" "}
        <strong>
          {additionalData.conditions.length > 0
            ? additionalData.conditions
            : "Keine Angabe"}
        </strong>
      </p>

      <p>
        Allergien: <strong>{additionalData.allergies || "Keine Angabe"}</strong>
      </p>

      <p>
        Fieber: <strong>{additionalData.temperature || "Keine Angabe"}</strong>
      </p>

      <p>
        Beschwerden werden stärker:{" "}
        <strong>{additionalData.worsening || "Keine Angabe"}</strong>
      </p>

      <p>
        Weitere Informationen:{" "}
        <strong>{additionalData.extraInfo || "Keine Angabe"}</strong>
      </p>

      {/* Zurück zur Startseite */}
      <hr />

      <p className={assessmentStyles.selectedText}>Zusatzangaben</p>

      <p>
        Medikamente:{" "}
        <strong>{additionalData.medications || "Keine Angabe"}</strong>
      </p>

      <p>
        Vorerkrankungen:{" "}
        <strong>
          {additionalData.conditions.length > 0
            ? additionalData.conditions
            : "Keine Angabe"}
        </strong>
      </p>

      <p>
        Allergien: <strong>{additionalData.allergies || "Keine Angabe"}</strong>
      </p>

      <p>
        Fieber: <strong>{additionalData.temperature || "Keine Angabe"}</strong>
      </p>

      <p>
        Beschwerden werden stärker:{" "}
        <strong>{additionalData.worsening || "Keine Angabe"}</strong>
      </p>

      <p>
        Weitere Informationen:{" "}
        <strong>{additionalData.extraInfo || "Keine Angabe"}</strong>
      </p>


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