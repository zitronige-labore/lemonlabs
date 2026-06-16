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

export function getUpdatedSymptoms(
  previousSymptoms: string[],
  symptom: string,
  painscale?: string
): string[] {
  return previousSymptoms.some((s) => s.includes(symptom))
    ? previousSymptoms.filter((s) => !s.includes(symptom))
    : [...previousSymptoms, `${symptom}, "painscale": ${painscale ?? null}`];
}

export function getUpdatedSymptomText(
  previousSymptoms: string[],
  symptom: string
): string[] {
  return previousSymptoms.includes(symptom)
    ? previousSymptoms.filter((item) => item !== symptom)
    : [...previousSymptoms, symptom];
}

export function calculateHasEmergency(redFlags: RedFlags): boolean {
  return Object.values(redFlags).some(Boolean);
}

export function calculateNewHighestProgress(
  currentHighest: number,
  nextStep: Step
): number {
  if (nextStep === "start" || nextStep === "hinweise" || nextStep === "manageData") {
    return 0;
  }
  return Math.max(currentHighest, getStepProgress(nextStep));
}

export function isRegionSelectionComplete(
  selectedMainRegion: MainRegion | null,
  selectedSubRegion: SubRegion | null
): boolean {
  return !!(selectedMainRegion && selectedSubRegion);
}
