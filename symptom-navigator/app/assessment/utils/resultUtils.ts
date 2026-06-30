/*
helper functions to display result
*/

import { AssessmentExportData } from "./exportUtils";
import { BasisData, AdditionalData } from "../../types/assessment";

/**
 * parses symptom name
 * @param s: string
 * @returns string
 */
export function parseSymptomName(s: string): string {
  try {
    return JSON.parse(s).name || s;
  } catch {
    return s;
  }
}

/**
 * parses symptom text
 * @param s: string
 * @returns string
 */
export function parseSymptomText(s: string): string {
  try {
    return JSON.parse(s).text_symptom || s;
  } catch {
    return s;
  }
}

/**
 * formates ai suspicions
 * @param suspicions: any
 * @returns @returns AssessmentExportData["vermutungen"] - array of { text: string, wahrscheinlichkeit: string }
 */
export function formatSuspicions(suspicions: any): AssessmentExportData["vermutungen"] {
  if (!suspicions) return [];
  
  return [1, 2, 3, 4, 5].map((i) => {
    const s = suspicions[`suspicion${i}`];
    if (!s) return null;
    const reasonKey = Object.keys(s).find((k) => k.toLowerCase().includes("reason"));
    const probKey = Object.keys(s).find((k) => k.toLowerCase().includes("probability"));
    return {
      text: reasonKey ? s[reasonKey] : "Keine Angabe",
      wahrscheinlichkeit: probKey && s[probKey] ? `${s[probKey]}` : "Keine Angabe",
    };
  }).filter(Boolean) as AssessmentExportData["vermutungen"];
}

/**
 * builds export data
 * @param basisData: BasisData
 * @param additionalData: AdditionalData
 * @param symptomText: string[]
 * @param selectedSymptoms: string[]
 * @param aiAnswer: any
 * @returns AssessmentExportData
 */
export function buildExportData(
  basisData: BasisData,
  additionalData: AdditionalData,
  symptomText: string[],
  selectedSymptoms: string[],
  aiAnswer: any
): AssessmentExportData {
  const medicationValue = additionalData.medication?.map(
    (medication) =>
      `Medikation: ${medication.name} ${medication.dose} ${medication.unit}, Einnahmen pro ${medication.frequencyUnit}: ${medication.frequency}, Seit wann: ${medication.since}`,
  );

  return {
    alter: basisData.age || "Keine Angabe",
    geschlecht: basisData.gender || "Keine Angabe",
    schwangerschaft: basisData.pregnancy || "Keine Angabe",
    stillzeit: additionalData.breastfeeding || "Keine Angabe",
    worsening: additionalData.worsening || undefined,
    groesse: additionalData.height ? `${additionalData.height} cm` : "Keine Angabe",
    gewicht: additionalData.weight ? `${additionalData.weight} kg` : "Keine Angabe",
    temperatur: additionalData.temperature || "Keine Angabe",
    dauer: additionalData.duration || "Keine Angabe",
    medikation: medicationValue?.join(",") || "Keine Angabe",
    allergien: additionalData.allergies?.join(",") || "Keine Angabe",
    vorerkrankungen: additionalData.conditions?.join(",") || "Keine Angabe",
    alkoholkonsum: additionalData.alcoholPerWeek || "Keine Angabe",
    zigaretten: additionalData.cigarettesPerDay || "Keine Angabe",
    symptome: selectedSymptoms.length > 0
      ? selectedSymptoms.map(parseSymptomName).join(", ")
      : "",
    textSymptome: symptomText.length > 0
      ? symptomText.map(parseSymptomText).join(", ")
      : "",
    datum: new Date().toLocaleString(),
    dringlichkeit: aiAnswer?.assessment?.urgency?.toString() || "Keine Angabe",
    handlungsempfehlung: aiAnswer?.assessment?.nextSteps || "Keine Angabe",
    vermutungen: formatSuspicions(aiAnswer?.assessment?.suspicions),
  };
}
