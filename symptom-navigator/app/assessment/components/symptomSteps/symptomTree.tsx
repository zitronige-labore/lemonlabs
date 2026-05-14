/*
  component for symptom tree
*/
"use client"

//css import
import assessmentStyles from "../../Assessment.module.css";

// import stmptom steps
import SymptomSelection from "./symptomSelection";
import SymptomCategory from "./symptomCategory";

// import needed types
import { Step, InputMode, SubRegion  } from "../../../types/assessment";

// define props/ get everything needed from page
interface SymptomTreeProps {
  inputMode: InputMode;
  setStep: (step: Step) => void;
  toggleSymptom: (symptom: string) => void;
  setInputMode: (inputMode: InputMode) => void;
  selectedSymptoms: string[];
  step: Step;
  selectedSubRegion: SubRegion | null;
}

export default function SymptomTree({step, selectedSubRegion, selectedSymptoms, inputMode, setStep, toggleSymptom, setInputMode}: SymptomTreeProps) {
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
                      >
                      </SymptomSelection>
              )
        }
    </>
  );
}