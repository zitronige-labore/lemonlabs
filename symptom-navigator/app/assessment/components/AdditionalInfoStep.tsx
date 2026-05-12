/*
  Import von useState für lokale Validierungsfehler.
*/
import { useState } from "react";

/*
  Import der CSS-Module für den Assessment-Bereich.
*/
import assessmentStyles from "../Assessment.module.css";

/*
  Import des Typs für die optionalen Zusatzangaben.
*/
import type { AdditionalData } from "../../types/assessment";

/*
  Eigenschaften der AdditionalInfoStep-Komponente.

  additionalData:
  Enthält alle optionalen Zusatzangaben

  setAdditionalData:
  Funktion zum Aktualisieren der Zusatzangaben

  toggleCondition:
  Fügt Vorerkrankungen hinzu oder entfernt sie

  onSkip:
  Überspringt den Schritt
*/
type AdditionalInfoStepProps = {
  additionalData: AdditionalData;
  setAdditionalData: (data: AdditionalData) => void;
  toggleCondition: (condition: string) => void;
  onSkip: () => void;
};

/*
  Dieser Schritt sammelt optionale Zusatzinformationen,
  die bei der späteren Einschätzung hilfreich sein können.
*/
export function AdditionalInfoStep({
  additionalData,
  setAdditionalData,
  toggleCondition,
  onSkip,
}: AdditionalInfoStepProps) {
  /*
    Speichert mögliche Fehlermeldungen
    für das Allergie-Feld.
  */
  const [allergyError, setAllergyError] = useState("");

  /*
    Erlaubt Buchstaben, Leerzeichen,
    Kommas und Bindestriche.
  */
  const allergyPattern = /^[a-zA-ZäöüÄÖÜß,\-\s]*$/;

  return (
    <>
      {/* Beschreibung des optionalen Schritts */}
      <p className={assessmentStyles.text}>
        Optional: Diese Angaben können helfen, die Beschwerden besser
        einzuordnen. Sie können diesen Schritt auch überspringen.
      </p>

      {/* Formularbereich für Zusatzangaben */}
      <fieldset className={assessmentStyles.fieldset}>
        <legend className={assessmentStyles.legend}>
          Zusatzangaben
        </legend>

        {/* Medikamente */}
        <label className={assessmentStyles.formLabel}>
          Nehmen Sie aktuell Medikamente ein?

          <textarea
            className={assessmentStyles.input}
            value={additionalData.medications}
            onChange={(event) =>
              setAdditionalData({
                ...additionalData,
                medications: event.target.value,
              })
            }
            placeholder="Zum Beispiel: Ibuprofen, Blutdruckmedikamente..."
          />
        </label>

        {/* Gewicht */}
        <label className={assessmentStyles.formLabel}>
          Gewicht

          <input
            className={assessmentStyles.input}
            type="text"
            value={additionalData.weight}
            onChange={(event) =>
              setAdditionalData({
                ...additionalData,
                weight: event.target.value,
              })
            }
            placeholder="Zum Beispiel: 72 kg"
          />
        </label>

        {/* Größe */}
        <label className={assessmentStyles.formLabel}>
          Größe

          <input
            className={assessmentStyles.input}
            type="text"
            value={additionalData.height}
            onChange={(event) =>
              setAdditionalData({
                ...additionalData,
                height: event.target.value,
              })
            }
            placeholder="Zum Beispiel: 175 cm"
          />
        </label>

        {/* Stillzeit */}
        <label className={assessmentStyles.formLabel}>
          Stillzeit

          <select
            className={assessmentStyles.input}
            value={additionalData.breastfeeding}
            onChange={(event) =>
              setAdditionalData({
                ...additionalData,
                breastfeeding: event.target.value,
              })
            }
          >
            <option value="">Bitte auswählen</option>
            <option value="ja">Ja</option>
            <option value="nein">Nein</option>
            <option value="keine Angabe">Keine Angabe</option>
          </select>
        </label>

        {/* Vorerkrankungen */}
        <div className={assessmentStyles.formLabel}>
          Sind Vorerkrankungen bekannt?

          {[
            "Diabetes",
            "Bluthochdruck",
            "Herzkrankheit",
            "Asthma",
            "Allergien",
            "Keine bekannt",
          ].map((condition) => (
            <label
              key={condition}
              className={assessmentStyles.label}
            >
              <input
                type="checkbox"
                checked={additionalData.conditions.includes(condition)}
                onChange={() => toggleCondition(condition)}
              />

              {condition}
            </label>
          ))}
        </div>

        {/* Allergien */}
        <label className={assessmentStyles.formLabel}>
          Sind Allergien bekannt?

          <input
            className={assessmentStyles.input}
            type="text"
            maxLength={120}
            value={additionalData.allergies}
            onChange={(event) => {
              const value = event.target.value;

              if (!allergyPattern.test(value)) {
                setAllergyError(
                  "Bitte nur Buchstaben, Leerzeichen, Kommas und Bindestriche verwenden."
                );
                return;
              }

              setAllergyError("");

              setAdditionalData({
                ...additionalData,
                allergies: value,
              });
            }}
            placeholder="Zum Beispiel: Medikamente, Lebensmittel, Pollen..."
          />

          {/* Fehlermeldung bei ungültiger Eingabe */}
          {allergyError && (
            <p className={assessmentStyles.errorText}>
              {allergyError}
            </p>
          )}
        </label>

        {/* Fieber */}
        <label className={assessmentStyles.formLabel}>
          Haben Sie Fieber gemessen?

          <input
            className={assessmentStyles.input}
            type="text"
            value={additionalData.fever}
            onChange={(event) =>
              setAdditionalData({
                ...additionalData,
                fever: event.target.value,
              })
            }
            placeholder="Zum Beispiel: 38,5 °C oder nicht gemessen"
          />
        </label>

        {/* Verschlechterung */}
        <label className={assessmentStyles.formLabel}>
          Werden die Beschwerden stärker?

          <select
            className={assessmentStyles.input}
            value={additionalData.worsening}
            onChange={(event) =>
              setAdditionalData({
                ...additionalData,
                worsening: event.target.value,
              })
            }
          >
            <option value="">Bitte auswählen</option>
            <option value="ja">Ja</option>
            <option value="nein">Nein</option>
            <option value="unklar">Unklar</option>
          </select>
        </label>

        {/* Weitere Informationen */}
        <label className={assessmentStyles.formLabel}>
          Gibt es weitere wichtige Informationen?

          <textarea
            className={assessmentStyles.input}
            value={additionalData.extraInfo}
            onChange={(event) =>
              setAdditionalData({
                ...additionalData,
                extraInfo: event.target.value,
              })
            }
            placeholder="Zum Beispiel: Kontakt zu erkrankten Personen, kürzliche Reise, Unfall..."
          />
        </label>
      </fieldset>

      {/* Buttons */}
      <div className={assessmentStyles.quickSelect}>
        <button
          type="button"
          className={assessmentStyles.secondaryButton}
          onClick={onSkip}
        >
          Überspringen
        </button>

        <button
          type="submit"
          className={assessmentStyles.primaryButton}
        >
          Einschätzung abschließen
        </button>
      </div>
    </>
  );
}