/*
  Collects the user's basic personal information at the beginning of the assessment.

  Age and gender are always required. Pregnancy can be provided additionally
  if it is relevant based on the selected gender or cannot be ruled out.
*/

/* Shared styles for form fields, validation, and navigation. */
import assessmentStyles from "../Assessment.module.css";

/* Data model for the basic information and the assessment step type. */
import type { BasisData, Step } from "../../types/assessment";

/* Local state for immediate validation feedback. */
import { useState } from "react";


/*
  Properties for the BasisStartStep component.

  basisData:
  Contains the currently entered basic information.

  setBasisData:
  Updates the controlled input values stored in the shared state.

  onContinue:
  Continues to the body region selection during the normal workflow.

  checkInfoActive / setStep:
  Allows returning directly to the review step after editing the data.
*/
type BasisStartStepProps = {
  basisData: BasisData;
  setBasisData: (basisData: BasisData) => void;
  onContinue: () => void;
  checkInfoActive: boolean;
  setStep: (step: Step) => void;
};

//Form step for entering age, gender, and pregnancy if applicable.
export function BasisStartStep({
  basisData,
  setBasisData,
  onContinue,
  checkInfoActive,
  setStep
}: BasisStartStepProps) {
  /* Remains empty as long as the age is a whole number between 0 and 120. */
  const [ageError, setAgeError] = useState("");

  return (
    <>
      {/* Brief introduction before the basic information fields. */}
      <p className={assessmentStyles.text}>
        Bitte machen Sie zuerst einige allgemeine Angaben.
      </p>

      {/* Groups all general information into a separate formular section. */}
      <fieldset className={assessmentStyles.fieldset}>
        <legend className={assessmentStyles.legend}>
          Allgemeine Angaben
        </legend>

        {/* Uses a text field while inputMode opens the numeric keyboard on mobile devices. */}
        <label htmlFor="age-input" className={assessmentStyles.formLabel}>
          Alter
        </label>
        <input
          id="age-input"
          className={assessmentStyles.input}
          type="text"
          inputMode="numeric"
          aria-invalid={!!ageError}
          aria-describedby={ageError ? "age-error-msg" : undefined}
          value={basisData.age}
          onChange={(event) => {
            /* Stores the raw input value and validates it as a number. */
            const value = event.target.value;

            setBasisData({
              ...basisData,
              age: value,
            });
            //validates wether age is an integer between 0 and 120 
            const age = Number(value);
            if (
              value === "" ||
              Number.isNaN(age) ||
              !Number.isInteger(age) ||
              age < 0
              || age > 120) {
              setAgeError("Bitte geben Sie ein gültiges Alter ein.")
            } else {
              setAgeError("");
            }
          }}
          placeholder="Zum Beispiel: 25 (Neugeborene: 0)"
        />
        {ageError && (
          <p id="age-error-msg" className={assessmentStyles.errorText}>
            {ageError}
          </p>
        )}

        {/* The selected gender also determines whether the pregnancy field is shown. */}
        <label htmlFor="gender-select" className={assessmentStyles.formLabel}>
          Geschlecht
        </label>
        <select
          id="gender-select"
          className={assessmentStyles.input}
          value={basisData.gender}
          onChange={(event) =>
            setBasisData({
              ...basisData,
              gender: event.target.value,

              /*
                Keeps the current pregnancy value only if the selected
                gender still requires the additional question.
              */
              pregnancy:
                event.target.value === "weiblich" ||
                  event.target.value === "divers" ||
                  event.target.value === "keine Angabe"
                  ? basisData.pregnancy
                  : "",
            })
          }
        >
          <option value="">Bitte auswählen</option>
          <option value="weiblich">Weiblich</option>
          <option value="männlich">Männlich</option>
          <option value="divers">Divers</option>
          <option value="keine Angabe">Keine Angabe</option>
        </select>

        { /*
          Additional pregnancy selection.

          It is shown for the options "weiblich", "divers", and
          "keine Angabe". In the current validation logic,
          it is only mandatory when "female" is selected.
        */}
        {(
          basisData.gender === "weiblich" ||
          basisData.gender === "divers" ||
          basisData.gender === "keine Angabe"
        ) && (
          <>
            <label htmlFor="pregnancy-select" className={assessmentStyles.formLabel}>
              Schwangerschaft
            </label>
            <select
              id="pregnancy-select"
              className={assessmentStyles.input}
              value={basisData.pregnancy}
              onChange={(event) =>
                setBasisData({
                  ...basisData,
                  pregnancy: event.target.value,
                })
              }
            >
              <option value="">Bitte auswählen</option>
              <option value="ja">Ja</option>
              <option value="nein">Nein</option>
              <option value="keine Angabe">Keine Angabe</option>
            </select>
          </>
        )}
      </fieldset>

      {/* Continues to the body map during the normal assessment workflow. */}
      {!checkInfoActive && (
        <>
          <button
            type="button"
            className={assessmentStyles.primaryButton}
            onClick={onContinue}

            /*
              Navigation to the next step is only possible if all required
              fields are completed and the age is valid.
            */
            disabled={
              !basisData.age ||
              !basisData.gender ||
              (basisData.gender === "weiblich" &&
                !basisData.pregnancy) ||
              ageError !== ""
            }
          >
            Weiter zur Körperregion
          </button>
        </>
      )}

      {/* Skips the remaining workflow and returns to the review step. */}
      {checkInfoActive && (
        <button
          type="button"
          className={assessmentStyles.primaryButton}
          onClick={() => {
            setStep("checkInfo");
          }}
        >
          zurueck zur Überprüfung
        </button>
      )}
    </>
  );
}
