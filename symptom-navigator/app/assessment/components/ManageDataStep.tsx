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

    return (
        <div style={{ marginTop: "20px", color: "black" }}>

            {data && (
                <div>
                    <h3>Abgerufene Daten:</h3>
                    <p>{data.caseData?.[0]?.sex}</p>
                    <p>{data.caseData?.[0]?.age}</p>
                    <p>{data.caseData?.[0]?.pregnancy?.toString()}</p>
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