/*
  component for a reusable symptom selection page
*/
"use client"

//css import
import assessmentStyles from "../../Assessment.module.css";

// import needed types
import { Step, InputMode } from "../../../types/assessment";
import { useState } from "react";

// define props/ get everything needed from page
interface SymptomSelectionProps {
  symptoms: {symptomName: string, schmerzen: boolean, symptomValue: string}[];
  inputMode: InputMode;
  setStep: (step: Step) => void;
  toggleSymptom: (symptom: string) => void;
  selectedSymptoms: string[];
}

export default function SymptomSelection({
  symptoms, 
  selectedSymptoms, 
  inputMode, 
  setStep, 
  toggleSymptom
  }: SymptomSelectionProps) {
  
  const [painscale, setPainscale] = useState<string>("0");
  const [showpainscale, setShowPainscale] = useState<boolean>(false);
  
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
                        <>
                        <label key={element.symptomName}>{element.symptomName}
                        <input
                        type="checkbox"
                        id={element.symptomName}
                        name= {element.symptomName}
                        checked={selectedSymptoms.includes(element.symptomValue)}
                        className={assessmentStyles.regionButton}
                        onChange={() => {
                            toggleSymptom(element.symptomValue);
                            setShowPainscale(!showpainscale);
                            }}
                            >
                            </input>
                

                      { showpainscale && selectedSymptoms.includes(element.symptomValue) && element.schmerzen && (
                        <>
                        {/* Anzeige des aktuellen Wertes */}
                        <strong>{ painscale || "0"}/10</strong>

                        <input
                              className={assessmentStyles.slider}
                              type="range"
                              min="0"
                              max="10"
                              step="1"
                              //value={painscale}
                              onChange={(event) =>
                              setPainscale(painscale)                      
                              }
                        ></input>
                        </>
                        )
                      }
                      </label>
                        </>
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