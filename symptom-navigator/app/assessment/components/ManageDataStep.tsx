import type { Step } from "../../types/assessment";
import assessmentStyles from "../Assessment.module.css";
import { makeDBDataReadable } from "../utils/assessmentData";
import { accessDataWithAccessCode, deleteDataOnAccessCode, accessAiDataWithAccessCode } from "../../actions";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ManageDataStepProps = {
    step: Step;
    setStep: (step: Step) => void;
};

export function ManageDataStep({ step, setStep }: ManageDataStepProps) {

    // state to store retrieved data and access code
    const [data, setData] = useState<any | null>(null);
    const [aiData, setAiData] = useState<any | null>(null);
    const [code, setCode] = useState<string>("");


    // convert coded values to be read by users where necessary
    const [geschlecht, schwangerschaft, stillzeit, worsening] = makeDBDataReadable(data)

    // helper functions for pdf and txt export
    const handleDownloadTxt = () => {
        const rows: string[] = [];

        rows.push("Daten\n");

        rows.push("Patientendaten");
        rows.push(`Alter: ${data?.caseData?.[0]?.age || "Keine Angabe"}`);
        rows.push(`Geschlecht: ${geschlecht || "Keine Angabe"}`);
        rows.push(`Größe: ${data?.additionalInfoData?.[0]?.height ? `${data.additionalInfoData[0].height} cm` : "Keine Angabe"}`);
        rows.push(`Gewicht: ${data?.additionalInfoData?.[0]?.weight ? `${data.additionalInfoData[0].weight} kg` : "Keine Angabe"}`);
        rows.push(`Temperatur: ${data?.additionalInfoData?.[0]?.temperature ? `${data.additionalInfoData[0].temperature} °C` : "Keine Angabe"}`);
        rows.push(`Dauer der Symptome: ${data?.additionalInfoData?.[0]?.duration ? `${data.additionalInfoData[0].duration} Tage` : "Keine Angabe"}`);
        rows.push(`Symptome werden schlimmer: ${worsening || "Keine Angabe"}`);
        if (geschlecht !== "männlich") {
            rows.push(`Schwangerschaft: ${schwangerschaft}`);
            rows.push(`Stillzeit: ${stillzeit}`);
        }
        rows.push(`Medikation: ${data?.medicationData?.medication?.join(", ") || "Keine Angabe"}`);
        rows.push(`Allergien: ${data?.allergyData?.allergies?.join(", ") || "Keine Angabe"}`);
        rows.push(`Vorerkrankungen: ${data?.conditionsData?.conditions?.join(", ") || "Keine Angabe"}`);

        rows.push("\nSymptome");
        if (data?.symptomData?.[0]?.name_de) {
            rows.push(`Symptome: ${data?.symptomData?.map((s: { name_de: string }) => s.name_de).join(", ")}`);
        }
        if (data?.textSymptomData?.[0]?.raw_symptoms) {
            rows.push(`Selbst beschriebene Beschwerden: ${data?.textSymptomData?.[0]?.raw_symptoms}`);
        }

        rows.push("\nKI Auswertung");
        rows.push(`Dringlichkeitsstufe: ${aiData?.[0]?.urgency_level || "Keine Angabe"}`);
        rows.push(`Handlungsempfehlung: ${aiData?.[0]?.advice_text || "Keine Angabe"}`);

        rows.push("\nVewrmutungen:");
        [1, 2, 3, 4, 5].forEach((i) => {
            const suspicion = aiData?.[0]?.[`suspicion${i}`];
            const probability = aiData?.[0]?.[`probability${i}`];
            if (suspicion) {
            rows.push(`Vermutung ${i}: ${suspicion} (${probability != null ? `${probability}%` : "Keine Angabe"})`);
            rows.push(`Wahrscheinlichkeit: ${probability != null ? `${probability}%` : "Keine Angabe"}`);
            }
        });

        rows.push(`\nDaten erfasst am: ${data?.caseData?.[0]?.date ? new Date(data.caseData[0].date).toLocaleString() : "Keine Angabe"}`);

        const text = rows.join("\n");
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "assessment.txt";
        a.click();
        URL.revokeObjectURL(url);
        };


    const tableBody: string[][] = [];
    tableBody.push(["Alter", data?.caseData?.[0]?.age || "Keine Angabe"]);
    tableBody.push(["Geschlecht", geschlecht || "Keine Angabe"]);
    tableBody.push(["Größe", data?.additionalInfoData?.[0]?.height ? `${data.additionalInfoData[0].height} cm` : "Keine Angabe"]);
    tableBody.push(["Gewicht", data?.additionalInfoData?.[0]?.weight ? `${data.additionalInfoData[0].weight} kg` : "Keine Angabe"]);
    tableBody.push(["Medikation", data?.medicationData?.medication?.join(", ") || "Keine Angabe"]);
    tableBody.push(["Allergien", data?.allergyData?.allergies?.join(", ") || "Keine Angabe"]);
    tableBody.push(["Vorerkrankungen", data?.conditionsData?.conditions?.join(", ") || "Keine Angabe"]);
    tableBody.push(["Temperatur", data?.additionalInfoData?.[0]?.temperature ? `${data.additionalInfoData[0].temperature} °C` : "Keine Angabe"]);
    tableBody.push(["Dauer der Symptome", data?.additionalInfoData?.[0]?.duration ? `${data.additionalInfoData[0].duration} Tage` : "Keine Angabe"]);
    tableBody.push(["Symptome werden schlimmer", worsening || "Keine Angabe"]);
    if (geschlecht !== "männlich") {
        tableBody.push(["Schwangerschaft", schwangerschaft]);
        tableBody.push(["Stillzeit", stillzeit]);
    }
    if (data?.symptomData?.[0]?.name_de != null && data?.symptomData?.[0]?.name_de != '') {
        tableBody.push(["Symptome", data?.symptomData?.map((s: { name_de: string }) => s.name_de).join(", ") || "Keine Angabe"]);
    }
    if (data?.textSymptomData?.[0]?.raw_symptoms != null && data?.textSymptomData?.[0]?.raw_symptoms != '') {
        tableBody.push(["selbst geschriebene Beschwerden", data?.textSymptomData?.[0]?.raw_symptoms || "Keine Angabe"]);
    }
    tableBody.push(["Dringlichkeitsstufe (KI)", aiData?.[0]?.urgency_level || "Keine Angabe"]);
    tableBody.push(["Handlungsempfehlung (KI)", aiData?.[0]?.advice_text || "Keine Angabe"]);
    tableBody.push(["Vermutung 1 (KI)", aiData?.[0]?.suspicion1 || "Keine Angabe"]);
    tableBody.push(["Wahrscheinlichkeit", aiData?.[0]?.probability1 != null ? `${aiData[0].probability1}%` : "Keine Angabe"]);
    tableBody.push(["Vermutung 2 (KI)", aiData?.[0]?.suspicion2 || "Keine Angabe"]);
    tableBody.push(["Wahrscheinlichkeit", aiData?.[0]?.probability2 != null ? `${aiData[0].probability2}%` : "Keine Angabe"]);
    tableBody.push(["Vermutung 3 (KI)", aiData?.[0]?.suspicion3 || "Keine Angabe"]);
    tableBody.push(["Wahrscheinlichkeit", aiData?.[0]?.probability3 != null ? `${aiData[0].probability3}%` : "Keine Angabe"]);
    tableBody.push(["Vermutung 4 (KI)", aiData?.[0]?.suspicion4 || "Keine Angabe"]);
    tableBody.push(["Wahrscheinlichkeit", aiData?.[0]?.probability4 != null ? `${aiData[0].probability4}%` : "Keine Angabe"]);
    tableBody.push(["Vermutung 5 (KI)", aiData?.[0]?.suspicion5 || "Keine Angabe"]);
    tableBody.push(["Wahrscheinlichkeit", aiData?.[0]?.probability5 != null ? `${aiData[0].probability5}%` : "Keine Angabe"]);
    tableBody.push(["Daten erfasst am", data?.caseData?.[0]?.date ? new Date(data.caseData[0].date).toLocaleString() : "Keine Angabe"]);

    const handleDownloadPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(
    `
    Daten
    `
    , 10, 10); 

    autoTable(doc, {
        startY: 25,
        theme: "plain",
        body: tableBody,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save("assessment.pdf");
    };

    return (
        <div className={assessmentStyles.resultBox}>

            <p className={assessmentStyles.selectedText}>Datenverwaltung</p>

            <div className={assessmentStyles.fieldset}>
                <p className={assessmentStyles.formLabel}>
                    Code zum Abrufen oder Löschen der Daten eingeben:
                </p>
                <input
                    type="text"
                    placeholder="Code hier eingeben"
                    className={assessmentStyles.input}
                    onChange={(e) => setCode(e.target.value.trim())}
                />
                <div className={assessmentStyles.buttonGroup}>
                    <button
                        type="button"
                        className={assessmentStyles.continueButton}
                        onClick={async () => {
                            setData(await accessDataWithAccessCode(code));
                            setAiData(await accessAiDataWithAccessCode(code));
                        }}
                    >
                        Abrufen
                    </button>
                    <button
                        type="button"
                        className={assessmentStyles.continueButton}
                        onClick={async () => await deleteDataOnAccessCode(code)}
                    >
                        Löschen
                    </button>
                </div>
        </div>

            {data && (
                <>
                    <p className={assessmentStyles.selectedText}>Abgerufene Daten</p>

                    <div className={assessmentStyles.fieldset}>
                        <p>Geschlecht: <strong>{geschlecht || "Keine Angabe"}</strong></p>
                        <p>Alter: <strong>{data?.caseData?.[0]?.age || "Keine Angabe"}</strong></p>
                        {geschlecht !== "männlich"  && (
                            <p>Schwanger: <strong>{schwangerschaft}</strong></p>
                        )}
                        {geschlecht !== "männlich" && (
                            <p>Stillzeit: <strong>{stillzeit}</strong></p>
                        )}
                    </div>

                    {data.symptomData?.[0]?.name_de != null && data.symptomData?.[0]?.name_de != '' && (
                        <div className={assessmentStyles.fieldset}>
                            <p className={assessmentStyles.selectedText}>Symptome</p>
                            <ul>
                                {data.symptomData.map((symptom: { name_de: string; bodyregion: string; painscale?: string }, i: number) => (
                                    <div key={i} className={assessmentStyles.fieldset}>
                                        Bezeichnung: <strong>{symptom.name_de}</strong><br />
                                        Körperregion: <strong>{symptom.bodyregion}</strong><br />
                                        {symptom.painscale !== null && (
                                            <p>Schmerzskala: <strong>{symptom.painscale || "nicht angegeben"}</strong></p>
                                        )}
                                    </div>
                                ))}
                            </ul>
                        </div>
                    )}

                    {data.textSymptomData?.[0]?.raw_symptoms != null && data.textSymptomData?.[0]?.raw_symptoms != '' && (
                        <div className={assessmentStyles.fieldset}>
                            <p className={assessmentStyles.selectedText}>Selbst beschriebene Beschwerden</p>
                            <ul>
                                {data.textSymptomData.map((symptom: { raw_symptoms: string; bodyregion: string; painscale?: string }, i: number) => (
                                    <div key={i} className={assessmentStyles.fieldset}>
                                        Bezeichnung: <strong>{symptom.raw_symptoms}</strong><br />
                                        Körperregion: <strong>{symptom.bodyregion}</strong><br />
                                        {symptom.painscale !== null && (
                                            <p>Schmerzskala: <strong>{symptom.painscale || "nicht angegeben"}</strong></p>
                                        )}
                                    </div>
                                ))}
                            </ul>
                        </div>
                    )}

                    {(data?.medicationData || data?.allergyData || data?.conditionsData) && (
                        <div className={assessmentStyles.fieldset}>
                            <p className={assessmentStyles.selectedText}>Zusatzangaben</p>
                            {data?.medicationData?.medication[0] && (
                                <p>Medikation: <strong>{data.medicationData.medication?.join(", ")}</strong></p>
                            )}
                            {data?.allergyData?.allergies[0] && (
                                <p>Allergien: <strong>{data.allergyData.allergies?.join(", ")}</strong></p>
                            )}
                            {data?.conditionsData?.conditions[0] && (
                                <p>Vorerkrankungen: <strong>{data.conditionsData.conditions?.join(", ")}</strong></p>
                            )}
                            {data?.additionalInfoData?.[0]?.height && (
                                <p>Größe: <strong>{data.additionalInfoData[0].height} cm</strong></p>
                            )}
                            {data?.additionalInfoData?.[0]?.weight && (
                                <p>Gewicht: <strong>{data.additionalInfoData[0].weight} kg</strong></p>
                            )}
                            {data?.additionalInfoData?.[0]?.temperature !== '' && data?.additionalInfoData?.[0]?.temperature !== null && (
                                <p>Temperatur: <strong>{data.additionalInfoData[0].temperature} °C</strong></p>
                            )}
                            {data?.additionalInfoData?.[0]?.duration && (
                                <p>Dauer der Symptome: <strong>{data.additionalInfoData[0].duration} Tage</strong></p>
                            )}
                            {worsening && (
                                <p>Symptome werden schlimmer: <strong>{worsening}</strong></p>
                            )}
                            {data?.additionalInfoData?.[0]?.other_info && (
                                <p>Sonstige Angaben: <strong>{data.additionalInfoData[0].other_info}</strong></p>
                            )}

                            {data?.additionalInfoData?.[0]?.other_info == null && data?.additionalInfoData?.[0]?.height == null && data?.additionalInfoData?.[0]?.weight == null && data?.additionalInfoData?.[0]?.temperature == null && data?.additionalInfoData?.[0]?.duration == null && worsening === undefined && (<p>Keine Zusatzangaben vorhanden</p>)}
                        </div>
                    )}

                    {aiData && aiData[0] && (
                    <>
                        <div className={assessmentStyles.fieldset}>
                            <p className={assessmentStyles.selectedText}>KI-Einschätzung</p>
                            {aiData[0].urgency_level && (
                                <p>Dringlichkeitsstufe: <strong>{aiData[0].urgency_level}</strong></p>
                            )}
                            {aiData[0].advice_text && (
                                <p>Handlungsempfehlung: <strong>{aiData[0].advice_text}</strong></p>
                            )}
                        </div>


                        <div className={assessmentStyles.fieldset}>
                            <p className={assessmentStyles.selectedText}>Vermutungen</p>
                            {[1, 2, 3, 4, 5].map((n) => {
                                const suspicion = aiData[0][`suspicion${n}`];
                                const probability = aiData[0][`probability${n}`];
                                if (!suspicion) return null;
                                return (
                                    <div key={n} className={assessmentStyles.fieldset}>
                                        Vermutung {n}: <strong>{suspicion}</strong><br />
                                        {probability != null && (
                                            <p>Wahrscheinlichkeit: <strong>{probability}%</strong></p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {data?.caseData?.[0]?.date && (
                            <div className={assessmentStyles.fieldset}>
                                <p>Daten erfasst am: <strong>{new Date(data.caseData[0].date).toLocaleString()}</strong></p>
                            </div>
                        )}

                        <div className={assessmentStyles.buttonGroup}>
                            <button
                                type="button"
                                className={assessmentStyles.secondaryButton}
                                onClick={handleDownloadPdf}
                            >
                                pdf herunterladen
                            </button>

                            <button
                                type="button"
                                className={assessmentStyles.secondaryButton}
                                onClick={handleDownloadTxt}
                            >
                                txt herunterladen
                            </button>
                        </div>
                    </>
                    )}
                </>
            )}
        </div>
    );
}
