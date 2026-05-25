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

    return (
        <>

            {data && (
                <div>
                    <h3>Abgerufene Daten:</h3>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}

            <label className={homeStyles.label} htmlFor="dataInput">
            Daten abrufen:
            
            <input
            type="text"
            placeholder="code hier eingeben"
            onChange={(event) => {
                const value = event.target.value.trim();
                setData(accessDataWithAccessCode(value));
                }        
            }
            />
            </label>

            <label className={homeStyles.label} htmlFor="dataInput">
            Daten loeschen:
            
            <input
            type="text"
            placeholder="code hier eingeben"
            />
            </label>
        </>
    );
}