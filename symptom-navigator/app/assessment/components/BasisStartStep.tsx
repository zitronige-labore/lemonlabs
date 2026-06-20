/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

/*
  Import des Typs für allgemeine Nutzerdaten
  und Beschwerdeinformationen.
*/
import type { BasisData, Step } from "../../types/assessment";
import { useState } from "react";


/*
  Eigenschaften der BasisStartStep-Komponente.

  basisData:
  Enthält die aktuell eingegebenen Basisdaten

  setBasisData:
  Funktion zum Aktualisieren der Basisdaten

  onContinue:
  Funktion zum Wechseln zum nächsten Schritt
*/
type BasisStartStepProps = {
  basisData: BasisData;
  setBasisData: (basisData: BasisData) => void;
  onContinue: () => void;
  checkInfoActive: boolean;
  setStep: (step: Step) => void;
};

/*
  Dieser Schritt sammelt allgemeine Angaben
  zur Nutzerin oder zum Nutzer.

  Dazu gehören:
  - Alter
  - Geschlecht
  - Schwangerschaft oder Stillzeit
*/
export function BasisStartStep({
  basisData,
  setBasisData,
  onContinue,
  checkInfoActive,
  setStep
}: BasisStartStepProps) {
  const [ageError, setAgeError] = useState("");

  return (
    <>
      {/* Beschreibung des aktuellen Schritts */}
      <p className={assessmentStyles.text}>
        Bitte machen Sie zuerst einige allgemeine Angaben.
      </p>

      {/* Formularbereich für allgemeine Angaben */}
      <fieldset className={assessmentStyles.fieldset}>
        <legend className={assessmentStyles.legend}>
          Allgemeine Angaben
        </legend>

        {/* Eingabe des Alters */}
        <label className={assessmentStyles.formLabel}>
          Alter

          <input
            className={assessmentStyles.input}
            type="number"
            min="0"
            max="120"
            value={basisData.age}
            onChange={(event) => {
              const value = event.target.value; //holt Benutzereingabe


              setBasisData({ //Eingabe speichern
                ...basisData,
                age: value,
              });

              const age = Number(value); //cast in zahl 
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
            }
            } placeholder="Zum Beispiel: 25 (Neugeborene: 0)"
          />
          {ageError && (
            <p className={assessmentStyles.errorText}>
              {ageError}
            </p>
          )}

        </label>

        {/* Auswahl des Geschlechts */}
        <label className={assessmentStyles.formLabel}>
          Geschlecht

          <select
            className={assessmentStyles.input}
            value={basisData.gender}
            onChange={(event) =>
              setBasisData({
                ...basisData,
                gender: event.target.value,

                /*
                  Schwangerschaft wird nur gespeichert,
                  wenn "weiblich" oder "divers" "keine Angabe" ausgewählt ist.
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
        </label>

        {/*
          Zusätzliche Auswahl für Schwangerschaft oder Stillzeit.

          Dieser Bereich wird nur angezeigt,
          wenn "weiblich" oder "divers" oder "keine Angabe" ausgewählt wurde.
        */}
        {(
          basisData.gender === "weiblich" ||
          basisData.gender === "divers" ||
          basisData.gender === "keine Angabe" 
        ) && (
            <label className={assessmentStyles.formLabel}>
              Schwangerschaft

              <select
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
            </label>
          )}
      </fieldset>

      {!checkInfoActive && (
        <>
          {/* Button zum Wechsel zur Körperregion-Auswahl */}
          <button
            type="button"
            className={assessmentStyles.primaryButton}
            onClick={onContinue}

            /*
              Der Button bleibt deaktiviert,
              solange Pflichtangaben fehlen.
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