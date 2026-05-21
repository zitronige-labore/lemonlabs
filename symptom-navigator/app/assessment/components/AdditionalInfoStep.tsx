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

type AdditionalInfoStepProps = {
  additionalData: AdditionalData;
  setAdditionalData: (data: AdditionalData) => void;
  onSkip: () => void;
};

export function AdditionalInfoStep({
  additionalData,
  setAdditionalData,
  onSkip,
}: AdditionalInfoStepProps) {
  const [inputError, setInputError] = useState("");

  const Pattern = /^[^,]+(,[^,]+)*$/;

  const medicationValue =
    additionalData.medication || "";

  return (
    <>
      <p className={assessmentStyles.text}>
        Optional: Diese Angaben können helfen, die Beschwerden besser
        einzuordnen. Sie können diesen Schritt auch überspringen.
      </p>

      <fieldset className={assessmentStyles.fieldset}>
        <legend className={assessmentStyles.legend}>
          Zusatzangaben
        </legend>

        <label className={assessmentStyles.formLabel}>
          Nehmen Sie aktuell Medikamente ein?

          <input
            className={assessmentStyles.input}
            value={medicationValue}
            onChange={(event) => {
              const value = event.target.value;

              setAdditionalData({
                ...additionalData,
                medication: value
              });
            }}
            onBlur={(event) => {
              const value = event.target.value.trim();

              if (value === "" || Pattern.test(value)) {
                setInputError("");
              } else {
                setInputError(
                  "Bitte schreiben als: Medikament1, Medikament2, ..."
                );
              }
            }}
            placeholder="Zum Beispiel: Ibuprofen, Blutdruckmedikamente..."
          />
        </label>

        <label className={assessmentStyles.formLabel}>
          Gewicht in kg

          <input
            className={assessmentStyles.input}
            type="number"
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

        <label className={assessmentStyles.formLabel}>
          Größe in cm

          <input
            className={assessmentStyles.input}
            type="number"
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

        <div className={assessmentStyles.formLabel}>
          Sind Vorerkrankungen bekannt?

          {[
            "Diabetes",
            "Bluthochdruck",
            "Herzkrankheit",
            "Asthma",
          ].map((condition) => (
            <label key={condition} className={assessmentStyles.label}>
              <input
                type="checkbox"
                checked={additionalData.conditions.includes(condition)}
                onChange={() =>
                  setAdditionalData({
                    ...additionalData,
                    conditions: additionalData.conditions.includes(condition)
                      ? additionalData.conditions.replace(`${condition},`, "")
                      : additionalData.conditions + condition + ",",
                  })
                }
              />

              {condition}
            </label>
          ))}
        </div>

        <label className={assessmentStyles.formLabel}>
          Sind Allergien bekannt?

          <input
            className={assessmentStyles.input}
            type="text"
            maxLength={120}
            value={additionalData.allergies}
            onChange={(event) => {
              const value = event.target.value;

              setAdditionalData({
                ...additionalData,
                allergies: value,
              });
            }}
            onBlur={(event) => {
              const value = event.target.value.trim();

              if (value === "" || Pattern.test(value)) {
                setInputError("");
              } else {
                setInputError(
                  "Bitte schreiben als: Allergie1, Allergie2, ..."
                );
              }
            }}
            placeholder="Zum Beispiel: Medikamente, Lebensmittel, Pollen..."
          />

          {inputError && (
            <p className={assessmentStyles.errorText}>
              {inputError}
            </p>
          )}
        </label>

        <label className={assessmentStyles.formLabel}>
          Haben Sie Ihre Temperatur gemessen?

          <input
            className={assessmentStyles.input}
            type="number"
            step="0.01"
            value={additionalData.temperature}
            onChange={(event) =>
              setAdditionalData({
                ...additionalData,
                temperature: event.target.value,
              })
            }
            placeholder="Zum Beispiel: 38,5 °C oder nicht gemessen"
          />
        </label>

        <label className={assessmentStyles.formLabel}>
          Seit wie vielen Tagen haben Sie die Beschwerden?

          <input
            className={assessmentStyles.input}
            type="number"
            value={additionalData.duration}
            onChange={(event) =>
              setAdditionalData({
                ...additionalData,
                duration: event.target.value,
              })
            }
            placeholder="Zum Beispiel: 2"
          />
        </label>

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

      <div className={assessmentStyles.quickSelect}>
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
