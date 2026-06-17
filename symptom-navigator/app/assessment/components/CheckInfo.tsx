import { useState } from "react";

/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

import type {
  AdditionalData,
  BasisData,
  Step,
  MedicationEntry
} from "../../types/assessment";

type SavedAssessmentData = {
  basisData?: BasisData;
  additionalData?: AdditionalData;
  symptomText?: string[];
  selectedSymptoms?: string[];
};

type CheckInfoProps = {
  basisData: BasisData;
  additionalData: AdditionalData;

  symptomText: string[];
  selectedSymptoms: string[];

  setStep: (step: Step) => void;
  removeSymptomText: (symptom: string) => void;
  toggleSymptom: (symptom: string) => void;
  setCheckInfoActive: (active: boolean) => void;
  isOffline: boolean;
};

export function CheckInfo({
  basisData,
  additionalData,
  symptomText,
  selectedSymptoms,
  setStep,
  removeSymptomText,
  toggleSymptom,
  setCheckInfoActive,
  isOffline,
}: CheckInfoProps) {
  const [showSavedData, setShowSavedData] = useState(false);

  /*
    Bevorzugt werden die strukturierten Daten aus der Datenbank.
    Falls diese noch nicht vorhanden sind, nutzt die ResultPage weiterhin
    die bisherigen Props aus dem lokalen State.
  */


  const medicationValue =
    additionalData.medication ||
    "Keine Angabe";

  const conditionsValue =
    additionalData.conditions &&
      additionalData.conditions.length > 0
      ? additionalData.conditions
      : "Keine Angabe";

  

  const symptomTextValue =
    symptomText && symptomText.length > 0 ?
      (
        <ul>
          {symptomText.map((s, i) => {
            try {
              const parsed = JSON.parse(s);
              return (
                <li key={i} className={assessmentStyles.fieldset}>
                  Bezeichnung: {parsed.text_symptom} <br></br>
                  {parsed.bodyregion && <> Körperregion: {parsed.bodyregion}</>}<br></br>
                  {parsed.painscale != null && <> Schmerzstärke: {parsed.painscale}</>}
                  <button
                    type="button"
                    className={assessmentStyles.secondaryButton}
                    onClick={() => {
                      removeSymptomText(s);

                    }}
                  >
                    Eintrag entfernen
                  </button>
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
    selectedSymptoms && selectedSymptoms.length > 0 ?
      (
        <ul>
          {selectedSymptoms.map((s, i) => {
            try {
              const parsed = JSON.parse(s);
              return (
                <li key={i} className={assessmentStyles.fieldset}>
                  Bezeichnung: {parsed.name} <br></br>
                  {parsed.bodyregion && <> Körperregion: {parsed.bodyregion}</>}<br></br>
                  {parsed.painscale != null && <> Schmerzstärke: {parsed.painscale}</>}
                  <button
                    type="button"
                    className={assessmentStyles.secondaryButton}
                    onClick={() => {
                      toggleSymptom(s);
                    }}
                  >
                    Symptom entfernen
                  </button>
                </li>
              );
            } catch {
              return <li key={i}>{s}</li>;
            }
          })}
        </ul>
      )
      : "Keine Angabe";

      
      return (
      <>
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
            color: "#111111",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <p>
            Alter: <strong>{basisData.age || "Keine Angabe"}</strong>
          </p>

          <p>
            Geschlecht:{" "}
            <strong>{basisData.gender || "Keine Angabe"}</strong>
          </p>

          {basisData.gender === "weiblich" || basisData.gender === "divers" && (
          <>
            <p>
              Schwangerschaft:{" "}
              <strong>
                {basisData.pregnancy || "Keine Angabe"}
              </strong>
            </p>

          </>
          )}

          <button
              type="button"
              className={assessmentStyles.secondaryButton}
              onClick={() => {
                setStep("basisStart");
                setCheckInfoActive(true);
              }}
            >
              Basisdaten bearbeiten
          </button>

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

          <button
              type="button"
              className={assessmentStyles.secondaryButton}
              onClick={() => {
                setStep("bodyRegion");
                setCheckInfoActive(true);
              }}
            >
              weitere Symptome angeben
          </button>


          <hr style={{ margin: "16px 0", borderColor: "#e5e7eb" }} />

          <p className={assessmentStyles.selectedText}>Zusatzangaben</p>


          <p>
            Größe:{" "}
            <strong>
              {additionalData.height || "Keine Angabe"}
            </strong>
          </p>

          <p>
            Gewicht:{" "}
            <strong>
              {additionalData.weight || "Keine Angabe"}
            </strong>
          </p>

          <p>
            Beschwerden bestehen seit (in Tagen):{" "}
            <strong>
              {additionalData.duration || "Keine Angabe"}
            </strong>
          </p>

          {basisData.gender !== "männlich" && (
          
          <p>
            Stillzeit:{" "}
            <strong>
              {additionalData.breastfeeding || "Keine Angabe"}
            </strong>
          </p>
          )}

          <p>
            Medikamente:
          </p>


          {additionalData.medication && additionalData.medication.length > 0 ? (
          <ul>
            {additionalData.medication.map((m, i) => (
              <li key={i}>
                <strong>{m.name} - {m.frequencyPerDay} pro Tag - seit {m.since} </strong>
              </li>
            ))}
          </ul>
        ) : (
          <strong>Keine Angabe</strong>
        )}

          <p>
            Vorerkrankungen: <strong>{conditionsValue}</strong>
          </p>

          <p>
            Allergien:{" "}
            <strong>
              {additionalData.allergies || "Keine Angabe"}
            </strong>
          </p>

          <p>
            Alkoholische Getraenke pro Woche:{" "}
            <strong>
              {additionalData.alcoholPerWeek || "Keine Angabe"}
            </strong>
          </p>

          <p>
            Zigaretten pro Tag:{" "}
            <strong>
              {additionalData.cigarettesPerDay || "Keine Angabe"}
            </strong>
          </p>

          <p>
            Temperatur:{" "}
            <strong>
              {additionalData.temperature || "Keine Angabe"}
            </strong>
          </p>

          <p>
            Beschwerden werden stärker:{" "}
            <strong>
              {additionalData.worsening || "Keine Angabe"}
            </strong>
          </p>

          <p>
            Weitere Informationen:{" "}
            <strong>
              {additionalData.extraInfo || "Keine Angabe"}
            </strong>
          </p>

          <button
              type="button"
              className={assessmentStyles.secondaryButton}
              onClick={() => {
                setStep("additionalInfo");
                setCheckInfoActive(true);
              }}
            >
              Zusatzangaben bearbeiten
          </button>
        </div>
      )}

      {!isOffline && (
        <button
          type="submit"
          className={assessmentStyles.primaryButton}
        >
          Einschätzung abschließen
        </button>
      )}
      {isOffline && (
        <p>
          Im Offline-Modus können keine Daten bearbeitet werden. Sobald eine Internetverbindung besteht, ist das Vortsetzen möglich.
        </p>
      )}
    </>
    );
}