import { useState } from "react";

import assessmentStyles from "../Assessment.module.css";

import type {
  AdditionalData,
  BasisData,
  Step,
} from "../../types/assessment";

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

function displayValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Keine Angabe";
  }

  if (value === null || value === undefined || value === "") {
    return "Keine Angabe";
  }

  return String(value);
}

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
      <strong className={assessmentStyles.dataValue}>
        {displayValue(value)}
      </strong>
    </div>
  );

  const renderSymptomList = (
    entries: string[],
    kind: "text" | "selected",
  ) => {
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
                <button
                  type="button"
                  className={assessmentStyles.secondaryButton}
                  onClick={() =>
                    kind === "text"
                      ? removeSymptomText(entry)
                      : toggleSymptom(entry)
                  }
                >
                  {kind === "text" ? "Eintrag entfernen" : "Symptom entfernen"}
                </button>
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

  return (
    <>
      <button
        type="button"
        className={`${assessmentStyles.secondaryButton} ${assessmentStyles.dataToggleButton}`}
        onClick={() => setShowSavedData(!showSavedData)}
      >
        {showSavedData
          ? "Daten ausblenden"
          : "Daten zur Überprüfung anzeigen"}
      </button>

      {showSavedData && (
        <div className={assessmentStyles.dataPanel}>
          <div className={assessmentStyles.dataHeader}>
            <div>
              <p className={assessmentStyles.dataTitle}>
                Daten zur Überprüfung
              </p>
              <p className={assessmentStyles.dataMeta}>
                Kontrollieren Sie Ihre Angaben vor dem Abschluss.
              </p>
            </div>
          </div>

          <section className={assessmentStyles.dataSection}>
            <p className={assessmentStyles.dataSectionTitle}>Basisdaten</p>
            <div className={assessmentStyles.dataGrid}>
              {renderDataRow("Alter", basisData.age)}
              {renderDataRow("Geschlecht", basisData.gender)}
              {basisData.gender !== "männlich" &&
                renderDataRow("Schwangerschaft", basisData.pregnancy)}
            </div>
            <div className={assessmentStyles.dataActions}>
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
            <div className={assessmentStyles.dataActions}>
              <button
                type="button"
                className={assessmentStyles.secondaryButton}
                onClick={() => {
                  setStep("bodyRegion");
                  setCheckInfoActive(true);
                }}
              >
                Weitere Symptome angeben
              </button>
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
              {renderDataRow("Vorerkrankungen", additionalData.conditions, true)}
              {renderDataRow("Allergien", additionalData.allergies, true)}
              {renderDataRow(
                "Alkoholische Getränke pro Woche",
                additionalData.alcoholPerWeek,
              )}
              {renderDataRow("Zigaretten pro Tag", additionalData.cigarettesPerDay)}
              {renderDataRow("Temperatur", additionalData.temperature)}
              {renderDataRow("Beschwerden werden stärker", additionalData.worsening)}
              {renderDataRow("Weitere Informationen", additionalData.extraInfo, true)}
              <div className={`${assessmentStyles.dataRow} ${assessmentStyles.dataRowWide}`}>
                <span className={assessmentStyles.dataLabel}>Medikamente</span>
                {renderMedicationList()}
              </div>
            </div>
            <div className={assessmentStyles.dataActions}>
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
          </section>
        </div>
      )}

      {!isOffline && (
        <button type="submit" className={assessmentStyles.primaryButton}>
          Einschätzung abschließen
        </button>
      )}
      {isOffline && (
        <p>
          Im Offline-Modus können keine Daten bearbeitet werden. Sobald eine
          Internetverbindung besteht, ist das Vortsetzen möglich.
        </p>
      )}
    </>
  );
}
