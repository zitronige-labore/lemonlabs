import type { Step } from "../../types/assessment";
import assessmentStyles from "../Assessment.module.css";
import { makeDBDataReadable } from "../utils/assessmentData";
import { accessDataWithAccessCode, deleteDataOnAccessCode, accessAiDataWithAccessCode, getCaseIdFromAccessCode, sendFhirToServer, buildFhirBundle } from "../../actions";
import { useState } from "react";
import { downloadTxt, downloadPdf, type AssessmentExportData } from "../utils/exportUtils";

type ManageDataStepProps = {
    step: Step;
    setStep: (step: Step) => void;
};

export function ManageDataStep({ step, setStep }: ManageDataStepProps) {

    // state to store retrieved data and access code
    const [data, setData] = useState<any | null>(null);
    const [aiData, setAiData] = useState<any | null>(null);
    const [code, setCode] = useState<string>("");
    const [fhirSent, setFhirSent] = useState<number>(0);

    //state to store validation errors for uuid-code
    const [codeError, setCodeError] = useState("");

    //pattern for validation uuid code
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // convert coded values to be read by users where necessary
    const [geschlecht, schwangerschaft, stillzeit, worsening] = makeDBDataReadable(data);

    // building txt and pdf
    function buildExportData(): AssessmentExportData {
        return {
            alter: data?.caseData?.[0]?.age || "Keine Angabe",
            geschlecht: geschlecht || "Keine Angabe",
            schwangerschaft,
            stillzeit,
            worsening,
            groesse: data?.additionalInfoData?.[0]?.height ? `${data.additionalInfoData[0].height} cm` : "Keine Angabe",
            gewicht: data?.additionalInfoData?.[0]?.weight ? `${data.additionalInfoData[0].weight} kg` : "Keine Angabe",
            temperatur: data?.additionalInfoData?.[0]?.temperature ? `${data.additionalInfoData[0].temperature} °C` : "Keine Angabe",
            dauer: data?.additionalInfoData?.[0]?.duration ? `${data.additionalInfoData[0].duration} Tage` : "Keine Angabe",
            medikation: data?.medicationData?.medication?.join(", ") || "Keine Angabe",
            allergien: data?.allergyData?.allergies?.join(", ") || "Keine Angabe",
            vorerkrankungen: data?.conditionsData?.conditions?.join(", ") || "Keine Angabe",
            symptome: data?.symptomData?.[0]?.name_de ? data.symptomData.map((s: any) => s.name_de).join(", ") : "",
            textSymptome: data?.textSymptomData?.[0]?.raw_symptoms || "",
            datum: data?.caseData?.[0]?.date ? new Date(data.caseData[0].date).toLocaleString() : "Keine Angabe",
            dringlichkeit: aiData?.[0]?.urgency_level?.toString() || "Keine Angabe",
            handlungsempfehlung: aiData?.[0]?.advice_text || "Keine Angabe",
            vermutungen: [1, 2, 3, 4, 5]
                .map(i => ({
                    text: aiData?.[0]?.[`suspicion${i}`] || "",
                    wahrscheinlichkeit: aiData?.[0]?.[`probability${i}`] != null ? `${aiData[0][`probability${i}`]}%` : "Keine Angabe",
                }))
                .filter(v => v.text),
        };
    }

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
                    onChange={(e) => {
                        const value = e.target.value.trim();
                        setCode(value);

                        if (value === "") {
                            setCodeError("");
                        } else if (!uuidPattern.test(value)) {
                            setCodeError("Bitte geben Sie einen gültigen Code ein.")
                        } else {
                            setCodeError("");
                        }
                    }}/>
                {codeError && (
                        <p className={assessmentStyles.errorText}>
                            {codeError}
                        </p>
                    )
                    }
                <div className={assessmentStyles.buttonGroup}>
                    <button
                        type="button"
                        className={assessmentStyles.continueButton}
                        onClick={async () => {
                            const result = await accessDataWithAccessCode(code);  // erst holen
                            if (result === null) {
                                setCodeError("Dieser Code hat keine Daten hinterlegt");
                                setData(null);
                                setAiData(null);
                            } else {
                                setCodeError("");
                                setData(result);
                                setAiData(await accessAiDataWithAccessCode(code));
                            }
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
                        {geschlecht !== "männlich" && (
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

                                <button
                                    type="button"
                                    className={assessmentStyles.secondaryButton}
                                    onClick={async () => {
                                        const fhirAnswerSuccess = await sendFhirToServer(code);
                                        if(fhirAnswerSuccess) {
                                            setFhirSent(1);
                                        }
                                        else {
                                            setFhirSent(2)
                                        }
                                    }}
                                >
                                    fhir bundle an hapi server schicken
                                </button>

                                {fhirSent===1 && (
                                    <p>
                                        fhir bundle wurde erfolgreich gesendet
                                    </p>
                                )}

                                {fhirSent===2 && (
                                    <p>
                                        fhir bundle konnte nicht gesendet werden
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
