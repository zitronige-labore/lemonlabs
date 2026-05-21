/*
  component for a reusable symptom selection page
*/
"use client"

//css import
import assessmentStyles from "../../Assessment.module.css";

// import needed types
import { Step, SubRegion } from "../../../types/assessment";
import { useState } from "react";

// imports to access setter functions from page
import type { Dispatch, SetStateAction } from "react";

// define props/ get everything needed from page
interface SymptomSelectionProps {
  symptoms: {symptomName: string, schmerzen: boolean, symptomValue: string}[];
  setStep: (step: Step) => void;
  setSelectedSymptoms: Dispatch<SetStateAction<string[]>>;
  toggleSymptom: (symptom: string, painscale?: string) => void;
  selectedSymptoms: string[];
  selectedSubRegion: SubRegion | null;
  setCopyPainScale:(copyPainScale:Record<string, string>) => void;
  copyPainScale: Record<string, string>;
}

export default function SymptomSelection({
  symptoms, 
  selectedSymptoms, 
  selectedSubRegion,
  copyPainScale,
  setSelectedSymptoms,
  setStep, 
  setCopyPainScale,
  toggleSymptom
  }: SymptomSelectionProps) {
  
  const [painscales, setPainscales] = useState<Record<string, string>>(copyPainScale);
  
  return (
    
    <>
    <fieldset className={assessmentStyles.fieldset}>
      <legend className={assessmentStyles.legend}>
        Wählen Sie Ihre Symptome
      </legend>

      {/* one box for every symptom */}
      {symptoms.map((element) => 
        (
          <div className={assessmentStyles.fieldset} key={element.symptomName}>
            <label className={assessmentStyles.label}>
              <input
                type="checkbox"
                id={element.symptomName}
                name= {element.symptomName}
                checked={selectedSymptoms.some((s) =>s.includes(`{"name": "${element.symptomValue}", "bodyRegion": "${selectedSubRegion}"`))}
                onChange={() => {
                    toggleSymptom(`{"name": "${element.symptomValue}", "bodyRegion": "${selectedSubRegion}"`,
                    painscales[element.symptomValue])
                    }}
                  >
                  </input>
                {element.symptomName}
              </label>
    

              {selectedSymptoms.some((s) =>s.includes(`{"name": "${element.symptomValue}", "bodyRegion": "${selectedSubRegion}"`)) && element.schmerzen && (
                <>
                  <p className={assessmentStyles.text}>
                    Wie stark sind Ihre Schmerzen?
                  </p>
                  {/* Anzeige des aktuellen Wertes */}
                  <strong className={assessmentStyles.text}>{painscales[element.symptomValue] || "nicht ausgewählt"}/10</strong>

                  <input
                    className={assessmentStyles.slider}
                    defaultValue={painscales[element.symptomValue]}
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    onChange={(event) => {
                    setPainscales((prev => ({
                      ...prev,
                      [element.symptomValue]: event.target.value
                    })));                  
                    }}
                  ></input>
                  <p className={assessmentStyles.sliderHint}>
                    0 = kein Schmerz · 10 = stärkster vorstellbarer Schmerz
                  </p>
                </>
                )
              }
          </div>
      ))                               
    }

    </fieldset>

    <button
        type="button"
        className={assessmentStyles.primaryButton}
        onClick={() => {
          setSelectedSymptoms((prev) =>
            prev.map((s) => {
              const match = symptoms.find((e) => s.includes(`"name": "${e.symptomValue}"`));
              if (match) {
                return `{"name": "${match.symptomValue}", "bodyRegion": "${selectedSubRegion}", "painscale": ${painscales[match.symptomValue] ?? null}}`;
              }
              return s;
            })
          );
          setCopyPainScale(painscales);
          setStep("selectMoreSymptoms"); 
        }}
      >
      Weiter
    </button>
    </>
  );
}