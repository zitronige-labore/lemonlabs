import assessmentStyles from "../Assessment.module.css";
import type { AdditionalData, MedicationEntry, Step } from "../../types/assessment";
import { useState } from "react";



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

  const [weightError, setWeightError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [temperatureError, setTemperatureError] = useState("");
  const [durationError, setDurationError] = useState("");
  const [cigarettesError, setCigarettesError] = useState("");
  const [alcoholError, setAlcoholError] = useState("");
  const [doseError, setDoseError] = useState<Record<number, string>>({});
  const [frequencyError, setFrequencyError] =useState<Record<number, string>>({});


  const noErrors =
    Object.values(frequencyError).every(error => error === "") &&
    Object.values(frequencyError).every(error => error === "") &&
    cigarettesError === "" &&
    alcoholError === "" &&
    weightError === "" &&
    heightError === "" &&
    temperatureError === "" &&
    durationError === "";


  function updateMedication(index: number, field: keyof MedicationEntry, value: string) {
    const updated = additionalData.medication?.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    setAdditionalData({ ...additionalData, medication: updated });
  }

  function addMedication() {
    setAdditionalData({...additionalData, medication: [
      ...(additionalData.medication ?? []),
      { name: "", dose: "", unit: "", frequency: "", frequencyUnit: "", since: "" }
    ]});
  }

  function removeMedication(index: number) {
    setAdditionalData({
      ...additionalData,
      medication: additionalData.medication?.filter((_, i) => i !== index)
    });
  }

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
      <p className={assessmentStyles.optionalHint}>
        Optional: Diese Angaben können helfen, die Beschwerden besser
        einzuordnen. Sie können diesen Schritt auch überspringen.
      </p>

      <fieldset className={assessmentStyles.fieldset}>
        <legend className={assessmentStyles.legend}>Zusatzangaben</legend>

        {/* medication*/}
        <label className={assessmentStyles.checkboxLabel}>
          <input
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

                <label className={assessmentStyles.fullWidth}>
                  Medikament
                  <input
                    className={assessmentStyles.input}
                    placeholder="z. B. Ibuprofen"
                    value={entry.name}
                    onChange={(e) => updateMedication(index, "name", e.target.value)}
                  />
                </label>

                <label>
                  Dosis
                  <input
                    className={assessmentStyles.input}
                    type="number"
                    min={0}
                    step={1}
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
                  {doseError[index] && <p className={assessmentStyles.errorText}>{doseError[index]}</p>}
                </label>

                <label>
                  Einheit
                  <select
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

                <label>
                  Wie oft
                  <input
                    className={assessmentStyles.input}
                    type="number"
                    min={0}
                    step={1}
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
                  {frequencyError[index] && <p className={assessmentStyles.errorText}>{frequencyError[index]}</p>}
                </label>

                <label>
                  pro
                  <select
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

                <label className={assessmentStyles.fullWidth}>
                  seit wann
                  <input
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

        {/* conditions*/}
        <label className={assessmentStyles.checkboxLabel}>
          <input
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
                <input
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
                    aria-label="Vorerkrankung entfernen"
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

        {/* cigarettes */}
        <label className={assessmentStyles.checkboxLabel}>
          <input
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
            <label className={assessmentStyles.formLabel}>
              Wie viele Zigaretten pro Tag?
              <input
                className={assessmentStyles.input}
                type="number"
                min={0}
                step={1}
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
                <p className={assessmentStyles.errorText}>
                  {cigarettesError}
                </p>
              )}
            </label>
          </div>
        )}

        {/* alcohol*/}
        <label className={assessmentStyles.checkboxLabel}>
          <input
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
            <label className={assessmentStyles.formLabel}>
              Wie viele alkoholische Getränke pro Woche?
              <input
                className={assessmentStyles.input}
                type="number"
                min={0}
                step={1}
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
                <p className={assessmentStyles.errorText}>
                  {alcoholError}
                </p>
              )}
            </label>
          </div>
        )}

        {/* allergies */}
        <label className={assessmentStyles.checkboxLabel}>
          <input
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
                <input
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
                    aria-label="Allergie entfernen"
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

        {/* weight */}
        <label className={assessmentStyles.formLabel}>
          Gewicht in kg
          <input
            className={assessmentStyles.input}
            type="number"
            value={additionalData.weight}
            onChange={(e) => {
              const value = e.target.value;
              setAdditionalData({ ...additionalData, weight: value });
              const n = Number(value);
              setWeightError(value !== "" && (n <= 0 || n > 600 || !Number.isInteger(n))
                ? "Bitte geben Sie ein gültiges Gewicht ein." : "");
            }}
            placeholder="z. B. 72"
          />
          {weightError && <p className={assessmentStyles.errorText}>{weightError}</p>}
        </label>

        {/* height */}
        <label className={assessmentStyles.formLabel}>
          Größe in cm
          <input
            className={assessmentStyles.input}
            type="number"
            value={additionalData.height}
            onChange={(e) => {
              const value = e.target.value;
              setAdditionalData({ ...additionalData, height: value });
              const n = Number(value);
              setHeightError(value !== "" && (n < 40 || n > 300 || !Number.isInteger(n))
                ? "Bitte geben Sie eine gültige Körpergröße ein." : "");
            }}
            placeholder="z. B. 175"
          />
          {heightError && <p className={assessmentStyles.errorText}>{heightError}</p>}
        </label>

        {/* breastfeeding*/}
        <label className={assessmentStyles.formLabel}>
          Stillzeit
          <select
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
        </label>

        {/* temperature */}
        <label className={assessmentStyles.formLabel}>
          Haben Sie Temperatur gemessen?
          <input
            className={assessmentStyles.input}
            type="number"
            step="0.1"
            value={additionalData.temperature}
            onChange={(e) => {
              const value = e.target.value;
              setAdditionalData({ ...additionalData, temperature: value });
              const n = Number(value);
              setTemperatureError(value !== "" && (n < 30 || n > 45)
                ? "Bitte geben Sie eine gültige Körpertemperatur ein." : "");
            }}
            placeholder="z. B. 38.5"
          />
          {temperatureError && <p className={assessmentStyles.errorText}>{temperatureError}</p>}
        </label>

        {/* duration */}
        <label className={assessmentStyles.formLabel}>
          Seit wie vielen Tagen bestehen die Beschwerden?
          <input
            className={assessmentStyles.input}
            type="number"
            value={additionalData.duration}
            onChange={(e) => {
              const value = e.target.value;
              setAdditionalData({ ...additionalData, duration: value });
              const n = Number(value);
              setDurationError(value !== "" && (n < 0 || n > 365 || !Number.isInteger(n))
                ? "Bitte geben Sie eine gültige Anzahl an Tagen ein." : "");
            }}
            placeholder="z. B. 2"
          />
          {durationError && <p className={assessmentStyles.errorText}>{durationError}</p>}
        </label>

        {/* worsening */}
        <label className={assessmentStyles.formLabel}>
          Werden die Beschwerden stärker?
          <select
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
        </label>

        {/* extraInfo */}
        <label className={assessmentStyles.formLabel}>
          Gibt es weitere wichtige Informationen?
          <textarea
            className={assessmentStyles.input}
            maxLength={500}
            value={additionalData.extraInfo}
            onChange={(e) =>
              setAdditionalData({ ...additionalData, extraInfo: e.target.value })
            }
            placeholder="z. B. Kontakt zu erkrankten Personen, kürzliche Reise, Unfall..."
          />
        </label>
      </fieldset>

      <div className={assessmentStyles.quickSelect}>
        {
        !checkInfoActive
         ? (
          <button
            type="button"
            disabled={!noErrors}
            className={assessmentStyles.primaryButton}
            onClick={() => setStep("checkInfo")}
          >
            weiter
          </button>
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