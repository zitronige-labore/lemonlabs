/*
  component for a reusable symptom selection page
*/
"use client"

//css import
import assessmentStyles from "../../Assessment.module.css";

// import needed types
import { Step, InputMode } from "../../../types/assessment";

// define props/ get everything needed from page
interface SymptomSelectionProps {
  symptoms: {symptomName: string, schmerzen: boolean, symptomValue: string}[];
  inputMode: InputMode;
  setStep: (step: Step) => void;
  toggleSymptoms: (symptom: string) => void;
  selectedSymptoms: string[];
}

export default function SymptomSelection({symptoms,selectedSymptoms, inputMode, setStep, toggleSymptoms}: SymptomSelectionProps) {
  return (
    
    <>
    {inputMode === "select" && (
    <fieldset className={assessmentStyles.fieldset}>
                  <legend className={assessmentStyles.legend}>
                    Wählen Sie eine Symptome
                  </legend>

                {/* one box for every symptom */}
                {symptoms.map((element) => 
                    (
                        <label key={element.symptomName}>{element.symptomName}
                        <input
                        type="checkbox"
                        id={element.symptomName}
                        name= {element.symptomName}
                        className={assessmentStyles.regionButton}
                        onChange={() => {
                            toggleSymptoms(element.symptomValue);
                            }}
                            >
                            </input>
                            </label>
                ))
                }  
                </fieldset>
    )}

    <button
        type="button"
        className={assessmentStyles.primaryButton}
        onClick={() => setStep("basisDetails")}
                >
                  Weiter
    </button>
    </>
  );
}