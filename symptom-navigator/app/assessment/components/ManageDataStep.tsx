import type { Step } from "../../types/assessment";
import homeStyles from "../../Home.module.css";
import { accessDataWithAccessCode, deleteDataOnAccessCode } from "../../actions";
import { useState } from "react";

type ManageDataStepProps = {
    step: Step;
    setStep: (step: Step) => void;
};

export function ManageDataStep({
        step,
        setStep     
    }: ManageDataStepProps) {

    const [data, setData] = useState<any | null>(null);
    const [code, setCode] = useState<string>("");

    let geschlecht = data?.caseData?.[0]?.sex;
    if (geschlecht === "m") {
        geschlecht = "männlich";
    } else if (geschlecht === "w") {
        geschlecht = "weiblich";
    }
    const alter = data?.caseData?.[0]?.age;
    let schwangerschaft = "nicht angegeben";
    if (data?.caseData?.[0]?.pregnancy === true) {
        schwangerschaft = "ja";
    } else if (data?.caseData?.[0]?.pregnancy === false) {
        schwangerschaft = "nein";
    }

    let stillzeit = "nicht angegeben";
    if (data?.caseData?.[0]?.lactation === true) {
        stillzeit = "ja";
    } else if (data?.caseData?.[0]?.lactation === false) {
        stillzeit = "nein";
    }
    let worsening;
    if (data?.additionalInfoData?.[0]?.worsening === true) {
        worsening = "ja";
    } else if (data?.additionalInfoData?.[0]?.worsening === false) {
        worsening = "nein";
    }

    return (
        <div style={{ marginTop: "20px", color: "black" }}>

            {data && (
                <div>
                    <h3>Abgerufene Daten:</h3>
                    <p>{"Geschlecht: " + geschlecht}</p>
                    <p>{"Alter: " + alter}</p>
                    <p>{"Groesse: " + data?.additionalInfoData?.[0]?.height + " cm"}</p>
                    <p>{"Gewicht: " + data?.additionalInfoData?.[0]?.weight + " kg"}</p>
                    {data?.additionalInfoData?.[0]?.temperature !== '' && data?.additionalInfoData?.[0]?.temperature !== null && (
                        <p>{"Temperatur: " + data?.additionalInfoData?.[0]?.temperature + " °C"}</p>
                    )}
                    <p>{data?.additionalInfoData?.[0]?.duration && "Dauer der Symptome: " + data?.additionalInfoData?.[0]?.duration + " Tage"}</p>
                    <p>{data?.additionalInfoData?.[0]?.worsening && "Symptome werden schlimmer: " + worsening}</p>
                    {geschlecht === "weiblich" && 
                    <p>{"schwanger: " + schwangerschaft}</p>
                    }
                    {geschlecht === "weiblich" && 
                    <p>{"Stillzeit: " + stillzeit}</p>
                    }
                    {data.symptomData != '' && data.symptomData != null && data.symptomData[0] != '' && (
                        <p>{"Symptome: " + data?.symptomData?.map((symptom: { name_de: string; bodyRegion: string, painscale?: string }) => 
                            ("Bezeichnung: " + symptom.name_de + ", Region: " + symptom.bodyRegion + ", Schmerzskala: " + (symptom.painscale || "nicht angegeben"))).join("\n, ")}</p>
                    )}
                    {data.textSymptomData != '' && data.textSymptomData != null && data.textSymptomData[0] != '' && (
                        <p>{"Symptome: " + data?.textSymptomData?.map((symptom: { raw_symptoms: string; bodyRegion: string, painscale?: string }) => 
                            ("Bezeichnung: " + symptom.raw_symptoms + ", Region: " + symptom.bodyRegion + ", Schmerzskala: " + (symptom.painscale || "nicht angegeben"))).join("\n, ")}</p>
                    )}
                    {data?.medicationData && (
                        <p>{"Medikation: " + data?.medicationData?.medication?.join(", ")}</p>
                    )}
                    {data?.allergyData && (
                        <p>{"Allergien: " + data?.allergyData?.allergies?.join(", ")}</p>
                    )}
                    {data?.conditionsData && (
                        <p>{"Vorerkrankungen: " + data?.conditionsData?.conditions?.join(", ")}</p>
                    )}
                </div>
            )}

            <label className={homeStyles.label} htmlFor="dataInput">
            code zum Abrufen oder Löschen der Daten eingeben:
            
            <input
            type="text"
            placeholder="code hier eingeben"
            onChange={(event) => {
                setCode(event.target.value.trim());
                }        
            }
            />

            <input
            type="submit"
            value="Abrufen"
            onClick={async () => {
                setData(await accessDataWithAccessCode(code));
            }}
            />

            <input
            type="submit"
            value="Löschen"
            onClick={async () => {
                await deleteDataOnAccessCode(code);
            }}
            />
            </label>
        </div>
    );
}