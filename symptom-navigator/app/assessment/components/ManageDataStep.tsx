import type { Step } from "../../types/assessment";
import assessmentStyles from "../Assessment.module.css";
import { accessDataWithAccessCode, deleteDataOnAccessCode, accessAiDataWithAccessCode } from "../../actions";
import { useState } from "react";

type ManageDataStepProps = {
    step: Step;
    setStep: (step: Step) => void;
};

export function ManageDataStep({ step, setStep }: ManageDataStepProps) {

    // state to store retrieved data and access code
    const [data, setData] = useState<any | null>(null);
    const [aiData, setAiData] = useState<any | null>(null);
    const [code, setCode] = useState<string>("");


    // convert coded values to be read by users if necessary

    let geschlecht = data?.caseData?.[0]?.sex;
    if (geschlecht === "m") {
        geschlecht = "männlich";
    } else if (geschlecht === "w") {
        geschlecht = "weiblich";
    }

    let schwangerschaft = "nicht angegeben";
    if (data?.caseData?.[0]?.pregnancy === true) schwangerschaft = "ja";
    else if (data?.caseData?.[0]?.pregnancy === false) schwangerschaft = "nein";

    let stillzeit = "nicht angegeben";
    if (data?.caseData?.[0]?.lactation === true) stillzeit = "ja";
    else if (data?.caseData?.[0]?.lactation === false) stillzeit = "nein";

    let worsening: string | undefined;
    if (data?.additionalInfoData?.[0]?.worsening === true) worsening = "ja";
    else if (data?.additionalInfoData?.[0]?.worsening === false) worsening = "nein";

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
                <div className={assessmentStyles.label}>
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
                        {geschlecht === "weiblich" && (
                            <p>Schwanger: <strong>{schwangerschaft}</strong></p>
                        )}
                        {geschlecht === "weiblich" && (
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
                            <p className={assessmentStyles.selectedText}>Selbst beschriebene Symptome</p>
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
                </>
            )}
        </div>
    );
}