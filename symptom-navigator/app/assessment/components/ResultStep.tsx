/*
  Final screen of the assessment.

  It presents the AI assessment together with the collected case data,
  provides appropriate next steps, and allows users to export their data
  or access it later using their personal access code.
*/
import { useEffect, useState } from "react";

/* Shared styles for result sections, data tables, and action buttons. */
import assessmentStyles from "../Assessment.module.css";
import homeStyles from "../../Home.module.css";

/* Retrieves the access code associated with the saved case from the server. */
import { getAccessCode } from "../../actions";
/* Generates downloadable TXT and PDF files in the browser. */
import { downloadTxt, downloadPdf } from "../utils/exportUtils";

/* Data models from the previous assessment steps. */
import type {
  AdditionalData,
  BasisData,
  Step,
} from "../../types/assessment";
import {
  buildExportData,
  parseSymptomName,
  parseSymptomText
} from "../utils/resultUtils";
import { SosModal } from "./SosModal";

/*
  All result data is provided by the central workflow controller.
  This component does not modify the data. It only prepares it for
  display, export, and further user actions.
*/
type ResultStepProps = {
  basisData: BasisData;
  additionalData: AdditionalData;
  caseId: string;
  symptomText: string[];
  selectedSymptoms: string[];
  aiAnswer: any;
  onGoHome: () => void;
};

/* Displays empty values and lists consistently in the result view. */
function displayValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Keine Angabe";
  }

  if (value === null || value === undefined || value === "") {
    return "Keine Angabe";
  }

  return String(value);
}

export function ResultStep({
  basisData,
  additionalData,
  symptomText,
  selectedSymptoms,
  aiAnswer,
  caseId,
  onGoHome,
}: ResultStepProps) {
/* Controls the visibility of the optional expandable sections and the emergency notice. */
  const [showSavedData, setShowSavedData] = useState(false);
  const [showAiReasoning, setShowAiReasoning] = useState(false);
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [accessCodeCopied, setAccessCodeCopied] = useState(false);

/* Optional chaining keeps the view stable even if the AI response is incomplete. */
  const suspicions = aiAnswer?.assessment?.suspicions;
  const urgency = Number(aiAnswer?.assessment?.urgency);

  const medicationValue = additionalData.medication?.map(
    (medication) =>
      `Medikation: ${medication.name} ${medication.dose} ${medication.unit}, Einnahmen pro ${medication.frequencyUnit}: ${medication.frequency}, Seit wann: ${medication.since}`,
  );

  const conditionsValue =
    additionalData.conditions && additionalData.conditions.length > 0
      ? additionalData.conditions
      : "Keine Angabe";

/* Loads the access code as soon as a saved case is available. */
  useEffect(() => {
    if (caseId) {
      getAccessCode(caseId).then(setAccessCode);
    }
  }, [caseId]);

/* Briefly displays visual feedback after the access code has been copied. */
  const handleCopyAccessCode = async () => {
    if (!accessCode) return;

    try {
      await navigator.clipboard.writeText(accessCode);
      setAccessCodeCopied(true);
      window.setTimeout(() => setAccessCodeCopied(false), 2000);
    } catch {
      setAccessCodeCopied(false);
    }
  };

/* Renders recurring label-value pairs consistently within the data grid. */
  const renderDataRow = (
    label: string,
    value: unknown,
    wide = false,
  ) => (
    <div
      className={`${assessmentStyles.dataRow} ${wide ? assessmentStyles.dataRowWide : ""
        }`}
    >
      <span className={assessmentStyles.dataLabel}>{label}</span>
      <strong className={assessmentStyles.dataValue}>{displayValue(value)}</strong>
    </div>
  );

  /*
  Symptoms are stored as JSON strings during the assessment.
  Older or malformed entries fall back to displaying the raw text.
*/
  const renderSymptomList = (entries: string[], kind: "text" | "selected") => {
    if (!entries.length) {
      return <strong className={assessmentStyles.dataValue}>Keine Angabe</strong>;
    }

    return (
      <ul className={assessmentStyles.dataList}>
        {entries.map((entry, index) => {
          try {
            const parsed = JSON.parse(entry);
            const title =
              kind === "text"
                ? parsed.text_symptom || "Beschwerde"
                : parsed.name || "Symptom";

            return (
              <li key={index} className={assessmentStyles.dataListItem}>
                <p className={assessmentStyles.dataListItemHeader}>{title}</p>
                <div className={assessmentStyles.dataListItemGrid}>
                  {parsed.bodyregion && (
                    <div>
                      <span className={assessmentStyles.dataLabel}>
                        Körperregion
                      </span>
                      <strong className={assessmentStyles.dataValue}>
                        {parsed.bodyregion}
                      </strong>
                    </div>
                  )}
                  {parsed.painscale != null && (
                    <div>
                      <span className={assessmentStyles.dataLabel}>
                        Schmerzstärke
                      </span>
                      <strong className={assessmentStyles.dataValue}>
                        {parsed.painscale}
                      </strong>
                    </div>
                  )}
                </div>
              </li>
            );
          } catch {
            return (
              <li key={index} className={assessmentStyles.dataListItem}>
                <strong className={assessmentStyles.dataValue}>{entry}</strong>
              </li>
            );
          }
        })}
      </ul>
    );
  };

/* Formats the structured medication data as a readable list. */
  const renderMedicationList = () => {
    if (!additionalData.hasMedication || !additionalData.medication?.length) {
      return <strong className={assessmentStyles.dataValue}>Keine Angabe</strong>;
    }

    return (
      <ul className={assessmentStyles.dataList}>
        {additionalData.medication.map((medication, index) => (
          <li key={index} className={assessmentStyles.dataListItem}>
            <p className={assessmentStyles.dataListItemHeader}>
              {medication.name || "Medikament"}
            </p>
            <div className={assessmentStyles.dataListItemGrid}>
              <div>
                <span className={assessmentStyles.dataLabel}>Dosis</span>
                <strong className={assessmentStyles.dataValue}>
                  {displayValue(`${medication.dose} ${medication.unit}`.trim())}
                </strong>
              </div>
              <div>
                <span className={assessmentStyles.dataLabel}>Häufigkeit</span>
                <strong className={assessmentStyles.dataValue}>
                  {displayValue(
                    `${medication.frequency} pro ${medication.frequencyUnit}`.trim(),
                  )}
                </strong>
              </div>
              <div>
                <span className={assessmentStyles.dataLabel}>Seit</span>
                <strong className={assessmentStyles.dataValue}>
                  {displayValue(medication.since)}
                </strong>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const doctorsSearchUrl =
    "https://www.google.com/maps/search/%C3%84rzte+in+der+Umgebung";

  const emergencyRoomsSearchUrl =
    "https://www.google.com/maps/search/Notaufnahme+in+der+Umgebung";

  /*
  Maps the urgency level to an appropriate follow-up action:
  doctor search, emergency department search, or an immediate
  emergency notice.
*/
  const renderUrgencyAction = () => {
    if (!urgency) return null;

    if (urgency === 2 || urgency === 3) {
      return (
        <a
          href={doctorsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={assessmentStyles.continueButton}
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
        >
          Notaufnahmen finden
        </a>
      );
    }

    if (urgency >= 5) {
      return (
        <>
        <button
          type="button"
          className={homeStyles.emergencyButton}
          onClick={() => setShowEmergencyPopup(true)}
        >
          SOS
        </button>

        {/* Urgency level 5 requires a clearly visible emergency notice before initiating a direct emergency call. */}
        {showEmergencyPopup && (
          <SosModal
              isOpen={showEmergencyPopup}
              onClose={() => setShowEmergencyPopup(false)}
          />
        )}
        </>
      );
    }

    return null;
  };

  /*
  Reads the dynamically named AI suspicion fields.
  If no assessment is available, a placeholder explains why
  no information is displayed.
*/
  const renderSuspicions = () => {
    if (!suspicions) {
      return (
        <div className={assessmentStyles.dataListItem}>
          <p className={assessmentStyles.dataListItemHeader}>
            Platzhalter-Begründung
          </p>
          <p>
            Da derzeit keine Verbindung zur KI besteht oder die Auswertung noch
            lädt, sehen Sie hier diesen Platzhalter.
          </p>
        </div>
      );
    }

    return Object.entries(suspicions).map(([key, value]: [string, any]) => {
      if (typeof value !== "object" || value === null) return null;

      const reasonKey = Object.keys(value).find((entryKey) =>
        entryKey.toLowerCase().includes("reason"),
      );
      const probKey = Object.keys(value).find((entryKey) =>
        entryKey.toLowerCase().includes("probability"),
      );
      const reason = reasonKey ? value[reasonKey] : "";
      const probability = probKey ? value[probKey] : "";
      const name = value._ || "";

      return (
        <div key={key} className={assessmentStyles.dataListItem}>
          <p className={assessmentStyles.dataListItemHeader}>
            {key.replace("suspicion", "Vermutung ")}
          </p>
          <div className={assessmentStyles.dataListItemGrid}>
          
            {reason && (
              <div className={assessmentStyles.dataRowWide}>
                <span className={assessmentStyles.dataLabel}></span>
                <strong className={assessmentStyles.dataValue}>{reason}</strong>
              </div>
            )}
            {probability && (
              <div>
                <span className={assessmentStyles.dataLabel}>
                  Wahrscheinlichkeit
                </span>
                <strong className={assessmentStyles.dataValue}>
                  {probability * 100}%
                </strong>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  /*
  Color values for the five urgency levels.
  The visible status panels are currently selected using
  urgency-specific CSS classes.
*/
  let urgencyColor = "";
  if (urgency === 1) urgencyColor = "#6600FF";
  if (urgency === 2) urgencyColor = "#66CC00";
  if (urgency === 3) urgencyColor = "#FFFF00";
  if (urgency === 4) urgencyColor = "#FF6600";
  if (urgency === 5) urgencyColor = "#FF0000";

  return (
    <div 
    className={
      assessmentStyles.resultBox
      }>
      {/* Displays the main AI assessment with urgency-specific styling and actions. */}
      {aiAnswer?.assessment?.urgency ? (
        <div className={
          urgency === 1 ? assessmentStyles.statusPanel: 
          urgency === 2 ? assessmentStyles.statusPanel2: 
          urgency === 3 ? assessmentStyles.statusPanel3: 
          urgency === 4 ? assessmentStyles.statusPanel4: 
          urgency === 5 ? assessmentStyles.statusPanel5: 
          assessmentStyles.statusPanel

        }>
          <div className={assessmentStyles.dataHeader}>
            <div>
              <p className={assessmentStyles.dataTitle}>KI-Einschätzung</p>
              <p className={assessmentStyles.dataMetaUrgency}
              >
                Dringlichkeitsstufe {aiAnswer.assessment.urgency}:{" "}
                {aiAnswer.assessment.urgencyText}
              </p>
            </div>
          </div>
          <p>
            <strong>Handlungsempfehlung:</strong>{" "}
            {aiAnswer.assessment.nextSteps}
          </p>
          <div className={assessmentStyles.dataActions}>{renderUrgencyAction()}</div>
        </div>
      ) : (
        <p>Die KI Auswertung ist fehlgeschlagen</p>
      )}

      {/* The medical reasoning remains collapsed until the user chooses to view it. */}
      <button
        type="button"
        className={`${assessmentStyles.secondaryButton} ${assessmentStyles.dataToggleButton}`}
        onClick={() => setShowAiReasoning(!showAiReasoning)}
      >
        {showAiReasoning
          ? "KI-Begründung ausblenden"
          : "KI-Begründung anzeigen"}
      </button>

      {showAiReasoning && (
        <div className={assessmentStyles.dataPanel}>
          <div className={assessmentStyles.dataHeader}>
            <div>
              <p className={assessmentStyles.dataTitle}>KI-Begründung</p>
              <p className={assessmentStyles.dataMeta}>
                Hinweise und Vermutungen aus der Auswertung.
              </p>
            </div>
          </div>
          <div className={assessmentStyles.dataList}>{renderSuspicions()}</div>
        </div>
      )}

      {/* The access code section is only shown after the code has been successfully loaded. */}
      {accessCode && (
        <div className={assessmentStyles.codePanel}>
          <div>
            <span className={assessmentStyles.dataLabel}>
              Persönlicher Zugangscode
            </span>
            <strong className={assessmentStyles.codeValue}>{accessCode}</strong>
          </div>
          <div className={assessmentStyles.dataActions}>
            <button
              type="button"
              className={assessmentStyles.secondaryButton}
              onClick={handleCopyAccessCode}
            >
              {accessCodeCopied ? "Kopiert!" : "Kopieren"}
            </button>
          </div>
          <p className={assessmentStyles.dataMeta}>
            Mit diesem Code können Sie Ihre Daten später wieder abrufen.
          </p>
        </div>
      )}

      <p className={assessmentStyles.selectedText}>
        Ihre Angaben wurden erfasst.
      </p>

      {/* The complete case data is only displayed when explicitly requested by the user. */}
      <button
        type="button"
        className={`${assessmentStyles.secondaryButton} ${assessmentStyles.dataToggleButton}`}
        onClick={() => setShowSavedData(!showSavedData)}
      >
        {showSavedData
          ? "Gespeicherte Daten ausblenden"
          : "Gespeicherte Daten anzeigen"}
      </button>

      {showSavedData && (
        <div className={assessmentStyles.dataPanel}>
          <div className={assessmentStyles.dataHeader}>
            <div>
              <p className={assessmentStyles.dataTitle}>Gespeicherte Daten</p>
              <p className={assessmentStyles.dataMeta}>
                Ihre Angaben aus dieser Ersteinschätzung.
              </p>
            </div>
          </div>

          <section className={assessmentStyles.dataSection}>
            <p className={assessmentStyles.dataSectionTitle}>Basisdaten</p>
            <div className={assessmentStyles.dataGrid}>
              {renderDataRow("Alter", basisData.age)}
              {renderDataRow("Geschlecht", basisData.gender)}
              {basisData.gender === "weiblich" &&
                renderDataRow("Schwangerschaft", basisData.pregnancy)}
            </div>
          </section>

          <section className={assessmentStyles.dataSection}>
            <p className={assessmentStyles.dataSectionTitle}>Beschwerden</p>
            <div className={assessmentStyles.dataGrid}>
              <div className={`${assessmentStyles.dataRow} ${assessmentStyles.dataRowWide}`}>
                <span className={assessmentStyles.dataLabel}>
                  Selbst beschriebene Beschwerden
                </span>
                {renderSymptomList(symptomText, "text")}
              </div>
              <div className={`${assessmentStyles.dataRow} ${assessmentStyles.dataRowWide}`}>
                <span className={assessmentStyles.dataLabel}>
                  Ausgewählte Symptome
                </span>
                {renderSymptomList(selectedSymptoms, "selected")}
              </div>
            </div>
          </section>

          <section className={assessmentStyles.dataSection}>
            <p className={assessmentStyles.dataSectionTitle}>Zusatzangaben</p>
            <div className={assessmentStyles.dataGrid}>
              {renderDataRow("Größe", additionalData.height)}
              {renderDataRow("Gewicht", additionalData.weight)}
              {renderDataRow(
                "Beschwerden bestehen seit",
                additionalData.duration ? `${additionalData.duration} Tage` : "",
              )}
              {basisData.gender !== "männlich" &&
                renderDataRow("Stillzeit", additionalData.breastfeeding)}
              {renderDataRow("Vorerkrankungen", conditionsValue, true)}
              {renderDataRow("Allergien", additionalData.allergies, true)}
              {renderDataRow("Temperatur", additionalData.temperature)}
              {renderDataRow(
                "Alkoholische Getränke pro Woche",
                additionalData.alcoholPerWeek,
              )}
              {renderDataRow("Zigaretten pro Tag", additionalData.cigarettesPerDay)}
              {renderDataRow("Beschwerden werden stärker", additionalData.worsening)}
              {renderDataRow("Weitere Informationen", additionalData.extraInfo, true)}
              <div className={`${assessmentStyles.dataRow} ${assessmentStyles.dataRowWide}`}>
                <span className={assessmentStyles.dataLabel}>Medikamente</span>
                {renderMedicationList()}
              </div>
            </div>
          </section>

          {/* Both export formats use the same centrally prepared data structure. */}
          <div className={assessmentStyles.dataActions}>
            <button
              type="button"
              className={assessmentStyles.secondaryButton}
              onClick={() => downloadPdf(buildExportData(basisData, additionalData, symptomText, selectedSymptoms, aiAnswer))}
            >
              PDF herunterladen
            </button>
            <button
              type="button"
              className={assessmentStyles.secondaryButton}
              onClick={() => downloadTxt(buildExportData(basisData, additionalData, symptomText, selectedSymptoms, aiAnswer))}
            >
              TXT herunterladen
            </button>
          </div>
        </div>
      )}


      <hr className={assessmentStyles.dataDivider} />

      {/* ends assesment und takes user back to starting page */}
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
