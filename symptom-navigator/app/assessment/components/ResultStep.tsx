import { useState } from "react";
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
  const [showSavedData, setShowSavedData] = useState(false);
  const [showAiReasoning, setShowAiReasoning] = useState(false);

  // test log
  console.log("aiAnswer in ResultStep:", aiAnswer);

  const suspicions = aiAnswer?.assessment?.suspicions;

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
            <strong style={{ color: "#1e3a8a" }}>
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

  return (
    <div className={assessmentStyles.resultBox}>
      <p className={assessmentStyles.selectedText}>
        Ihre Angaben wurden erfasst.
      </p>

      {/* Button zum Anzeigen der gespeicherten Daten */}
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

      {/* Gespeicherte Daten Container */}
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

          <hr style={{ margin: "16px 0", borderColor: "#e5e7eb" }} />

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
            Allergien:{" "}
            <strong>{additionalData.allergies || "Keine Angabe"}</strong>
          </p>

          <p>
            Fieber:{" "}
            <strong>{additionalData.temperature || "Keine Angabe"}</strong>
          </p>

          <p>
            Beschwerden werden stärker:{" "}
            <strong>{additionalData.worsening || "Keine Angabe"}</strong>
          </p>

          <p>
            Weitere Informationen:{" "}
            <strong>{additionalData.extraInfo || "Keine Angabe"}</strong>
          </p>
        </div>
      )}

      {/* Button zum Anzeigen der KI-Begründung */}
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

      {/* KI-Begründung Container */}
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
              <strong style={{ color: "#1e3a8a" }}>
                Platzhalter-Begründung:
              </strong>{" "}
              <br />
              Da derzeit keine Verbindung zur KI besteht (oder die Auswertung noch lädt), sehen Sie hier diesen Platzhalter. Später werden an dieser Stelle die medizinischen Ursachen und Erklärungen der KI aufgelistet.
            </div>
          )}
        </div>
      )}

      {/* KI-Ergebnisse (Dringlichkeit & Empfehlung) */}
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
          </div>
        </div>
      ) : (
        <p>Die Auswertung lädt noch...</p>
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