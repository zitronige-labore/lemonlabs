/*
  Component that asks whether the user wants to add more symptoms.

  It is shown after either entering a free-text symptom or selecting
  a predefined symptom. The user can either return to the body region
  selection or continue to the next appropriate step.
*/
"use client"

/*
  Styles for form elements, selection buttons, and vertical button groups.
*/
import assessmentStyles from "../Assessment.module.css";

/*
  Types for the central workflow navigation and body region selection.
*/
import { Step, MainRegion, SubRegion } from "../../types/assessment";

/*
  Props for the SelectMoreSymptoms component.

  setStep:
  Navigates to the next step in the assessment workflow.

  setSelectedMainRegion / setSelectedSubRegion:
  Reset the currently selected body region when the user wants
  to add another symptom in a different location.

  checkInfoActive:
  Indicates whether the user returned from the review screen.
  In that case, selecting "Nein" returns to the review instead of
  continuing to the additional information step.
*/
interface SelectMoreSymptomsProps {
  setStep: (step: Step) => void;
  setSelectedMainRegion: (mainRegion: MainRegion | null) => void;
  setSelectedSubRegion: (subRegion: SubRegion | null) => void;
  checkInfoActive: boolean;
}

/*
  Asks after each recorded symptom whether the user wants to add
  another symptom or continue with the existing information.
*/
export default function SelectMoreSymptoms({ setStep, setSelectedMainRegion, setSelectedSubRegion, checkInfoActive }: SelectMoreSymptomsProps) {
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
              /*
                Restart the body region selection for the next symptom
                to ensure that no previously selected region is reused.
              */
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
               /*
                If the user returned from the review screen,
                selecting "Nein" returns there. Otherwise,
                the assessment continues to the additional
                information step.
              */
              if (checkInfoActive) {
                setStep("checkInfo");
              }
              else {
                setStep("additionalInfo");
              }
            }}
          >
            nein
          </button>
        </div>
      </fieldset>
    </>
  );
}
