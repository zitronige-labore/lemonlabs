export const PATTERN_LIST = /^[^,]+(,[^,]+)*$/;

export function validateWeight(value: string): string {
  const weight = Number(value);
  if (value === "") return "";
  if (weight <= 0 || weight > 600 || !Number.isInteger(weight) || Number.isNaN(weight)) {
    return "Bitte geben Sie ein gültiges Gewicht ein.";
  }
  return "";
}

export function validateHeight(value: string): string {
  const height = Number(value);
  if (value === "") return "";
  if (height < 40 || height > 300 || !Number.isInteger(height)) {
    return "Bitte geben Sie ein gültige Körpergröße ein.";
  }
  return "";
}

export function validateTemperature(value: string): string {
  const temperature = Number(value);
  if (value === "") return "";
  if (temperature < 30 || temperature > 45 || Number.isNaN(temperature)) {
    return "Bitte geben Sie ein gültige Körpertemperatur ein.";
  }
  return "";
}

export function validateDuration(value: string): string {
  const duration = Number(value);
  if (value === "") return "";
  if (duration < 0 || duration > 365 || !Number.isInteger(duration)) {
    return "Bitte geben Sie ein gültige Anzahl an Tagen ein.";
  }
  return "";
}

export function validateListFormat(value: string): boolean {
  const trimmed = value.trim();
  return trimmed === "" || PATTERN_LIST.test(trimmed);
}
