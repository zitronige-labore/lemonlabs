// this file is meant for adjusting the redFlag checkboxes at the start of the process
// all of these redflags will instantly trigger the emergency popup

// key: type name for typesafety, label: text that is written on the checkbox label
export const redFlagCheckboxes = [
  { key: "chestPain", label: "Starke Brustschmerzen" },
  { key: "breathingProblems", label: "Atemnot oder starke Atemprobleme" },
  { key: "unconsciousness", label: "Bewusstlosigkeit oder starke Benommenheit" },
  { key: "severeBleeding", label: "Starke Blutung" },
  { key: "strokeSymptoms", label: "Lähmung, Sprachstörung oder Verdacht auf Schlaganfall" },
  { key: "highFeverConfusion", label: "Hohes Fieber mit Verwirrtheit" },
] as const;


// making keys ready to be use in types/assessment.ts
export type RedFlagKey = (typeof redFlagCheckboxes)[number]["key"];


export type RedFlags = {
  [K in RedFlagKey]: boolean;
};