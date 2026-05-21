/*
  component for a reusable symptom category page
*/
"use client"

//css import
import assessmentStyles from "../../Assessment.module.css";

// import needed types
import { Step, SubRegion } from "../../../types/assessment";

// define props/ get everything needed from page
interface SymptomCategoryProps {
  categories: { category: string; step: Step }[];
  setStep: (step: Step) => void;
  selectedSubRegion: SubRegion | null;
}

export default function SymptomCategory({categories, 
  setStep, 
  selectedSubRegion
}: SymptomCategoryProps) {
  return (
    <>
    <p className={assessmentStyles.selectedText}>
                  Ausgewählte Region: <strong>selectedSubRegion</strong>
    </p>


    <fieldset className={assessmentStyles.fieldset}>
      <legend className={assessmentStyles.legend}>
        Wählen Sie eine Symptomkategorie
      </legend>
        <div className={assessmentStyles.quickSelect}>
          {/* one button for every category, button text is element.category, stept is set to element.step */}
          {categories.map((element) => 
              (<button
                key = {element.category}
                type="button"
                className={assessmentStyles.regionButton}
                onClick={() => {
                  setStep(element.step);
                }}
              >
                {element.category}
              </button>
          ))
          }
          <button
            type="button"
            className={assessmentStyles.regionButton}
            onClick={() => {
              setStep("textInput");
            }}
          >
            sonstiges
          </button>
        </div>
      </fieldset>
    </>
  );
}