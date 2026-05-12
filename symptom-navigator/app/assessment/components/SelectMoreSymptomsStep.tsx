/*
  component for choice of selecting another symptom
*/
"use client"

//css import
import assessmentStyles from "../Assessment.module.css";

// import needed types
import { Step, MainRegion, SubRegion } from "../../types/assessment";

// define props/ get everything needed from page
interface SelectMoreSymptomsProps {
  setStep: (step: Step) => void;
  setSelectedMainRegion: (mainRegion: MainRegion | null) => void;
  setSelectedSubRegion: (subRegion: SubRegion | null) => void;
}

export default function SelectMoreSymptoms({setStep, setSelectedMainRegion, setSelectedSubRegion}: SelectMoreSymptomsProps) {
  return (
    <>

    <fieldset className={assessmentStyles.fieldset}>
                  <legend className={assessmentStyles.legend}>
                    Wollen Sie noch mehr Symptome angeben?
                  </legend>

                <div className={assessmentStyles.quickSelect}>
                    <button
                      type="button"
                      className={assessmentStyles.regionButton}
                      onClick={() => {
                        setStep("bodyRegion");
                        setSelectedMainRegion(null);
                        setSelectedSubRegion(null);
                      }}
                    >
                      ja
                    </button>

                    <button
                      type="button"
                      className={assessmentStyles.regionButton}
                      onClick={() => {
                        setStep("additionalInfo");
                      }}
                    >
                      nein
                    </button>
                  </div>   
                </fieldset>
      </>
  );
}