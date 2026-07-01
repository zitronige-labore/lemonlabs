/*
  Review screen shown before the assessment is finally submitted.

  It summarizes the basic information, symptoms, and additional details,
  allows targeted corrections, and then triggers submission of the parent formular.
*/
import { useState } from "react";

/* Shared styles for data grids, lists, and edit actions. */
import assessmentStyles from "../Assessment.module.css";

/* Data models from previous steps and the central navigation step type. */
import type {
  AdditionalData,
  BasisData,
  Step,
} from "../../types/assessment";

/*
  Properties of the review screen.

  basisData / additionalData / symptomText / selectedSymptoms:
  Contain all information collected so far for display.

  removeSymptomText / toggleSymptom:
  Remove free text or selected symptoms from the main state.

  setCheckInfoActive:
  Marks that the user entered an edit flow so that, after completing the
  correction, this review screen is shown again instead of continuing
  through the normal linear workflow.

  isOffline:
  Prevents the server dependent completion of the assessment while offline.
*/
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

/* Normalizes empty values and empty lists for the summary display. */
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
  /* The detailed summary remains collapsed until the user explicitly opens it. */
  const [showSavedData, setShowSavedData] = useState(false);

  /* Renders recurring label value pairs consistently within the data grid. */
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
      <strong className={assessmentStyles.dataValue}>
        {displayValue(value)}
      </strong>
    </div>
  );

  /*
  Symptoms are stored as JSON strings. This function formats both variants
  into a readable representation while preserving the original text for
  legacy entries that cannot be parsed.
*/
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
                {/* The appropriate remove function depends on the symptom source. */
                }
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

  /* Displays structured medication information completely and clearly. */
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

  return (
    <>
      {/* Opens or closes the complete summary of all entered information. */
      }
      <button
        type="button"
        className={`${assessmentStyles.secondaryButton} ${assessmentStyles.dataToggleButton}`}
        onClick={() => setShowSavedData(!showSavedData)}
      >
        {showSavedData
          ? "Daten ausblenden"
          : "Daten zur Überprüfung anzeigen"}
      </button>

      {/* Edit actions are only shown together with their corresponding data. */}
      {showSavedData && (
        <div className={assessmentStyles.dataPanel}>
          <div className={assessmentStyles.dataHeader}>
            <div>
              <h2 className={assessmentStyles.dataTitle}>
                Daten zur Überprüfung
              </h2>
              <p className={assessmentStyles.dataMeta}>
                Kontrollieren Sie Ihre Angaben vor dem Abschluss.
              </p>
            </div>
          </div>

          {/* Review basic information and edit it in the original step if necessary. */}
          <section className={assessmentStyles.dataSection}>
            <h3 className={assessmentStyles.dataSectionTitle}>Basisdaten</h3>
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
                  /* Return to the review screen after completing the correction. */
                  setStep("basisStart");
                  setCheckInfoActive(true);
                }}
              >
                Basisdaten bearbeiten
              </button>
            </div>
          </section>

          {/* Symptoms can be removed individually or extended with additional symptoms. */}
          <section className={assessmentStyles.dataSection}>
            <h3 className={assessmentStyles.dataSectionTitle}>Beschwerden</h3>
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
                  /* Adding new symptoms always starts again with the body region selection. */
                  setStep("bodyRegion");
                  setCheckInfoActive(true);
                }}
              >
                Weitere Symptome angeben
              </button>
            </div>
          </section>

          {/* Review optional health information, including medication details. */}
          <section className={assessmentStyles.dataSection}>
            <h3 className={assessmentStyles.dataSectionTitle}>Zusatzangaben</h3>
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
                  /* Edit additional information and return here afterwards. */
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

      {/* As a submit button, this triggers handleSubmit in AssessmentLayout. */}
      {!isOffline && (
        <button type="submit" className={assessmentStyles.primaryButton}>
          Einschätzung abschließen
        </button>
      )}
      {/* No incomplete server side submission is started while offline. */}
      {isOffline && (
        <p>
          Im Offline-Modus können keine Daten bearbeitet werden. Sobald eine
          Internetverbindung besteht, ist das Vortsetzen möglich.
        </p>
      )}
    </>
  );
}
