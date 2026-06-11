import { useState, useEffect } from "react";

/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

// import to show access code
import { getAccessCode, getAiDataFromDB, getUserDataFromDB } from "../../actions";
import { makeDBDataReadable } from "../utils/assessmentData";
import { downloadTxt, downloadPdf, type AssessmentExportData } from "../utils/exportUtils";

import type {
  AdditionalData,
  BasisData,
  MainRegion,
  SubRegion,
} from "../../types/assessment";


type SavedAssessmentData = {
  basisData?: BasisData;
  additionalData?: AdditionalData;
  caseId?:string;
  selectedMainRegion?: MainRegion | null;
  selectedSubRegion?: SubRegion | null;
  symptomText?: string[];
  selectedSymptoms?: string[];
};

type ResultStepProps = {
  basisData: BasisData;
  additionalData: AdditionalData;

  selectedMainRegion: MainRegion | null;
  selectedSubRegion: SubRegion | null;

  caseId:string;
  symptomText: string[];
  selectedSymptoms: string[];
  aiAnswer: any;

  /*
    Optional:
    Hier können später die strukturierten Werte aus der Datenbank übergeben werden,
    z. B. aus der neuen Actions-Funktion von Franziska.
    Wenn keine DB-Daten vorhanden sind, werden die bisherigen Props verwendet.
  */
  savedAssessmentData?: SavedAssessmentData;

  onGoHome: () => void;
};


export async function ResultStep({
  basisData,
  additionalData,
  selectedMainRegion,
  selectedSubRegion,
  symptomText,
  selectedSymptoms,
  aiAnswer,
  caseId,
  savedAssessmentData,
  onGoHome,
}: ResultStepProps) {

  const [showSavedData, setShowSavedData] = useState(false);
  const [showAiReasoning, setShowAiReasoning] = useState(false);
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);


  const displayedBasisData = savedAssessmentData?.basisData ?? basisData;
  const displayedAdditionalData =
    savedAssessmentData?.additionalData ?? additionalData;
  
  const displayedSymptomText = savedAssessmentData?.symptomText ?? symptomText;
  const displayedSelectedSymptoms =
    savedAssessmentData?.selectedSymptoms ?? selectedSymptoms;

  console.log("aiAnswer in ResultStep:", aiAnswer);

  const suspicions = aiAnswer?.assessment?.suspicions;
  const urgency = Number(aiAnswer?.assessment?.urgency);

  const medicationValue =
    displayedAdditionalData.medication ||
    "Keine Angabe";

  const conditionsValue =
    displayedAdditionalData.conditions &&
      displayedAdditionalData.conditions.length > 0
      ? displayedAdditionalData.conditions
      : "Keine Angabe";


  // build export files
  function buildExportData(): AssessmentExportData {
    return {
      alter: displayedBasisData.age || "Keine Angabe",
      geschlecht: displayedBasisData.gender || "Keine Angabe",
      schwangerschaft: displayedBasisData.pregnancy || "Keine Angabe",
      stillzeit: displayedAdditionalData.breastfeeding || "Keine Angabe",
      worsening: displayedAdditionalData.worsening || undefined,
      groesse: displayedAdditionalData.height ? `${displayedAdditionalData.height} cm` : "Keine Angabe",
      gewicht: displayedAdditionalData.weight ? `${displayedAdditionalData.weight} kg` : "Keine Angabe",
      temperatur: displayedAdditionalData.temperature || "Keine Angabe",
      dauer: displayedAdditionalData.duration || "Keine Angabe",
      medikation: displayedAdditionalData.medication || "Keine Angabe",
      allergien: displayedAdditionalData.allergies || "Keine Angabe",
      vorerkrankungen: displayedAdditionalData.conditions || "Keine Angabe",
      symptome: displayedSelectedSymptoms.length > 0
        ? displayedSelectedSymptoms.map(s => { try { return JSON.parse(s).name; } catch { return s; } }).join(", ")
        : "",
      textSymptome: displayedSymptomText.length > 0
        ? displayedSymptomText.map(s => { try { return JSON.parse(s).text_symptom; } catch { return s; } }).join(", ")
        : "",
      datum: new Date().toLocaleString(),
      dringlichkeit: aiAnswer?.assessment?.urgency?.toString() || "Keine Angabe",
      handlungsempfehlung: aiAnswer?.assessment?.nextSteps || "Keine Angabe",
      vermutungen: suspicions
        ? [1,2,3,4,5].map(i => {
            const s = suspicions[`suspicion${i}`];
            if (!s) return null;
            const reasonKey = Object.keys(s).find(k => k.toLowerCase().includes("reason"));
            const probKey = Object.keys(s).find(k => k.toLowerCase().includes("probability"));
            return {
              text: reasonKey ? s[reasonKey] : "Keine Angabe",
              wahrscheinlichkeit: probKey && s[probKey] ? `${s[probKey]}` : "Keine Angabe",
            };
          }).filter(Boolean) as AssessmentExportData["vermutungen"]
        : [],
    };
  }


  useEffect(() => {
    if (caseId) {
      getAccessCode(caseId).then(setAccessCode);
    }
  }, [caseId]);


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

  const doctorsSearchUrl =
    "https://www.google.com/maps/search/%C3%84rzte+in+der+Umgebung";

  const emergencyRoomsSearchUrl =
    "https://www.google.com/maps/search/Notaufnahme+in+der+Umgebung";

  const renderSuspicions = () => {
    if (!suspicions) return null;

    return Object.entries(suspicions).map(([key, value]: [string, any]) => {
      if (typeof value === "object" && value !== null) {
        const reasonKey = Object.keys(value).find((k) =>
          k.toLowerCase().includes("reason")
        );

        const probKey = Object.keys(value).find((k) =>
          k.toLowerCase().includes("probability")
        );

        const reason = reasonKey ? value[reasonKey] : "";
        const prob = probKey ? value[probKey] : "";
        const name = value._ || "";

        return (
          <div
            key={key}
            style={{
              marginBottom: "12px",
              padding: "12px",
              background: "#f1f5f9",
              borderRadius: "8px",
              fontSize: "0.95rem",
              textAlign: "left",
            }}
          >
            <strong style={{ color: "var(--primary)" }}>
              {key.replace("suspicion", "Vermutung ")}:
            </strong>{" "}
            {name}

            {prob && (
              <div style={{ marginTop: "4px" }}>
                <strong>Wahrscheinlichkeit:</strong> {prob}
              </div>
            )}

            {reason && <div style={{ marginTop: "4px" }}>{reason}</div>}
          </div>
        );
      }

      return null;
    });
  };

  const renderUrgencyAction = () => {
    if (!urgency) return null;

    if (urgency === 2 || urgency === 3) {
      return (
        <a
          href={doctorsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={assessmentStyles.continueButton}
          style={{
            display: "inline-block",
            textDecoration: "none",
            marginTop: "12px",
          }}
        >
          Ärzte in der Umgebung finden
        </a>
      );
    }

    if (urgency === 4) {
      return (
        <a
          href={emergencyRoomsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={assessmentStyles.continueButton}
          style={{
            display: "inline-block",
            textDecoration: "none",
            marginTop: "12px",
          }}
        >
          Notaufnahmen finden
        </a>
      );
    }

    if (urgency >= 5) {
      return (
        <button
          type="button"
          className={assessmentStyles.continueButton}
          onClick={() => setShowEmergencyPopup(true)}
          style={{ marginTop: "12px" }}
        >
          Notfallhinweis anzeigen
        </button>
      );
    }

    return null;
  };

  return (
    <div className={assessmentStyles.resultBox}>

      
      {aiAnswer?.assessment?.urgency ? (
        <div style={{ width: "100%", marginTop: "10px" }}>
          <div
            style={{
              padding: "16px",
              background: "#eff6ff",
              borderRadius: "12px",
              border: "1px solid #bfdbfe",
              marginBottom: "16px",
            }}
          >
            <p style={{ margin: "0 0 10px 0", fontSize: "1.1rem" }}>
              Dringlichkeitsstufe:{" "}
              <strong>{aiAnswer.assessment.urgency}</strong>:{" "}
              {aiAnswer.assessment.urgencyText}
            </p>

            <p style={{ margin: 0, fontWeight: "bold" }}>
              Handlungsempfehlung:{" "}
              <span style={{ fontWeight: "normal" }}>
                {aiAnswer.assessment.nextSteps}
              </span>
            </p>

            {renderUrgencyAction()}
          </div>
        </div>
      ) : (
        <p>Die KI Auswertung ist fehlgeschlagen</p>
      )}

      <button
        type="button"
        className={assessmentStyles.secondaryButton}
        onClick={() => setShowAiReasoning(!showAiReasoning)}
        style={{ marginBottom: "16px" }}
      >
        {showAiReasoning
          ? "KI-Begründung ausblenden"
          : "KI-Begründung anzeigen"}
      </button>
      {showAiReasoning && (
        <div style={{ width: "100%", marginBottom: "16px" }}>
          {suspicions ? (
            renderSuspicions()
          ) : (
            <div
              style={{
                marginBottom: "12px",
                padding: "12px",
                background: "#f1f5f9",
                borderRadius: "8px",
                fontSize: "0.95rem",
                textAlign: "left",
              }}
            >
              <strong style={{ color: "var(--primary)" }}>
                Platzhalter-Begründung:
              </strong>
              <br />
              Da derzeit keine Verbindung zur KI besteht oder die Auswertung
              noch lädt, sehen Sie hier diesen Platzhalter.
            </div>
          )}
        </div>
      )}


      {accessCode && (
        <div
          style={{
            padding: "16px",
            background: "#eff6ff",
            borderRadius: "12px",
            border: "1px solid #bfdbfe",
            marginBottom: "16px",
            width: "100%",
            textAlign: "left",
          }}
        >
          <p style={{ margin: "0 0 6px 0", fontSize: "1rem" }}>
            Ihr persönlicher Zugangscode:
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: "500",
              color: "var(--primary)",
              letterSpacing: "0.15em",
            }}
          >
            {accessCode}
          </p>
          <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#64748b" }}>
            Mit diesem Code können Sie Ihre Daten später wieder abrufen.
          </p>
        </div>
      )}


      <p className={assessmentStyles.selectedText}>
        Ihre Angaben wurden erfasst.
      </p>

      <button
        type="button"
        className={assessmentStyles.secondaryButton}
        onClick={() => setShowSavedData(!showSavedData)}
        style={{ marginBottom: "16px" }}
      >
        {showSavedData
          ? "Gespeicherte Daten ausblenden"
          : "Gespeicherte Daten anzeigen"}
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

          <div className={assessmentStyles.buttonGroup}>
            <button
              type="button"
              className={assessmentStyles.secondaryButton}
              onClick={() => downloadPdf(buildExportData())}
            >
              pdf herunterladen
            </button>
            <button
              type="button"
              className={assessmentStyles.secondaryButton}
              onClick={() => downloadTxt(buildExportData())}
            >
              txt herunterladen
            </button>
          </div>


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


      {showEmergencyPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "440px",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.25)",
              textAlign: "left",
            }}
          >
            <h2 style={{ marginTop: 0, color: "#b91c1c" }}>
              Möglicher Notfall
            </h2>

            <p>
              Die Angaben deuten auf eine sehr hohe Dringlichkeit hin. Bei
              akuten oder lebensbedrohlichen Beschwerden sollte sofort der
              Notruf kontaktiert werden.
            </p>

            <a
              href="tel:112"
              className={assessmentStyles.continueButton}
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                marginTop: "16px",
              }}
            >
              112 anrufen
            </a>

            <button
              type="button"
              className={assessmentStyles.secondaryButton}
              onClick={() => setShowEmergencyPopup(false)}
              style={{ width: "100%", marginTop: "12px" }}
            >
              Schließen
            </button>
          </div>
        </div>
      )}

      <hr style={{ width: "100%", margin: "24px 0", borderColor: "#d1d5db" }} />

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
