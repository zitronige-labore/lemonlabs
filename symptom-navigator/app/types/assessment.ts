/*
  Describes all possible steps of the initial
  medical assessment workflow within the application.
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
  | "datenschutz"
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
  Additional information provided by the user.
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
  Main regions of the interactive body map.

  These regions are selected first
  before a more specific subregion is chosen.
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
  More specific subregions within a main region.

  This selection allows symptoms
  to be assigned more precisely.
*/
export type SubRegion =
  | "Kopf"
  | "Augen"
  | "Ohren"
  | "Nase"
  | "Mund / Zähne"
  | "Hals"
  | "Nacken"
  | "Brust"
  | "Brust links"
  | "Brust rechts"
  | "Oberbauch"
  | "Unterbauch"
  | "Oberbauch rechts"
  | "Unterbauch rechts"
  | "Oberbauch links"
  | "Unterbauch links"
  | "Rücken oben"
  | "Rücken unten"
  | "Becken"
  | "Genitalbereich"
  | "Schulter"
  | "Oberarm"
  | "Unterarm"
  | "Hand"
  | "Schulter rechts"
  | "Oberarm rechts"
  | "Unterarm rechts"
  | "Hand rechts"
  | "Schulter links"
  | "Oberarm links"
  | "Unterarm links"
  | "Hand links"
  | "Oberschenkel"
  | "Unterschenkel"
  | "Knie"
  | "Fuß"
  | "Oberschenkel rechts"
  | "Knie rechts"
  | "Unterschenkel rechts"
  | "Oberschenkel links"
  | "Knie links"
  | "Unterschenkel links"
  | "Fuß rechts"
  | "Fuß links"
  | "Psyche"
  | "Keine bestimmte Region / mehrere Stellen";


  
/*
  Contains all possible warning signs
  that may indicate a medical emergency.
*/
export type { RedFlags } from "../assessment/medicalLogic/redFlagCheckboxes";

/*
  Stores general user information
  as well as additional details
  about the reported symptoms.
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
