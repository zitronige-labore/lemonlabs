/*
  Prüfansicht vor dem verbindlichen Abschluss des Assessments.

  Sie fasst Basisdaten, Beschwerden und Zusatzangaben zusammen, erlaubt
  gezielte Korrekturen und stößt anschließend das Absenden des Elternformulars an.
*/
import { useState } from "react";

/* Gemeinsame Styles für Datenraster, Listen und Bearbeitungsaktionen. */
import assessmentStyles from "../Assessment.module.css";

/* Datenmodelle der vorherigen Schritte und Typ der zentralen Navigation. */
import type {
  AdditionalData,
  BasisData,
  Step,
} from "../../types/assessment";

/*
  Eigenschaften der Prüfansicht.

  basisData / additionalData / symptomText / selectedSymptoms:
  Enthalten sämtliche bisher erfassten Angaben zur Darstellung.

  removeSymptomText / toggleSymptom:
  Entfernen Freitext- beziehungsweise ausgewählte Symptome aus dem Hauptzustand.

  setCheckInfoActive:
  Markiert einen Bearbeitungsweg, damit nach der Korrektur wieder diese
  Prüfansicht statt der regulären linearen Fortsetzung geöffnet wird.

  isOffline:
  Verhindert den serverabhängigen Abschluss ohne Internetverbindung.
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

/* Vereinheitlicht leere Einzelwerte und Listen für die Zusammenfassung. */
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
  /* Die umfangreiche Zusammenfassung bleibt bis zur bewussten Prüfung eingeklappt. */
  const [showSavedData, setShowSavedData] = useState(false);

  /* Rendert wiederkehrende Beschriftung-Wert-Paare einheitlich im Datenraster. */
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

  /*
    Symptome liegen als JSON-Strings vor. Die Funktion bereitet beide Varianten
    lesbar auf und behält bei nicht parsebaren Altdaten den ursprünglichen Text bei.
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
                {/* Die passende zentrale Löschfunktion hängt von der Symptomquelle ab. */}
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

  /* Stellt die strukturierten Medikationsangaben vollständig und lesbar dar. */
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
      {/* Öffnet oder schließt die vollständige Zusammenfassung aller Eingaben. */}
      <button
        type="button"
        className={`${assessmentStyles.secondaryButton} ${assessmentStyles.dataToggleButton}`}
        onClick={() => setShowSavedData(!showSavedData)}
      >
        {showSavedData
          ? "Daten ausblenden"
          : "Daten zur Überprüfung anzeigen"}
      </button>

      {/* Bearbeitungsaktionen sind erst zusammen mit den zugehörigen Daten sichtbar. */}
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

          {/* Basisdaten prüfen und bei Bedarf im ursprünglichen Schritt korrigieren. */}
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
                  /* Rückkehr zur Prüfansicht nach Abschluss der Korrektur vormerken. */
                  setStep("basisStart");
                  setCheckInfoActive(true);
                }}
              >
                Basisdaten bearbeiten
              </button>
            </div>
          </section>

          {/* Beschwerden können einzeln entfernt oder um weitere Symptome ergänzt werden. */}
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
                  /* Neue Symptome starten erneut bei der Auswahl der Körperregion. */
                  setStep("bodyRegion");
                  setCheckInfoActive(true);
                }}
              >
                Weitere Symptome angeben
              </button>
            </div>
          </section>

          {/* Optionale Gesundheitsangaben einschließlich der Medikation prüfen. */}
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
                  /* Zusatzangaben bearbeiten und anschließend hierher zurückkehren. */
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

      {/* Als Submit-Button löst der Abschluss handleSubmit im AssessmentLayout aus. */}
      {!isOffline && (
        <button type="submit" className={assessmentStyles.primaryButton}>
          Einschätzung abschließen
        </button>
      )}
      {/* Ohne Verbindung wird kein unvollständiger serverseitiger Abschluss gestartet. */}
      {isOffline && (
        <p>
          Im Offline-Modus können keine Daten bearbeitet werden. Sobald eine
          Internetverbindung besteht, ist das Vortsetzen möglich.
        </p>
      )}
    </>
  );
}
