/*
  component for symptom tree
*/
"use client"

//css import
import assessmentStyles from "../../Assessment.module.css";

// import stmptom steps
import SymptomSelection from "./symptomSelection";
import SymptomCategory from "./symptomCategory";

// imports to access setter functions from page
import type { Dispatch, SetStateAction } from "react";

// import needed types
import { Step, InputMode, SubRegion  } from "../../../types/assessment";

// define props/ get everything needed from page
interface SymptomTreeProps {
  inputMode: InputMode;
  setStep: (step: Step) => void;
  toggleSymptom: (symptom: string) => void;
  setInputMode: (inputMode: InputMode) => void;
  setSelectedSymptoms: Dispatch<SetStateAction<string[]>>;
  selectedSymptoms: string[];
  step: Step;
  selectedSubRegion: SubRegion | null;
  setCopyPainScale:(copyPainScale:Record<string, string>) => void;
  copyPainScale: Record<string, string>;
}

export default function SymptomTree({
  step, 
  selectedSubRegion, 
  selectedSymptoms, 
  inputMode, 
  copyPainScale,
  setSelectedSymptoms,
  setStep, 
  toggleSymptom, 
  setInputMode,
  setCopyPainScale
}: SymptomTreeProps) {
  return (
    
    <>
    {step === "Ohren" && (
                <SymptomCategory
                  categories={[{category: "innenohr", step: "innenOhr"},
                               {category: "aussenohr", step: "aussenOhr"}
                          ]}
                          setStep={setStep}
                          setInputMode={setInputMode}
                          selectedSubRegion={selectedSubRegion}
                >
                </SymptomCategory>
              )}
    
              {step === "aussenOhr" && (
                 <SymptomSelection
                          symptoms={[{symptomName: "autsch aussenohr", schmerzen: true, symptomValue: "starke Schmerzen am Aussenohr"},
                                     {symptomName: "autschi aussenohr", schmerzen: true, symptomValue: "Schmerzen am Aussenohr"}
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
    
              {step === "innenOhr" && (
                 <SymptomSelection
                          symptoms={[{symptomName: "autsch innennohr", schmerzen: true, symptomValue: "starke Schmerzen im Innnohr"},
                                     {symptomName: "autschi innenenohr", schmerzen: true, symptomValue: "Schmerzen im Innenohr"}
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
        }
    </>
  );
}