//regex for validating comma-seperated lists
export const PATTERN_LIST = /^[^,]+(,[^,]+)*$/;

//validates whether weight is an positive integer between 0 and 600
export function validateWeight(value: string): string {
  const weight = Number(value);
  //empty input doesnt get validated
  if (value === "") return "";
  if (weight <= 0 || weight > 600 || !Number.isInteger(weight) || Number.isNaN(weight)) {
    return "Bitte geben Sie ein gültiges Gewicht ein.";
  }
  return "";
}

//validates whether height is an positive integer between 40 and 300 cm
export function validateHeight(value: string): string {
  const height = Number(value);
  //empty input doesnt get validated
  if (value === "") return "";
  if (height < 40 || height > 300 || !Number.isInteger(height)) {
    return "Bitte geben Sie ein gültige Körpergröße ein.";
  }
  return "";
}

//validates whether temperature is between 30 and 45°C
export function validateTemperature(value: string): string {
  //empty input doesnt get validated
  if (value === "") return "";

  //allows comma and dot as decimal seperators
  const temperature = Number(value.replace(",", "."));

  if (temperature < 30 || temperature > 45 || Number.isNaN(temperature)) {
    return "Bitte geben Sie ein gültige Körpertemperatur ein.";
  }
  return "";
}

// validates wether duration is an integer between 0 and 365 days
export function validateDuration(value: string): string {
  const duration = Number(value);
  //empty input doesnt get validated
  if (value === "") return "";
  if (duration < 0 || duration > 365 || !Number.isInteger(duration)) {
    return "Bitte geben Sie ein gültige Anzahl an Tagen ein.";
  }
  return "";
}

//checks wether input is a valid comma-seperated list 
export function validateListFormat(value: string): boolean {
  const trimmed = value.trim();
  //accepts no input or comma-seperated list input
  return trimmed === "" || PATTERN_LIST.test(trimmed);
}
