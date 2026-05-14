/*
  component for a reusable symptom selection page
*/
"use client"

//css import
import assessmentStyles from "../../Assessment.module.css";

// import needed types
import { Step, InputMode, SubRegion } from "../../../types/assessment";
import { useState } from "react";

// define props/ get everything needed from page
interface SymptomSelectionProps {
  symptoms: {symptomName: string, schmerzen: boolean, symptomValue: string}[];
  inputMode: InputMode;
  setStep: (step: Step) => void;
  toggleSymptom: (symptom: string, painscale?: string) => void;
  selectedSymptoms: string[];
  selectedSubRegion: SubRegion | null;
}

export default function SymptomSelection({
  symptoms, 
  selectedSymptoms, 
  inputMode, 
  selectedSubRegion,
  setStep, 
  toggleSymptom
  }: SymptomSelectionProps) {
  
  const [painscales, setPainscales] = useState<Record<string, string>>({});
  
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
                        <div className={assessmentStyles.fieldset} key={element.symptomName}>
                        <label className={assessmentStyles.formLabel}>{element.symptomName}
                        <input
                        type="checkbox"
                        id={element.symptomName}
                        name= {element.symptomName}
                        checked={selectedSymptoms.some((s) =>s.includes(`{"name": "${element.symptomValue}", "bodyRegion": "${selectedSubRegion}"`))}
                        className={assessmentStyles.regionButton}
                        onChange={() => {
                            toggleSymptom(`{"name": "${element.symptomValue}", "bodyRegion": "${selectedSubRegion}"`,
                            painscales[element.symptomValue])
                            }}
                            >
                            </input>
                        </label>
                

                      {selectedSymptoms.some((s) =>s.includes(`{"name": "${element.symptomValue}", "bodyRegion": "${selectedSubRegion}"`)) && element.schmerzen && (
                        <>
                        {/* Anzeige des aktuellen Wertes */}
                        <strong>{painscales[element.symptomValue] || 0}/10</strong>

                        <input
                              className={assessmentStyles.slider}
                              type="range"
                              min="0"
                              max="10"
                              step="1"
                              onChange={(event) =>
                              setPainscales((prev => ({
                                ...prev,
                                [element.symptomValue]: event.target.value
                             })))                      
                              }
                        ></input>
                        </>
                        )
                      }
                      </div>
                  ))                               
                }

                </fieldset>
    )}

    <button
        type="button"
        className={assessmentStyles.primaryButton}
        onClick={() => setStep("selectMoreSymptoms")}
                >
                  Weiter
    </button>
    </>
  );
}