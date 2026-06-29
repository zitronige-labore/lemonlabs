/*
main logic needed in page
*/
import { Step, MainRegion, SubRegion, RedFlags } from "../../types/assessment";

export const formularSteps: Step[] = [
  "redflags",
  "basisStart",
  "bodyRegion",
  "symptomChoice",
  "textInput",
  "selectMoreSymptoms",
  "additionalInfo",
];

/**
 * gets progress in process to be used in progress bar
 * @param step: Step
 * @returns number
 */
export function getStepProgress(step: Step): number {
  switch (step) {
    case "redflags":
      return 15;
    case "basisStart":
      return 30;
    case "bodyRegion":
      return 45;
    case "symptomChoice":
      return 60;
    case "manageData":
      return 0;
    case "Ohren":
    case "Kopf":
    case "Nacken":
    case "Mund / Zähne":
    case "Oberbauch":
    case "Unterbauch":
    case "ArmeHaende":
    case "Hals":
    case "Genitalbereich":
    case "Becken":
    case "Brust links":
    case "Brust rechts":
    case "Rücken oben":
    case "Rücken unten":
    case "Oberschenkel":
    case "Knie":
    case "Unterschenkel":
    case "Fuß":
    case "Augen":
    case "Nase":
    case "Keine bestimmte Region / mehrere Stellen":
    case "Psyche":
      return 60;
    case "innenOhr":
    case "aussenOhr":
    case "kopfSpannung":
    case "kopfMigraene":
    case "kopfCluster":
    case "kopfBegleitung":
    case "kopfWarnsignale":
    case "nackenBewegung":
    case "nackenWarnsignale":
    case "mundZaehneSchmerz":
    case "mundZaehneSchleimhaut":
    case "mdSpeiseroehre":
    case "mdMagen":
    case "mdGalle":
    case "unterbauchDuendarm":
    case "unterbauchDickdarm":
    case "unterbauchOvarien":
    case "brustHerz":
    case "brustLunge":
    case "brustRippen":
    case "brustraumWarnsignale":
    case "rueckenHalswirbel":
    case "rueckenBrustwirbel":
    case "rueckenLendenwirbel":
    case "rueckenMuskulatur":
      return 60;
    case "textInput":
      return 70;
    case "selectMoreSymptoms":
      return 80;
    case "additionalInfo":
      return 90;
    case "checkInfo":
      return 95;
    case "result":
      return 100;
    default:
      return 0;
  }
}

/**
 * gets updated prewritten symptoms
 * @param previousSymptoms: string[]
 * @param symptom: string
 * @param painscale?: string
 * @returns string[]
 */
export function getUpdatedSymptoms(
  previousSymptoms: string[],
  symptom: string,
  painscale?: string
): string[] {
  return previousSymptoms.some((s) => s.includes(symptom))
    ? previousSymptoms.filter((s) => !s.includes(symptom))
    : [...previousSymptoms, `${symptom}, "painscale": ${painscale ?? null}`];
}

/**
 * gets updated prewritten symptoms
 * @param previousSymptoms: string[]
 * @param symptom: string
 * @returns string[]
 */
export function getUpdatedSymptomText(
  previousSymptoms: string[],
  symptom: string
): string[] {
  return previousSymptoms.includes(symptom)
    ? previousSymptoms.filter((item) => item !== symptom)
    : [...previousSymptoms, symptom];
}

/**
 * check for emergency
 * @param redFlags: redFlags
 * @returns boolean
 */
export function calculateHasEmergency(redFlags: RedFlags): boolean {
  return Object.values(redFlags).some(Boolean);
}

/**
 * calculate the furthest progress
 * @param currentHighest: number
 * @param nextStep: Step
 * @returns number
 */
export function calculateNewHighestProgress(
  currentHighest: number,
  nextStep: Step
): number {
  if (nextStep === "start" || nextStep === "hinweise" || nextStep === "manageData") {
    return 0;
  }
  return Math.max(currentHighest, getStepProgress(nextStep));
}

/**
 * checks if region selection is complete
 * @param selectedMainRegion: MainRegion | null
 * @param selectedSubRegion: SubRegion | null
 * @returns boolean
 */
export function isRegionSelectionComplete(
  selectedMainRegion: MainRegion | null,
  selectedSubRegion: SubRegion | null
): boolean {
  return !!(selectedMainRegion && selectedSubRegion);
}
