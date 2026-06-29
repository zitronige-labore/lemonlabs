/*
  Verwaltung bereits gespeicherter Assessment-Daten.

  Über einen persönlichen Zugriffscode können Falldaten und die zugehörige
  KI-Auswertung abgerufen, dargestellt, exportiert oder vollständig gelöscht werden.
*/
import { useState } from "react";

/* Gemeinsame Styles für Datenbereiche, Formulare und Ergebnislisten. */
import assessmentStyles from "../Assessment.module.css";

/* Serveraktionen für Abruf und Löschung der zum Zugriffscode gehörenden Daten. */
import {
  accessAiDataWithAccessCode,
  accessDataWithAccessCode,
  deleteDataOnAccessCode,
} from "../../actions";
/* Typ der zentralen Seitennavigation. */
import type { Step } from "../../types/assessment";
/* Übersetzt codierte Datenbankwerte in lesbare deutsche Angaben. */
import { makeDBDataReadable } from "../utils/assessmentData";
/* Gemeinsame Exportfunktionen und ihr erwartetes Datenformat. */
import {
  downloadPdf,
  downloadTxt,
  type AssessmentExportData,
} from "../utils/exportUtils";

/*
  Navigationswerte werden von der Hauptseite übergeben, sind in der aktuellen
  Darstellung aber noch nicht direkt erforderlich.
*/
type ManageDataStepProps = {
  step: Step;
  setStep: (step: Step) => void;
};

/* Vereinheitlicht leere Werte und Listen für die Anzeige in den Datenzeilen. */
function displayValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Keine Angabe";
  }

  if (value === null || value === undefined || value === "") {
    return "Keine Angabe";
  }

  return String(value);
}

export function ManageDataStep({ step, setStep }: ManageDataStepProps) {
  /* Getrennte Zustände für medizinische Falldaten und die optionale KI-Auswertung. */
  const [data, setData] = useState<any | null>(null);
  const [aiData, setAiData] = useState<any | null>(null);

  /* Eingabe-, Validierungs- und Rückmeldungszustände des Zugriffscode-Formulars. */
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [lastDeleted, setLastDeleted] = useState<string>("")

  /* Zugriffscodes werden als UUID gespeichert und vor der Serveranfrage formal geprüft. */
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  /* Für Nutzer schwer lesbare Datenbankwerte werden zentral aufbereitet. */
  const [geschlecht, schwangerschaft, stillzeit, worsening, medication] =
    makeDBDataReadable(data);

  /*
    Führt die verteilten Datenbankergebnisse in das gemeinsame Exportformat zusammen.
    Fehlende Teilbereiche erhalten dieselben Fallbacks wie in der sichtbaren Ansicht.
  */
  function buildExportData(): AssessmentExportData {
    return {
      alter: data?.caseData?.[0]?.age || "Keine Angabe",
      geschlecht: geschlecht || "Keine Angabe",
      schwangerschaft,
      stillzeit,
      worsening,
      groesse: data?.additionalInfoData?.[0]?.height
        ? `${data.additionalInfoData[0].height} cm`
        : "Keine Angabe",
      gewicht: data?.additionalInfoData?.[0]?.weight
        ? `${data.additionalInfoData[0].weight} kg`
        : "Keine Angabe",
      temperatur: data?.additionalInfoData?.[0]?.temperature
        ? `${data.additionalInfoData[0].temperature} °C`
        : "Keine Angabe",
      dauer: data?.additionalInfoData?.[0]?.duration
        ? `${data.additionalInfoData[0].duration} Tage`
        : "Keine Angabe",
      medikation: medication?.join(", ") || "Keine Angabe",
      allergien: data?.allergyData?.allergies?.join(", ") || "Keine Angabe",
      vorerkrankungen:
        data?.conditionsData?.conditions?.join(", ") || "Keine Angabe",
      alkoholkonsum:
        data?.additionalInfoData?.[0]?.alcohol_per_week || "Keine Angabe",
      zigaretten:
        data?.additionalInfoData?.[0]?.cigarettes_per_day || "Keine Angabe",
      symptome: data?.symptomData?.[0]?.name_de
        ? data.symptomData.map((symptom: any) => symptom.name_de).join(", ")
        : "",
      textSymptome: data?.textSymptomData?.[0]?.raw_symptoms || "",
      datum: data?.caseData?.[0]?.date
        ? new Date(data.caseData[0].date).toLocaleString()
        : "Keine Angabe",
      dringlichkeit: aiData?.[0]?.urgency_level?.toString() || "Keine Angabe",
      handlungsempfehlung: aiData?.[0]?.advice_text || "Keine Angabe",
      vermutungen: [1, 2, 3, 4, 5]
        .map((index) => ({
          text: aiData?.[0]?.[`suspicion${index}`] || "",
          wahrscheinlichkeit:
            aiData?.[0]?.[`probability${index}`] != null
              ? `${aiData[0][`probability${index}`]}%`
              : "Keine Angabe",
        }))
        .filter((suspicion) => suspicion.text),
    };
  }

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
      <strong className={assessmentStyles.dataValue}>{displayValue(value)}</strong>
    </div>
  );

  /*
    Stellt strukturierte oder frei formulierte Symptome mit Region und Schmerzskala dar.
    textSymptom wählt dabei das passende Beschriftungsfeld des Datenbankobjekts.
  */
  const renderStructuredSymptoms = (symptoms: any[] | undefined) => {
    if (!symptoms?.length) {
      return (
        <strong className={assessmentStyles.dataValue}>
          Keine Angabe
        </strong>
      );
    }

    return (
      <ul className={assessmentStyles.dataList}>
        {symptoms.map((symptom, index) => (
          <li key={index} className={assessmentStyles.dataListItem}>
            <p className={assessmentStyles.dataListItemHeader}>
              {symptom.name_de || "Symptom"}
            </p>

            <div className={assessmentStyles.dataListItemGrid}>
              {symptom.bodyregion && (
                <div>
                  <span className={assessmentStyles.dataLabel}>
                    Körperregion
                  </span>
                  <strong className={assessmentStyles.dataValue}>
                    {symptom.bodyregion}
                  </strong>
                </div>
              )}

              {symptom.painscale != null && (
                <div>
                  <span className={assessmentStyles.dataLabel}>
                    Schmerzskala
                  </span>
                  <strong className={assessmentStyles.dataValue}>
                    {symptom.painscale}
                  </strong>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };


  const renderTextSymptoms = (symptoms: any[] | undefined) => {
    if (!symptoms?.length) {
      return (
        <strong className={assessmentStyles.dataValue}>
          Keine Angabe
        </strong>
      );
    }

    return (
      <ul className={assessmentStyles.dataList}>
        {symptoms.map((symptom, index) => (
          <li key={index} className={assessmentStyles.dataListItem}>
            <p className={assessmentStyles.dataListItemHeader}>
              {symptom.raw_symptoms || "Beschwerde"}
            </p>

            <div className={assessmentStyles.dataListItemGrid}>
              {symptom.bodyregion && (
                <div>
                  <span className={assessmentStyles.dataLabel}>
                    Körperregion
                  </span>
                  <strong className={assessmentStyles.dataValue}>
                    {symptom.bodyregion}
                  </strong>
                </div>
              )}

              {symptom.painscale != null && (
                <div>
                  <span className={assessmentStyles.dataLabel}>
                    Schmerzskala
                  </span>
                  <strong className={assessmentStyles.dataValue}>
                    {symptom.painscale}
                  </strong>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };


  /* Gibt die zuvor lesbar aufbereiteten Medikationsangaben als Liste aus. */
  const renderMedicationList = () => {
    if (!medication.name) {
      return <strong className={assessmentStyles.dataValue}>Keine Angabe</strong>;
    }

    return (
      <ul className={assessmentStyles.dataList}>
        {medication.map((entry: string, index: number) => (
          <li key={index} className={assessmentStyles.dataListItem}>
            <strong className={assessmentStyles.dataValue}>{entry}</strong>
          </li>
        ))}
      </ul>
    );
  };

  /*
    Lädt zuerst die Falldaten. Nur bei einem Treffer wird anschließend auch
    die getrennt gespeicherte KI-Auswertung für denselben Code angefordert.
  */
  const handleFetchData = async () => {
    const result = await accessDataWithAccessCode(code);

    if (result === null) {
      setCodeError("Dieser Code hat keine Daten hinterlegt");
      setData(null);
      setAiData(null);
      return;
    }

    setCodeError("");
    setData(result);
    setAiData(await accessAiDataWithAccessCode(code));
  };

  return (
    <div className={assessmentStyles.resultBox}>
      <p className={assessmentStyles.selectedText}>Datenverwaltung</p>

      {/* Zugriffscode eingeben, prüfen und für Abruf oder Löschung verwenden. */}
      <div className={assessmentStyles.dataPanel}>
        <div className={assessmentStyles.dataHeader}>
          <div>
            <p className={assessmentStyles.dataTitle}>Zugriffscode</p>
            <p className={assessmentStyles.dataMeta}>
              Gespeicherte Daten abrufen oder löschen.
            </p>
          </div>
        </div>
        <label className={assessmentStyles.formLabel}>
          Code eingeben
          <input
            type="text"
            placeholder="Code hier eingeben"
            className={assessmentStyles.input}
            onChange={(event) => {
              /* Leerzeichen entfernen und nur die formale UUID-Struktur validieren. */
              const value = event.target.value.trim();
              setCode(value);

              if (value === "") {
                setCodeError("");
              } else if (!uuidPattern.test(value)) {
                setCodeError("Bitte geben Sie einen gültigen Code ein.");
              } else {
                setCodeError("");
              }
            }}
          />
        </label>
        {codeError && <p className={assessmentStyles.errorText}>{codeError}</p>}
        <div className={assessmentStyles.dataActions}>
          <button
            type="button"
            className={assessmentStyles.continueButton}
            onClick={handleFetchData}
          >
            Abrufen
          </button>
          {/* Die Löschaktion behandelt auch fehlgeschlagene Serveranfragen kontrolliert. */}
          <button
            type="button"
            className={assessmentStyles.secondaryButton}
            onClick={async () => {
              let deletion:boolean;
              try {
                deletion = await deleteDataOnAccessCode(code)
              }
              catch {
                deletion = false
              }

              if(deletion) {
                setLastDeleted(code)
              }
              else{
                setLastDeleted("Löschung fehlgeschlagen")
              }
            }}
          >
            Löschen
          </button>
          {lastDeleted === code && (
            <p>Daten wurden gelöscht</p>
          )}
          {lastDeleted === "Löschung fehlgeschlagen" && (
            <p>Löschung fehlgeschlagen</p>
          )}
        </div>
      </div>

      {/* Ergebnisbereiche erscheinen erst nach einem erfolgreichen Datenabruf. */}
      {data && (
        <div className={assessmentStyles.dataPanel}>
          <div className={assessmentStyles.dataHeader}>
            <div>
              <p className={assessmentStyles.dataTitle}>Abgerufene Daten</p>
              <p className={assessmentStyles.dataMeta}>
                Gespeicherte Angaben zu diesem Zugriffscode.
              </p>
            </div>
          </div>

          {/* Allgemeine Falldaten einschließlich des Erfassungszeitpunkts. */}
          <section className={assessmentStyles.dataSection}>
            <p className={assessmentStyles.dataSectionTitle}>Basisdaten</p>
            <div className={assessmentStyles.dataGrid}>
              {renderDataRow("Geschlecht", geschlecht)}
              {renderDataRow("Alter", data?.caseData?.[0]?.age)}
              {geschlecht !== "männlich" &&
                renderDataRow("Schwanger", schwangerschaft)}
              {geschlecht !== "männlich" &&
                renderDataRow("Stillzeit", stillzeit)}
              {renderDataRow(
                "Daten erfasst am",
                data?.caseData?.[0]?.date
                  ? new Date(data.caseData[0].date).toLocaleString()
                  : "",
                true,
              )}
            </div>
          </section>

          {/* Strukturierte Auswahl und selbst beschriebene Beschwerden getrennt anzeigen. */}
          <section className={assessmentStyles.dataSection}>
            <p className={assessmentStyles.dataSectionTitle}>Beschwerden</p>
            <div className={assessmentStyles.dataGrid}>
              <div className={`${assessmentStyles.dataRow} ${assessmentStyles.dataRowWide}`}>
                <span className={assessmentStyles.dataLabel}>Symptome</span>
                {renderStructuredSymptoms(data.symptomData)}
              </div>
              <div className={`${assessmentStyles.dataRow} ${assessmentStyles.dataRowWide}`}>
                <span className={assessmentStyles.dataLabel}>
                  Selbst beschriebene Beschwerden
                </span>
                {renderTextSymptoms(data.textSymptomData)}
              </div>
            </div>
          </section>

          {/* Ergänzende Gesundheits- und Lebensstilinformationen. */}
          <section className={assessmentStyles.dataSection}>
            <p className={assessmentStyles.dataSectionTitle}>Zusatzangaben</p>
            <div className={assessmentStyles.dataGrid}>
              {renderDataRow(
                "Allergien",
                data?.allergyData?.allergies,
                true,
              )}
              {renderDataRow(
                "Vorerkrankungen",
                data?.conditionsData?.conditions,
                true,
              )}
              {renderDataRow(
                "Größe",
                data?.additionalInfoData?.[0]?.height
                  ? `${data.additionalInfoData[0].height} cm`
                  : "",
              )}
              {renderDataRow(
                "Gewicht",
                data?.additionalInfoData?.[0]?.weight
                  ? `${data.additionalInfoData[0].weight} kg`
                  : "",
              )}
              {renderDataRow(
                "Temperatur",
                data?.additionalInfoData?.[0]?.temperature
                  ? `${data.additionalInfoData[0].temperature} °C`
                  : "",
              )}
              {renderDataRow(
                "Dauer der Symptome",
                data?.additionalInfoData?.[0]?.duration
                  ? `${data.additionalInfoData[0].duration} Tage`
                  : "",
              )}
              {renderDataRow("Symptome werden schlimmer", worsening)}
              {renderDataRow(
                "Zigaretten pro Tag",
                data?.additionalInfoData?.[0]?.cigarettes_per_day,
              )}
              {renderDataRow(
                "Alkoholische Getränke pro Woche",
                data?.additionalInfoData?.[0]?.alcohol_per_week,
              )}
              {renderDataRow(
                "Sonstige Angaben",
                data?.additionalInfoData?.[0]?.other_info,
                true,
              )}
              <div className={`${assessmentStyles.dataRow} ${assessmentStyles.dataRowWide}`}>
                <span className={assessmentStyles.dataLabel}>Medikamente</span>
                {renderMedicationList()}
              </div>
            </div>
          </section>

          {/* Die KI-Einschätzung ist optional und wird nur bei vorhandenen Daten gezeigt. */}
          {aiData?.[0] && (
            <section className={assessmentStyles.dataSection}>
              <p className={assessmentStyles.dataSectionTitle}>KI-Einschätzung</p>
              <div className={assessmentStyles.dataGrid}>
                {renderDataRow("Dringlichkeitsstufe", aiData[0].urgency_level)}
                {renderDataRow("Handlungsempfehlung", aiData[0].advice_text, true)}
                <div className={`${assessmentStyles.dataRow} ${assessmentStyles.dataRowWide}`}>
                  <span className={assessmentStyles.dataLabel}>Vermutungen</span>
                  <ul className={assessmentStyles.dataList}>
                    {/* Die Datenbank reserviert bis zu fünf nummerierte Vermutungen. */}
                    {[1, 2, 3, 4, 5].map((index) => {
                      const suspicion = aiData[0][`suspicion${index}`];
                      const probability = aiData[0][`probability${index}`];
                      if (!suspicion) return null;
                      return (
                        <li key={index} className={assessmentStyles.dataListItem}>
                          <p className={assessmentStyles.dataListItemHeader}>
                            Vermutung {index}
                          </p>
                          <div className={assessmentStyles.dataListItemGrid}>
                            <div>
                              <span className={assessmentStyles.dataLabel}>
                                Beschreibung
                              </span>
                              <strong className={assessmentStyles.dataValue}>
                                {suspicion}
                              </strong>
                            </div>
                            {probability != null && (
                              <div>
                                <span className={assessmentStyles.dataLabel}>
                                  Wahrscheinlichkeit
                                </span>
                                <strong className={assessmentStyles.dataValue}>
                                  {probability}%
                                </strong>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* PDF und TXT basieren auf derselben normalisierten Exportstruktur. */}
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
    </div>
  );
}
