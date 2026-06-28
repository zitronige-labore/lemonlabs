/*
  Erfasst die grundlegenden Personendaten zu Beginn des Assessments.

  Alter und Geschlecht werden immer abgefragt. Eine Schwangerschaft kann
  zusätzlich angegeben werden, wenn sie anhand der Geschlechtsauswahl relevant
  oder nicht sicher auszuschließen ist.
*/

/* Gemeinsame Styles für Formularfelder, Validierung und Navigation. */
import assessmentStyles from "../Assessment.module.css";

/* Datenmodell der Basisangaben und Typ der zentralen Schrittnavigation. */
import type { BasisData, Step } from "../../types/assessment";

/* Lokaler Zustand für die unmittelbare Validierungsrückmeldung. */
import { useState } from "react";


/*
  Eigenschaften der BasisStartStep-Komponente.

  basisData:
  Enthält die aktuell eingegebenen Basisdaten

  setBasisData:
  Aktualisiert die kontrollierten Eingaben im zentralen Zustand.

  onContinue:
  Führt im regulären Ablauf zur Auswahl der Körperregion.

  checkInfoActive / setStep:
  Ermöglichen nach einer Korrektur den direkten Rücksprung zur Prüfansicht.
*/
type BasisStartStepProps = {
  basisData: BasisData;
  setBasisData: (basisData: BasisData) => void;
  onContinue: () => void;
  checkInfoActive: boolean;
  setStep: (step: Step) => void;
};

/* Formularschritt für Alter, Geschlecht und gegebenenfalls Schwangerschaft. */
export function BasisStartStep({
  basisData,
  setBasisData,
  onContinue,
  checkInfoActive,
  setStep
}: BasisStartStepProps) {
  /* Bleibt leer, solange das Alter eine ganze Zahl zwischen 0 und 120 ist. */
  const [ageError, setAgeError] = useState("");

  return (
    <>
      {/* Kurze Einordnung vor den kontrollierten Basisdatenfeldern. */}
      <p className={assessmentStyles.text}>
        Bitte machen Sie zuerst einige allgemeine Angaben.
      </p>

      {/* Zusammengehörige allgemeine Angaben als eigener Formularbereich. */}
      <fieldset className={assessmentStyles.fieldset}>
        <legend className={assessmentStyles.legend}>
          Allgemeine Angaben
        </legend>

        {/* Textfeld für den Rohwert; inputMode öffnet auf Mobilgeräten die Zahlentastatur. */}
        <label className={assessmentStyles.formLabel}>
          Alter

          <input
            className={assessmentStyles.input}
            type="text"
            inputMode="numeric"
            value={basisData.age}
            onChange={(event) => {
              /* Eingabe unverändert zentral speichern und numerisch validieren. */
              const value = event.target.value;


              setBasisData({
                ...basisData,
                age: value,
              });

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
            }
            } placeholder="Zum Beispiel: 25 (Neugeborene: 0)"
          />
          {ageError && (
            <p className={assessmentStyles.errorText}>
              {ageError}
            </p>
          )}

        </label>

        {/* Die Geschlechtsauswahl steuert zugleich die Schwangerschaftsabfrage. */}
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
                  Eine vorhandene Schwangerschaftsangabe bleibt nur erhalten,
                  solange die gewählte Option die Zusatzfrage weiterhin anzeigt.
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
          Zusätzliche Auswahl zur Schwangerschaft.

          Sie wird bei "weiblich", "divers" oder der Auswahl "Keine Angabe"
          angezeigt; im aktuellen Pflichtschema ist sie nur bei "weiblich" zwingend.
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

      {/* Im normalen Ablauf führt der Schritt anschließend zur Körperkarte. */}
      {!checkInfoActive && (
        <>
          <button
            type="button"
            className={assessmentStyles.primaryButton}
            onClick={onContinue}

            /*
              Nur vollständige Pflichtangaben und ein gültiges Alter erlauben
              die Navigation in den nächsten regulären Assessment-Schritt.
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

      {/* Im Korrekturmodus wird der restliche lineare Ablauf übersprungen. */}
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
