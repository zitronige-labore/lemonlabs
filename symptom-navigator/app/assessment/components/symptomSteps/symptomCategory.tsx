"use client"

//css import
import assessmentStyles from "../../Assessment.module.css";

// import needed types
import { Step, InputMode, SubRegion } from "../../../types/assessment";

// define props/ get everything needed from page
interface SymptomCategoryProps {
  categories: { category: string; step: Step }[];
  setStep: (step: Step) => void;
  setInputMode: (inputMode: InputMode) => void;
  selectedSubRegion: SubRegion | null;
}

export default function SymptomCategory({categories, setStep, setInputMode, selectedSubRegion}: SymptomCategoryProps) {
  return (
    <>
    <p className={assessmentStyles.text}>
                  Ausgewählte Region: <strong>selectedSubRegion</strong>
    </p>


    <fieldset className={assessmentStyles.fieldset}>
                  <legend className={assessmentStyles.legend}>
                    Wählen Sie eine Symptomkategorie
                  </legend>

                {/* one button for every category, button text is element.category, stept is set to element.step */}
                {categories.map((element) => 
                    (<button
                      key = {element.category}
                      type="button"
                      className={assessmentStyles.regionButton}
                      onClick={() => {
                        setStep(element.step);
                        setInputMode("select");
                      }}
                    >
                      {element.category}
                    </button>
                ))
                }
                <div className={assessmentStyles.quickSelect}>
                    <button
                      type="button"
                      className={assessmentStyles.regionButton}
                      onClick={() => {
                        setInputMode("text");
                        setStep("symptomInput");
                      }}
                    >
                      Freitext eingeben
                    </button>
                  </div>   
                </fieldset>
      </>
  );
}