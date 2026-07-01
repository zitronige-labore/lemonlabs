"use client";

/*
  Optional details form shown before the final review step.

  It collects medication, medical conditions, allergies, lifestyle information,
  and additional health data. When a section is enabled, the corresponding
  details become required, even though this entire step is optional.
*/

/* Shared styles for form fields, dynamic lists, and validation messages. */
import assessmentStyles from "../Assessment.module.css";

/* Data models for additional information, medication entries, and navigation. */
import type { AdditionalData, MedicationEntry, Step } from "../../types/assessment";

/* Local state for field-specific validation errors. */
import { useState } from "react";



/* Shared validation helpers for the different additional information fields. */
import {
  validateWeight,
  validateHeight,
  validateTemperature,
  validateDuration,
  validateListFormat
} from "../utils/validationUtils";

/*
  additionalData / setAdditionalData:
  Read and update all additional information stored in the central assessment state.

  setStep / checkInfoActive:
  Navigate to the review step and distinguish between the normal workflow
  and edit mode.

  onSkip:
  Reserved for a dedicated skip action, although it is currently not
  offered as a separate option in this view.
*/
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

  /* Individual validation messages for the numeric input fields. */
  const [weightError, setWeightError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [temperatureError, setTemperatureError] = useState("");
  const [durationError, setDurationError] = useState("");
  const [cigarettesError, setCigarettesError] = useState("");
  const [alcoholError, setAlcoholError] = useState("");

  /* Dynamic medication entries require separate validation per list item. */
  const [doseError, setDoseError] = useState<Record<number, string>>({});
  const [frequencyError, setFrequencyError] = useState<Record<number, string>>({});

  /*
   Combines validation errors and conditional required fields into a single
   navigation check. Sections that are not enabled do not block progress.
 */
  const noErrors =
    Object.values(doseError).every(error => error === "") &&
    Object.values(frequencyError).every(error => error === "") &&
    cigarettesError === "" &&
    alcoholError === "" &&
    weightError === "" &&
    heightError === "" &&
    temperatureError === "" &&
    durationError === "" &&
    /* Active sections must not contain programmatically detected missing values. */
    (!additionalData.hasMedication || (additionalData.medication ?? []).every(entry =>
      entry.name.trim() !== "" &&
      entry.dose.trim() !== "" &&
      entry.unit !== "" &&
      entry.frequency.trim() !== "" &&
      entry.frequencyUnit !== ""
    )) &&
    (!additionalData.hasConditions ||
      additionalData.conditions.every(c => c.trim() !== "")) &&
    (!additionalData.smokescigarettes ||
      additionalData.cigarettesPerDay.trim() !== "") &&
    (!additionalData.drinksAlcohol ||
      additionalData.alcoholPerWeek.trim() !== "") &&
    (!additionalData.hasAllergies ||
      additionalData.allergies.every(a => a.trim() !== ""));


  /* Returns the first validation message shown when the Continue button is disabled. */
  function getValidationHint(): string | null {
    if (additionalData.hasMedication) {
      const incomplete = (additionalData.medication ?? []).some(entry =>
        entry.name.trim() === "" ||
        entry.dose.trim() === "" ||
        entry.unit === "" ||
        entry.frequency.trim() === "" ||
        entry.frequencyUnit === ""
      );
      if (incomplete) return "Bitte alle Pflichtfelder der Medikamente ausfüllen oder leere Einträge entfernen..";
    }
    if (additionalData.hasConditions && additionalData.conditions.some(c => c.trim() === ""))
      return "Bitte alle Vorerkrankungen ausfüllen oder leere Einträge entfernen.";
    if (additionalData.smokescigarettes && additionalData.cigarettesPerDay.trim() === "")
      return "Bitte Anzahl Zigaretten pro Tag angeben oder leere Einträge entfernen..";
    if (additionalData.drinksAlcohol && additionalData.alcoholPerWeek.trim() === "")
      return "Bitte Anzahl Getränke pro Woche angeben oder leere Einträge entfernen.";
    if (additionalData.hasAllergies && additionalData.allergies.some(a => a.trim() === ""))
      return "Bitte alle Allergien ausfüllen oder leere Einträge entfernen.";
    if (Object.values(doseError).some(e => e !== ""))
      return "Bitte eine gültige Dosis angeben.";
    if (Object.values(frequencyError).some(e => e !== ""))
      return "Bitte eine gültige Einnahmehäufigkeit angeben.";
    if (cigarettesError) return cigarettesError;
    if (alcoholError) return alcoholError;
    if (weightError) return weightError;
    if (heightError) return heightError;
    if (temperatureError) return temperatureError;
    if (durationError) return durationError;
    return null;
  }

  /* Updates a single field of one medication entry without modifying the others. */
  function updateMedication(index: number, field: keyof MedicationEntry, value: string) {
    const updated = additionalData.medication?.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    setAdditionalData({ ...additionalData, medication: updated });
  }

  /* Adds a new empty medication entry to the dynamic list. */
  function addMedication() {
    setAdditionalData({
      ...additionalData, medication: [
        ...(additionalData.medication ?? []),
        { name: "", dose: "", unit: "", frequency: "", frequencyUnit: "", since: "" }
      ]
    });
  }

  /* Removes only the medication entry at the specified list index. */
  function removeMedication(index: number) {
    setAdditionalData({
      ...additionalData,
      medication: additionalData.medication?.filter((_, i) => i !== index)
    });
  }

  /* Helper functions for the dynamic list of medical conditions. */
  function updateCondition(index: number, value: string) {
    const updated = additionalData.conditions.map((c, i) => i === index ? value : c);
    setAdditionalData({ ...additionalData, conditions: updated });
  }

  function addCondition() {
    setAdditionalData({
      ...additionalData,
      conditions: [...additionalData.conditions, ""]
    });
  }

  function removeCondition(index: number) {
    setAdditionalData({
      ...additionalData,
      conditions: additionalData.conditions.filter((_, i) => i !== index)
    });
  }

  /* Helper functions for the dynamic list of allergies. */
  function updateAllergy(index: number, value: string) {
    const updated = additionalData.allergies.map((c, i) => i === index ? value : c);
    setAdditionalData({ ...additionalData, allergies: updated });
  }

  function addAllergy() {
    setAdditionalData({
      ...additionalData,
      allergies: [...additionalData.allergies, ""]
    });
  }

  function removeAllergy(index: number) {
    setAdditionalData({
      ...additionalData,
      allergies: additionalData.allergies.filter((_, i) => i !== index)
    });
  }

  return (
    <>
      {/* This entire step can be completed without providing additional information. */}
      <p className={assessmentStyles.optionalHint}>
        Optional: Diese Angaben können helfen, die Beschwerden besser
        einzuordnen. Sie können diesen Schritt auch überspringen.
      </p>

      <fieldset className={assessmentStyles.fieldset}>
        <legend className={assessmentStyles.legend}>Zusatzangaben</legend>

        {/*
          Medication is managed as a repeatable input section.
          Enabling it automatically creates the first entry, while
          existing entries are preserved.
        */}
        <label htmlFor="has-medication-checkbox" className={assessmentStyles.checkboxLabel}>
          <input
            id="has-medication-checkbox"
            type="checkbox"
            checked={additionalData.hasMedication ?? false}
            onChange={(e) =>
              setAdditionalData({
                ...additionalData,
                hasMedication: e.target.checked,
                medication: e.target.checked && additionalData.medication?.length === 0
                  ? [{ name: "", dose: "", unit: "", frequency: "", frequencyUnit: "", since: "" }]
                  : additionalData.medication
              })
            }
          />
          Einnahme von Medikamenten
        </label>

        {additionalData.hasMedication && (
          <div className={assessmentStyles.expandedSection}>
            {additionalData.medication?.map((entry, index) => (
              <div key={index} className={assessmentStyles.medicationEntry}>
                {(additionalData.medication?.length ?? 0) > 1 && (
                  <button
                    type="button"
                    className={assessmentStyles.removeButton}
                    onClick={() => removeMedication(index)}
                    aria-label="Medikament entfernen"
                  >✕</button>
                )}

                <label htmlFor={`med-name-${index}`} className={assessmentStyles.fullWidth}>
                  Medikament*
                  <input
                    id={`med-name-${index}`}
                    className={assessmentStyles.input}
                    placeholder="z. B. Ibuprofen"
                    value={entry.name}
                    required
                    onChange={(e) => updateMedication(index, "name", e.target.value)}
                  />
                </label>

                <label htmlFor={`med-dose-${index}`}>
                  Dosis*
                  <input
                    id={`med-dose-${index}`}
                    className={assessmentStyles.input}
                    type="text"
                    inputMode="numeric"
                    required
                    aria-invalid={!!doseError[index]}
                    aria-describedby={doseError[index] ? `med-dose-error-${index}` : undefined}
                    placeholder="z. B. 400"
                    value={entry.dose}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateMedication(index, "dose", value);
                      const n = Number(value);
                      setDoseError(prev => ({
                        ...prev,
                        [index]: value !== "" && (!Number.isFinite(n) || !Number.isInteger(n) || n < 0)
                          ? "Bitte eine gültige Dosis angeben." : ""
                      }));
                    }}
                  />
                  {doseError[index] && <p id={`med-dose-error-${index}`} className={assessmentStyles.errorText}>{doseError[index]}</p>}
                </label>

                <label htmlFor={`med-unit-${index}`}>
                  Einheit*
                  <select
                    id={`med-unit-${index}`}
                    required
                    className={assessmentStyles.input}
                    value={entry.unit}
                    onChange={(e) => updateMedication(index, "unit", e.target.value)}
                  >
                    <option value="">Bitte auswählen</option>
                    <option value="mg">mg</option>
                    <option value="g">g</option>
                    <option value="µg">µg</option>
                    <option value="ml">ml</option>
                    <option value="IE">IE</option>
                    <option value="Tropfen">Tropfen</option>
                    <option value="Stück">Stück</option>
                  </select>
                </label>

                <label htmlFor={`med-freq-${index}`}>
                  Wie oft*
                  <input
                    id={`med-freq-${index}`}
                    className={assessmentStyles.input}
                    required
                    type="text"
                    inputMode="numeric"
                    aria-invalid={!!frequencyError[index]}
                    aria-describedby={frequencyError[index] ? `med-freq-error-${index}` : undefined}
                    placeholder="z. B. 3"
                    value={entry.frequency}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateMedication(index, "frequency", value);
                      const n = Number(value);
                      setFrequencyError(prev => ({
                        ...prev,
                        [index]: value !== "" && (!Number.isInteger(n) || n < 0)
                          ? "Bitte gültige Einnahmehäufigkeit angeben." : ""
                      }));
                    }}
                  />
                  {frequencyError[index] && <p id={`med-freq-error-${index}`} className={assessmentStyles.errorText}>{frequencyError[index]}</p>}
                </label>

                <label htmlFor={`med-freq-unit-${index}`}>
                  pro*
                  <select
                    id={`med-freq-unit-${index}`}
                    required
                    className={assessmentStyles.input}
                    value={entry.frequencyUnit}
                    onChange={(e) => updateMedication(index, "frequencyUnit", e.target.value)}
                  >
                    <option value="">Bitte auswählen</option>
                    <option value="Tag">Tag</option>
                    <option value="Woche">Woche</option>
                    <option value="Monat">Monat</option>
                    <option value="Bedarf">Bedarf</option>
                  </select>
                </label>

                <label htmlFor={`med-since-${index}`} className={assessmentStyles.fullWidth}>
                  seit wann*
                  <input
                    id={`med-since-${index}`}
                    required
                    className={assessmentStyles.input}
                    type="date"
                    value={entry.since}
                    onChange={(e) => updateMedication(index, "since", e.target.value)}
                  />
                </label>
              </div>
            ))}

            <button
              type="button"
              className={assessmentStyles.addButton}
              onClick={addMedication}
            >
              + Medikament hinzufügen
            </button>
          </div>
        )}

        {/* Pre-existing conditions as a dynamic list with at least one entry when enabled. */}
        <label htmlFor="has-conditions-checkbox" className={assessmentStyles.checkboxLabel}>
          <input
            id="has-conditions-checkbox"
            type="checkbox"
            checked={additionalData.hasConditions ?? false}
            onChange={(e) =>
              setAdditionalData({
                ...additionalData,
                hasConditions: e.target.checked,
                conditions: e.target.checked && additionalData.conditions.length === 0
                  ? [""]
                  : additionalData.conditions
              })
            }
          />
          Es liegen Vorerkrankungen vor
        </label>

        {additionalData.hasConditions && (
          <div className={assessmentStyles.expandedSection}>
            {additionalData.conditions.map((condition, index) => (
              <div key={index} className={assessmentStyles.listEntry}>
                <label htmlFor={`condition-input-${index}`} className="sr-only">
                  Vorerkrankung {index + 1}
                </label>
                <input
                  id={`condition-input-${index}`}
                  className={assessmentStyles.input}
                  placeholder="Vorerkrankung (z. B. Diabetes, Bluthochdruck)"
                  value={condition}
                  onChange={(e) => updateCondition(index, e.target.value)}
                />
                {additionalData.conditions.length > 1 && (
                  <button
                    type="button"
                    className={assessmentStyles.removeButton}
                    onClick={() => removeCondition(index)}
                    aria-label={`Vorerkrankung ${index + 1} entfernen`}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className={assessmentStyles.addButton}
              onClick={addCondition}
            >
              + Vorerkrankung hinzufügen
            </button>
          </div>
        )}

        {/* Smoking status with a conditionally required and limited daily amount. */}
        <label htmlFor="smokes-checkbox" className={assessmentStyles.checkboxLabel}>
          <input
            id="smokes-checkbox"
            type="checkbox"
            checked={additionalData.smokescigarettes ?? false}
            onChange={(e) =>
              setAdditionalData({ ...additionalData, smokescigarettes: e.target.checked, cigarettesPerDay: "" })
            }
          />
          Zigaretten
        </label>

        {additionalData.smokescigarettes && (
          <div className={assessmentStyles.expandedSection}>
            <label htmlFor="cigarettes-input" className={assessmentStyles.formLabel}>
              Wie viele Zigaretten pro Tag?
            </label>
            <input
              id="cigarettes-input"
              className={assessmentStyles.input}
              type="text"
              inputMode="numeric"
              aria-invalid={!!cigarettesError}
              aria-describedby={cigarettesError ? "cigarettes-error" : undefined}
              placeholder="z. B. 10"
              value={additionalData.cigarettesPerDay}
              onChange={(e) => {
                const value = e.target.value;
                setAdditionalData({ ...additionalData, cigarettesPerDay: value });
                const n = Number(value);

                setCigarettesError(
                  value !== "" &&
                    (!Number.isInteger(n) || n < 0 || n > 200)
                    ? "Bitte gültige Anzahl Zigaretten eingeben."
                    : ""
                );
              }}
            />
            {cigarettesError && (
              <p id="cigarettes-error" className={assessmentStyles.errorText}>
                {cigarettesError}
              </p>
            )}
          </div>
        )}

        {/* Alcohol consumption with a conditionally required and limited weekly amount. */}
        <label htmlFor="drinks-checkbox" className={assessmentStyles.checkboxLabel}>
          <input
            id="drinks-checkbox"
            type="checkbox"
            checked={additionalData.drinksAlcohol ?? false}
            onChange={(e) =>
              setAdditionalData({ ...additionalData, drinksAlcohol: e.target.checked, alcoholPerWeek: "" })
            }
          />
          Alkohol
        </label>

        {additionalData.drinksAlcohol && (
          <div className={assessmentStyles.expandedSection}>
            <label htmlFor="alcohol-input" className={assessmentStyles.formLabel}>
              Wie viele alkoholische Getränke pro Woche?
            </label>
            <input
              id="alcohol-input"
              className={assessmentStyles.input}
              type="text"
              inputMode="numeric"
              aria-invalid={!!alcoholError}
              aria-describedby={alcoholError ? "alcohol-error" : undefined}
              placeholder="z. B. 3"
              value={additionalData.alcoholPerWeek}
              onChange={(e) => {
                const value = e.target.value;

                setAdditionalData({
                  ...additionalData,
                  alcoholPerWeek: value,
                });

                const n = Number(value);

                setAlcoholError(
                  value !== "" &&
                    (!Number.isInteger(n) || n < 0 || n > 100)
                    ? "Bitte gültige Anzahl Getränke eingeben."
                    : ""
                );
              }}
            />
            {alcoholError && (
              <p id="alcohol-error" className={assessmentStyles.errorText}>
                {alcoholError}
              </p>
            )}
          </div>
        )}

        {/* Allergies as a dynamic list with at least one entry when enabled. */}
        <label htmlFor="has-allergies-checkbox" className={assessmentStyles.checkboxLabel}>
          <input
            id="has-allergies-checkbox"
            type="checkbox"
            checked={additionalData.hasAllergies ?? false}
            onChange={(e) =>
              setAdditionalData({
                ...additionalData,
                hasAllergies: e.target.checked,
                allergies: e.target.checked && additionalData.allergies.length === 0
                  ? [""]
                  : additionalData.allergies
              })
            }
          />
          Es liegen Allergien vor
        </label>

        {additionalData.hasAllergies && (
          <div className={assessmentStyles.expandedSection}>
            {additionalData.allergies.map((allergy, index) => (
              <div key={index} className={assessmentStyles.listEntry}>
                <label htmlFor={`allergy-input-${index}`} className="sr-only">
                  Allergie {index + 1}
                </label>
                <input
                  id={`allergy-input-${index}`}
                  className={assessmentStyles.input}
                  placeholder="Allergien z.B. Pollen, Penicillin..."
                  value={allergy}
                  onChange={(e) => updateAllergy(index, e.target.value)}
                />
                {additionalData.allergies.length > 1 && (
                  <button
                    type="button"
                    className={assessmentStyles.removeButton}
                    onClick={() => removeAllergy(index)}
                    aria-label={`Allergie ${index + 1} entfernen`}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className={assessmentStyles.addButton}
              onClick={addAllergy}
            >
              + Allergie hinzufügen
            </button>
          </div>
        )}

        {/* Optional individual values are only validated if the user actually enters a value. */}
        {/* Weight */}
        <label htmlFor="weight-input" className={assessmentStyles.formLabel}>
          Gewicht in kg
        </label>
        <input
          id="weight-input"
          className={assessmentStyles.input}
          type="text"
          inputMode="numeric"
          aria-invalid={!!weightError}
          aria-describedby={weightError ? "weight-error" : undefined}
          value={additionalData.weight}
          onChange={(e) => {
            const value = e.target.value;
            setAdditionalData({
              ...additionalData,
              weight: value,
            });
            setWeightError(validateWeight(value));
          }}
          placeholder="z. B. 72"
        />
        {weightError && <p id="weight-error" className={assessmentStyles.errorText}>{weightError}</p>}

        {/* Height */}
        <label htmlFor="height-input" className={assessmentStyles.formLabel}>
          Größe in cm
        </label>
        <input
          id="height-input"
          className={assessmentStyles.input}
          type="text"
          inputMode="numeric"
          aria-invalid={!!heightError}
          aria-describedby={heightError ? "height-error" : undefined}
          value={additionalData.height}
          onChange={(e) => {
            const value = e.target.value;
            setAdditionalData({
              ...additionalData,
              height: value,
            });
            setHeightError(validateHeight(value));
          }}
          placeholder="z. B. 175"
        />
        {heightError && <p id="height-error" className={assessmentStyles.errorText}>{heightError}</p>}

        {/* Breastfeeding as an optional categorical health detail. */}
        <label htmlFor="breastfeeding-select" className={assessmentStyles.formLabel}>
          Stillzeit
        </label>
        <select
          id="breastfeeding-select"
          className={assessmentStyles.input}
          value={additionalData.breastfeeding}
          onChange={(e) =>
            setAdditionalData({ ...additionalData, breastfeeding: e.target.value })
          }
        >
          <option value="">Bitte auswählen</option>
          <option value="ja">Ja</option>
          <option value="nein">Nein</option>
          <option value="keine Angabe">Keine Angabe</option>
        </select>

        {/* Decimal value for the measured body temperature. */}
        <label htmlFor="temperature-input" className={assessmentStyles.formLabel}>
          Haben Sie Temperatur gemessen?
        </label>
        <input
          id="temperature-input"
          className={assessmentStyles.input}
          type="text"
          inputMode="decimal"
          step="0.1"
          aria-invalid={!!temperatureError}
          aria-describedby={temperatureError ? "temperature-error" : undefined}
          value={additionalData.temperature}
          onChange={(e) => {
            const value = e.target.value;
            setAdditionalData({
              ...additionalData,
              temperature: value,
            });
            setTemperatureError(validateTemperature(value));
          }}
          placeholder="z. B. 38.5"
        />
        {temperatureError && <p id="temperature-error" className={assessmentStyles.errorText}>{temperatureError}</p>}

        {/* Duration of symptoms in integer days. */}
        <label htmlFor="duration-input" className={assessmentStyles.formLabel}>
          Seit wie vielen Tagen bestehen die Beschwerden?
        </label>
        <input
          id="duration-input"
          className={assessmentStyles.input}
          type="text"
          inputMode="numeric"
          aria-invalid={!!durationError}
          aria-describedby={durationError ? "duration-error" : undefined}
          value={additionalData.duration}
          onChange={(e) => {
            const value = e.target.value;
            setAdditionalData({
              ...additionalData,
              duration: value,
            });
            setDurationError(validateDuration(value));
          }}
          placeholder="z. B. 2"
        />
        {durationError && <p id="duration-error" className={assessmentStyles.errorText}>{durationError}</p>}

        {/* Subjective progression of the symptoms. */}
        <label htmlFor="worsening-select" className={assessmentStyles.formLabel}>
          Werden die Beschwerden stärker?
        </label>
        <select
          id="worsening-select"
          className={assessmentStyles.input}
          value={additionalData.worsening}
          onChange={(e) =>
            setAdditionalData({ ...additionalData, worsening: e.target.value })
          }
        >
          <option value="">Bitte auswählen</option>
          <option value="ja">Ja</option>
          <option value="nein">Nein</option>
          <option value="unklar">Unklar</option>
        </select>

        {/* Free-text field for additional context not covered by the structured inputs. */}
        <label htmlFor="extrainfo-textarea" className={assessmentStyles.formLabel}>
          Gibt es weitere wichtige Informationen?
        </label>
        <textarea
          id="extrainfo-textarea"
          className={assessmentStyles.input}
          maxLength={500}
          value={additionalData.extraInfo}
          onChange={(e) =>
            setAdditionalData({ ...additionalData, extraInfo: e.target.value })
          }
          placeholder="z. B. Kontakt zu erkrankten Personen, kürzliche Reise, Unfall..."
        />
      </fieldset>

      {/*
        During the normal workflow, navigation continues only if all enabled
        sections contain valid data.

        After returning from the review screen, this action always navigates
        directly back to the review step, regardless of validation.
    */}
      <div className={assessmentStyles.quickSelect}>
        {
          !checkInfoActive
            ? (
              <>
                <button
                  type="button"
                  disabled={!noErrors}
                  className={assessmentStyles.primaryButton}
                  onClick={() => setStep("checkInfo")}
                >
                  weiter
                </button>

                {!noErrors && (
                  <p className={assessmentStyles.errorText}>
                    {getValidationHint()}
                  </p>
                )}
              </>
            ) : (
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
