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
import type { AdditionalData, Step } from "../../types/assessment";

import {
  validateWeight,
  validateHeight,
  validateTemperature,
  validateDuration,
  validateListFormat
} from "../utils/validationUtils";

type AdditionalInfoStepProps = {
  additionalData: AdditionalData;
  setAdditionalData: (data: AdditionalData) => void;
  onSkip: () => void;
  setStep: (step: Step) => void;
  checkInfoActive: boolean;
};

export function AdditionalInfoStep({
  additionalData,
  setAdditionalData,
  onSkip,
  setStep,
  checkInfoActive
}: AdditionalInfoStepProps) {
  const [inputError, setInputError] = useState("");

  const [weightError, setWeightError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [temperatureError, setTemperatureError] = useState("");
  const [durationError, setDurationError] = useState("");

  const medicationValue =
    additionalData.medication || "";

  return (
    <>
      <p className={assessmentStyles.optionalHint}>
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
              const value = event.target.value;
              if (validateListFormat(value)) {
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
            onChange={(event) => {
              const value = event.target.value;
              setAdditionalData({
                ...additionalData,
                weight: value,
              });
              setWeightError(validateWeight(value));
            }
            } placeholder="Zum Beispiel: 72 kg"
          />
          {weightError && (
            <p className={assessmentStyles.errorText}>
              {weightError}
            </p>
          )}

        </label>

        <label className={assessmentStyles.formLabel}>
          Größe in cm

          <input
            className={assessmentStyles.input}
            type="number"
            value={additionalData.height}
            onChange={(event) => {
              const value = event.target.value;
              setAdditionalData({
                ...additionalData,
                height: value,
              });
              setHeightError(validateHeight(value));
            }
            } placeholder="Zum Beispiel: 175 cm"
          />
          {heightError && (
            <p className={assessmentStyles.errorText}>
              {heightError}
            </p>
          )}

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
            "Diabetes Typ 1",
            "Diabetes Typ 2",
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
            onChange={(event) => {
              const value = event.target.value;
              setAdditionalData({
                ...additionalData,
                temperature: value,
              });
              setTemperatureError(validateTemperature(value));
            }}
            placeholder="Zum Beispiel: 38,5 °C"
          />

          {temperatureError && (
            <p className={assessmentStyles.errorText}>
              {temperatureError}
            </p>
          )}

        </label>

        <label className={assessmentStyles.formLabel}>
          Seit wie vielen Tagen haben Sie die Beschwerden?

          <input
            className={assessmentStyles.input}
            type="number"
            value={additionalData.duration}
            onChange={(event) => {
              const value = event.target.value;
              setAdditionalData({
                ...additionalData,
                duration: value,
              });
              setDurationError(validateDuration(value));
            }
            } placeholder="Zum Beispiel: 2"
          />

            {durationError && (
            <p className={assessmentStyles.errorText}>
              {durationError}
            </p>
          )}

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
            maxLength={500}
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
        {!checkInfoActive && (
          <button
            type="button"
            className={assessmentStyles.primaryButton}
            onClick={() => {
              setStep("checkInfo");
            }}
          >
            weiter
          </button>
        )}
        {checkInfoActive && (
          <button
            type="button"
            className={assessmentStyles.secondaryButton}
            onClick={() => setStep("checkInfo")}
          >
            zurück zur Überprüfung
          </button>
        )}
      </div>
    </>
  );
}
