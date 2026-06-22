import { useEffect, useState } from "react";

import assessmentStyles from "../Assessment.module.css";

import { getAccessCode } from "../../actions";
import {
  downloadPdf,
  downloadTxt,
  type AssessmentExportData,
} from "../utils/exportUtils";

import type {
  AdditionalData,
  BasisData,
} from "../../types/assessment";

type ResultStepProps = {
  basisData: BasisData;
  additionalData: AdditionalData;
  caseId: string;
  symptomText: string[];
  selectedSymptoms: string[];
  aiAnswer: any;
  onGoHome: () => void;
};

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
  const [showSavedData, setShowSavedData] = useState(false);
  const [showAiReasoning, setShowAiReasoning] = useState(false);
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [accessCodeCopied, setAccessCodeCopied] = useState(false);

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

  function buildExportData(): AssessmentExportData {
    return {
      alter: basisData.age || "Keine Angabe",
      geschlecht: basisData.gender || "Keine Angabe",
      schwangerschaft: basisData.pregnancy || "Keine Angabe",
      stillzeit: additionalData.breastfeeding || "Keine Angabe",
      worsening: additionalData.worsening || undefined,
      groesse: additionalData.height ? `${additionalData.height} cm` : "Keine Angabe",
      gewicht: additionalData.weight ? `${additionalData.weight} kg` : "Keine Angabe",
      temperatur: additionalData.temperature || "Keine Angabe",
      dauer: additionalData.duration || "Keine Angabe",
      medikation: medicationValue?.join(",") || "Keine Angabe",
      allergien: additionalData.allergies.join(",") || "Keine Angabe",
      vorerkrankungen: additionalData.conditions.join(",") || "Keine Angabe",
      alkoholkonsum: additionalData.alcoholPerWeek || "Keine Angabe",
      zigaretten: additionalData.cigarettesPerDay || "Keine Angabe",
      symptome:
        selectedSymptoms.length > 0
          ? selectedSymptoms
              .map((symptom) => {
                try {
                  return JSON.parse(symptom).name;
                } catch {
                  return symptom;
                }
              })
              .join(", ")
          : "",
      textSymptome:
        symptomText.length > 0
          ? symptomText
              .map((symptom) => {
                try {
                  return JSON.parse(symptom).text_symptom;
                } catch {
                  return symptom;
                }
              })
              .join(", ")
          : "",
      datum: new Date().toLocaleString(),
      dringlichkeit: aiAnswer?.assessment?.urgency?.toString() || "Keine Angabe",
      handlungsempfehlung: aiAnswer?.assessment?.nextSteps || "Keine Angabe",
      vermutungen: suspicions
        ? ([1, 2, 3, 4, 5]
            .map((index) => {
              const suspicion = suspicions[`suspicion${index}`];
              if (!suspicion) return null;
              const reasonKey = Object.keys(suspicion).find((key) =>
                key.toLowerCase().includes("reason"),
              );
              const probKey = Object.keys(suspicion).find((key) =>
                key.toLowerCase().includes("probability"),
              );
              return {
                text: reasonKey ? suspicion[reasonKey] : "Keine Angabe",
                wahrscheinlichkeit:
                  probKey && suspicion[probKey]
                    ? `${suspicion[probKey]}`
                    : "Keine Angabe",
              };
            })
            .filter(Boolean) as AssessmentExportData["vermutungen"])
        : [],
    };
  }

  useEffect(() => {
    if (caseId) {
      getAccessCode(caseId).then(setAccessCode);
    }
  }, [caseId]);

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

  const renderDataRow = (
    label: string,
    value: unknown,
    wide = false,
  ) => (
    <div
      className={`${assessmentStyles.dataRow} ${
        wide ? assessmentStyles.dataRowWide : ""
      }`}
    >
      <span className={assessmentStyles.dataLabel}>{label}</span>
      <strong className={assessmentStyles.dataValue}>{displayValue(value)}</strong>
    </div>
  );

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

  const renderMedicationList = () => {
    if (!additionalData.medication?.length) {
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
        <button
          type="button"
          className={assessmentStyles.continueButton}
          onClick={() => setShowEmergencyPopup(true)}
        >
          Notfallhinweis anzeigen
        </button>
      );
    }

    return null;
  };

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
            <div>
              <span className={assessmentStyles.dataLabel}>Einordnung</span>
              <strong className={assessmentStyles.dataValue}>
                {displayValue(name)}
              </strong>
            </div>
            {probability && (
              <div>
                <span className={assessmentStyles.dataLabel}>
                  Wahrscheinlichkeit
                </span>
                <strong className={assessmentStyles.dataValue}>
                  {probability}
                </strong>
              </div>
            )}
            {reason && (
              <div className={assessmentStyles.dataRowWide}>
                <span className={assessmentStyles.dataLabel}>Begründung</span>
                <strong className={assessmentStyles.dataValue}>{reason}</strong>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={assessmentStyles.resultBox}>
      {aiAnswer?.assessment?.urgency ? (
        <div className={assessmentStyles.statusPanel}>
          <div className={assessmentStyles.dataHeader}>
            <div>
              <p className={assessmentStyles.dataTitle}>KI-Einschätzung</p>
              <p className={assessmentStyles.dataMeta}>
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

          <div className={assessmentStyles.dataActions}>
            <button
              type="button"
              className={assessmentStyles.secondaryButton}
              onClick={() => downloadPdf(buildExportData())}
            >
              PDF herunterladen
            </button>
            <button
              type="button"
              className={assessmentStyles.secondaryButton}
              onClick={() => downloadTxt(buildExportData())}
            >
              TXT herunterladen
            </button>
          </div>
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

      <hr className={assessmentStyles.dataDivider} />

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
