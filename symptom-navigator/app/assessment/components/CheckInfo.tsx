import { useState } from "react";

/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

import type {
  AdditionalData,
  BasisData,
  MainRegion,
  SubRegion,
} from "../../types/assessment";

type SavedAssessmentData = {
  basisData?: BasisData;
  additionalData?: AdditionalData;
  selectedMainRegion?: MainRegion | null;
  selectedSubRegion?: SubRegion | null;
  symptomText?: string[];
  selectedSymptoms?: string[];
};

type CheckInfoProps = {
  basisData: BasisData;
  additionalData: AdditionalData;

  selectedMainRegion: MainRegion | null;
  selectedSubRegion: SubRegion | null;


  symptomText: string[];
  selectedSymptoms: string[];

  onGoHome: () => void;
};

export function CheckInfo({
  basisData,
  additionalData,
  selectedMainRegion,
  selectedSubRegion,
  symptomText,
  selectedSymptoms,
}: CheckInfoProps) {
  const [showSavedData, setShowSavedData] = useState(false);

  /*
    Bevorzugt werden die strukturierten Daten aus der Datenbank.
    Falls diese noch nicht vorhanden sind, nutzt die ResultPage weiterhin
    die bisherigen Props aus dem lokalen State.
  */
  const displayedBasisData = basisData;
  const displayedAdditionalData = additionalData;
  const displayedSymptomText = symptomText;
  const displayedSelectedSymptoms = selectedSymptoms;


  const medicationValue =
    displayedAdditionalData.medication ||
    "Keine Angabe";

  const conditionsValue =
    displayedAdditionalData.conditions &&
      displayedAdditionalData.conditions.length > 0
      ? displayedAdditionalData.conditions
      : "Keine Angabe";

  const symptomTextValue =
    displayedSymptomText && displayedSymptomText.length > 0 ?
      (
        <ul>
          {displayedSymptomText.map((s, i) => {
            try {
              const parsed = JSON.parse(s);
              return (
                <li key={i} className={assessmentStyles.fieldset}>
                  Bezeichnung: {parsed.text_symptom} <br></br>
                  {parsed.bodyregion && <> Körperregion: {parsed.bodyregion}</>}<br></br>
                  {parsed.painscale != null && <> Schmerzstärke: {parsed.painscale}</>}
                </li>
              );
            } catch {
              return <li key={i}>{s}</li>;
            }
          })}
        </ul>
      )
      : "Keine Angabe";

  const selectedSymptomsValue =
    displayedSelectedSymptoms && displayedSelectedSymptoms.length > 0 ?
      (
        <ul>
          {displayedSelectedSymptoms.map((s, i) => {
            try {
              const parsed = JSON.parse(s);
              return (
                <li key={i} className={assessmentStyles.fieldset}>
                  Bezeichnung: {parsed.name} <br></br>
                  {parsed.bodyregion && <> Körperregion: {parsed.bodyregion}</>}<br></br>
                  {parsed.painscale != null && <> Schmerzstärke: {parsed.painscale}</>}
                </li>
              );
            } catch {
              return <li key={i}>{s}</li>;
            }
          })}
        </ul>
      )
      : "Keine Angabe";


      <button
        type="button"
        className={assessmentStyles.secondaryButton}
        onClick={() => setShowSavedData(!showSavedData)}
        style={{ marginBottom: "16px" }}
      >
        {showSavedData
          ? "Daten ausblenden"
          : "Daten zur Überprüfung anzeigen"}
      </button>

      {showSavedData && (
        <div
          style={{
            textAlign: "left",
            width: "100%",
            background: "#ffffff",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <p>
            Alter: <strong>{displayedBasisData.age || "Keine Angabe"}</strong>
          </p>

          <p>
            Geschlecht:{" "}
            <strong>{displayedBasisData.gender || "Keine Angabe"}</strong>
          </p>

          {displayedBasisData.gender === "weiblich" && (
            <p>
              Schwangerschaft oder Stillzeit:{" "}
              <strong>
                {displayedBasisData.pregnancy || "Keine Angabe"}
              </strong>
            </p>
          )}

          {/*
          <p>
            Hauptregion:{" "}
            <strong>{displayedMainRegion || "Keine Angabe"}</strong>
          </p>

          <p>
            Unterregion:{" "}
            <strong>{displayedSubRegion || "Keine Angabe"}</strong>
          </p>
          */}


          <p>
            Beschwerden selbst geschrieben: 
          </p>
          <strong>{symptomTextValue}</strong>

          <p>
            Symptome:
          </p>
          <strong>{selectedSymptomsValue}</strong>


          <hr style={{ margin: "16px 0", borderColor: "#e5e7eb" }} />

          <p className={assessmentStyles.selectedText}>Zusatzangaben</p>

          <p>
            Medikamente: <strong>{medicationValue}</strong>
          </p>

          <p>
            Vorerkrankungen: <strong>{conditionsValue}</strong>
          </p>

          <p>
            Allergien:{" "}
            <strong>
              {displayedAdditionalData.allergies || "Keine Angabe"}
            </strong>
          </p>

          <p>
            Fieber:{" "}
            <strong>
              {displayedAdditionalData.temperature || "Keine Angabe"}
            </strong>
          </p>

          <p>
            Beschwerden werden stärker:{" "}
            <strong>
              {displayedAdditionalData.worsening || "Keine Angabe"}
            </strong>
          </p>

          <p>
            Weitere Informationen:{" "}
            <strong>
              {displayedAdditionalData.extraInfo || "Keine Angabe"}
            </strong>
          </p>
        </div>
      )}






      <button
          type="submit"
          className={assessmentStyles.primaryButton}
        >
          Einschätzung abschließen
      </button>
    
}