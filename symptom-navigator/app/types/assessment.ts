/*
  Beschreibt alle möglichen Schritte des gesamten Ablaufs
  der Ersteinschätzung innerhalb der Anwendung.
*/

// importy of steps from category list
import { categoryTargetSteps } from "../assessment/utils/makeStepFromSymptomCategory";
import { RedFlags } from "../assessment/medicalLogic/redFlagCheckboxes";

export type subregionCategory =
  | SubRegion
  | null;

export type categoryAfterCategoryIfNeeded =
  | "bsp";

export type symptomChoiceStep =
  categoryTargetSteps
  ; 



export type Step =
  | "start"
  | "hinweise"
  | "redflags"
  | "basisStart"
  | "bodyRegion"
  | "symptomChoice"
  | "symptomInput"
  | "basisDetails"
  | "additionalInfo"
  | "result"
  | "textInput"
  | "selectMoreSymptoms"
  | "manageData"
  | "other"
  | "checkInfo"
  | subregionCategory
  | categoryAfterCategoryIfNeeded
  | symptomChoiceStep;

/*
  Zusatzangaben der Nutzerin oder des Nutzers.
*/
export type AdditionalData = {
  medication?: MedicationEntry[];
  hasMedication: boolean;

  conditions: string[];
  hasConditions: boolean;

  allergies: string[];
  hasAllergies: boolean;

  cigarettesPerDay: string;
  smokescigarettes: boolean;

  alcoholPerWeek: string;
  drinksAlcohol: boolean;

  temperature: string;
  duration: string;
  worsening: string;

  weight: string;
  height: string;

  breastfeeding: string;

  extraInfo: string;
};

/*
  Hauptregionen der interaktiven Körperkarte.

  Diese Bereiche werden zuerst ausgewählt,
  bevor eine genauere Unterregion bestimmt wird.
*/
export type MainRegion =
  | "Kopf & Gesicht"
  | "Hals"
  | "Nacken"
  | "Brust"
  | "Bauch"
  | "Rücken"
  | "Becken & Unterleib"
  | "Arme & Hände links"
  | "Arme & Hände rechts"
  | "Beine & Füße links"
  | "Beine & Füße rechts"
  | "Psyche"
  | "Allgemein (ganzer Körper)";

/*
  Genauere Unterregionen innerhalb einer Hauptregion.

  Diese Auswahl dient dazu, Beschwerden
  präziser zuzuordnen.
*/
export type SubRegion =
  | "Kopf"
  | "Augen"
  | "Ohren"
  | "Nase"
  | "Mund / Zähne"
  | "Hals"
  | "Nacken"
  | "Brust links"
  | "Brust rechts"
  | "OberbauchRechts"
  | "UnterbauchRechts"
  | "OberbauchLinks"
  | "UnterbauchLinks"
  | "Rücken oben"
  | "Rücken unten"
  | "Becken"
  | "Genitalbereich"
  | "SchulterRechts"
  | "OberarmRechts"
  | "UnterarmRechts"
  | "HandRechts"
  | "SchulterLinks"
  | "OberarmLinks"
  | "UnterarmLinks"
  | "HandLinks"
  | "OberschenkelRechts"
  | "KnieRechts"
  | "UnterschenkelRechts"
  | "OberschenkelLinks"
  | "KnieLinks"
  | "UnterschenkelLinks"
  | "FußRechts"
  | "FußLinks"
  | "Psyche"
  | "Keine bestimmte Region / mehrere Stellen";


/*
  Enthält alle möglichen Warnzeichen,
  die auf einen medizinischen Notfall
  hinweisen können.
*/
export type { RedFlags } from "../assessment/medicalLogic/redFlagCheckboxes";

/*
  Speichert allgemeine Angaben der Nutzerin
  oder des Nutzers sowie zusätzliche Informationen
  zu den Beschwerden.
*/
export type BasisData = {
  age: string;
  gender: string;
  pregnancy: string;
};


export type SymptomSelectionList = {
    step: Step;
    symptoms: {
    symptomName: string;
    schmerzen: boolean;
    symptomValue: string;
    snomedCode: string;
    }[];
    }[];


export type SymptomCategoryList = {
step: Step;
categories: {
  category: string;
  step: Step;
  }[];
}[];


export type MedicationEntry = {
  name: string;
  dose: string;
  unit: string; 
  frequency: string;
  frequencyUnit: string;
  since: string;
};
