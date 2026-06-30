// server side actions for assessment page
"use server"

import { getSymptomList } from "../assessment/medicalLogic/SymptomLists"; // for snomed mapping
import { Step, AdditionalData, BasisData, SymptomSelectionList, MedicationEntry } from "../types/assessment"; // needed type
import { connectionPool } from "../dbs/db"; // for database queries
import { getUserDataFromDB } from "./dbActions";



/**
 * Maps a symptom value to its SNOMED code.
 * @param name - the symptomValue of a symptom
 * @returns Promise<string|null> - the corresponding SNOMED code, or null if no matching symptom was found
 */
export async function mapNameToSnomed(name: string) {
  if (!name) return null;
  const symptomList = getSymptomList() as any[];
  for (const category of symptomList) {
    if (category && category.symptoms) {
      const match = category.symptoms.find(
        (s: any) => s.symptomValue?.toLowerCase().trim() === name.toLowerCase().trim()
      );
      if (match) return match.snomedCode;
    }
  }
  return null;
}


/**
 * Maps a symptom value to its SNOMED code.
 * @param caseId - case id 
 * @returns Promise<{resourceType, type, entry> - fhir
 */
export async function buildFhirBundle(caseId: string): Promise<any> {

  // Daten aus der Datenbank geholt
  const userData = await getUserDataFromDB(caseId);
  if (!userData || !userData.caseData || userData.caseData.length === 0) {
    console.error("Keine Daten für FHIR-Export in der DB gefunden.");
    return null;
  }

  // Übernommen von Franziska
  const { sex, age, pregnancy, date } = userData.caseData[0] ?? {};
  const { weight, height, temperature, duration, worsening, breastfeeding, extraInfo, alcohol, smoking } = userData.additionalInfoData[0] ?? {};
  const { allergies } = userData.allergyData ?? {};
  const { medications } = userData.medicationData ?? [];
  const { conditions } = userData.conditionsData ?? {};

  // Liste der gegebenen Symptome
  const symptoms = userData.symptomData.map(
    ({ name_de, painscale, bodyregion }: { name_de: string; painscale: number | null; bodyregion: string | null }) => ({
      name_de,
      painscale,
      bodyregion,
    })
  );

  // Liste der Freitext Symptome 
  const textSymptoms = userData.textSymptomData.map(
    ({ raw_symptoms, painscale, bodyregion }: { raw_symptoms: string; painscale: number | null; bodyregion: string | null }) => ({
      raw_symptoms,
      painscale,
      bodyregion,
    })
  );

  const temperatureFloat = temperature;


  const fhirEntries: any[] = [];
  const patientRef = "urn:uuid:patient-1";

  // Patienten-Anker 
  fhirEntries.push({
    fullUrl: patientRef,
    resource: {
      resourceType: "Patient",
      active: true,
      managingOrganization: { display: "lemonlabs - TH Mannheim" }
    }
  });

  // Demografie als Observations 
  
  // Geburtsgeschlecht (LOINC: 76689-9)
  if (sex) {
    let fhirSexDisplay = "Unknown";
    let fhirSexCode = "unknown";
    if (sex === "m") { fhirSexDisplay = "Male"; fhirSexCode = "M"; }
    else if (sex === "w") { fhirSexDisplay = "Female"; fhirSexCode = "F"; }
    else if (sex === "d") { fhirSexDisplay = "Other"; fhirSexCode = "OTH"; }

    fhirEntries.push({
      resource: {
        resourceType: "Observation",
        status: "final",
        subject: { reference: patientRef },
        category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "social-history", display: "Social History" }] }],
        code: { coding: [{ system: "http://loinc.org", code: "76689-9", display: "Sex assigned at birth" }] },
        valueCodeableConcept: {
          coding: [{ system: "http://terminology.hl7.org/CodeSystem/v3-AdministrativeGender", code: fhirSexCode, display: fhirSexDisplay }],
          text: `Geburtsgeschlecht: ${fhirSexDisplay}`
        }
      }
    });
  }

 // Alter (LOINC: 63900-5)
  if (age) {
    fhirEntries.push({
      resource: {
        resourceType: "Observation",
        status: "final",
        subject: { reference: patientRef },
        code: { coding: [{ system: "http://loinc.org", code: "63900-5", display: "Current age" }] },
        valueQuantity: { value: age, unit: "a", system: "http://unitsofmeasure.org", code: "a" }
      }
    });
  }

  // Schwangerschaftsstatus (LOINC: 82810-3)
  if (pregnancy !== undefined && sex !== "m") {
    fhirEntries.push({
      resource: {
        resourceType: "Observation",
        status: "final",
        subject: { reference: patientRef },
        code: { coding: [{ system: "http://loinc.org", code: "82810-3", display: "Pregnancy status" }] },
        valueCodeableConcept: {
          coding: [{ system: "http://snomed.info/sct", code: pregnancy ? "77386006" : "60001007", display: pregnancy ? "Schwanger" : "Nicht schwanger" }],
          text: pregnancy ? "Patientin ist schwanger" : "Patientin ist nicht schwanger"
        }
      }
    });
  }

    //Stillzeit
  if (breastfeeding !== undefined && sex !== "m") {
    fhirEntries.push({
      resource: {
        resourceType: "Observation",
        status: "final",
        subject: { reference: patientRef },
        code: { coding: [{ system: "http://loinc.org", code: "63895-7", display: "Breastfeeding status" }] },
        valueCodeableConcept: {
          coding: [{ system: "http://snomed.info/sct", code: breastfeeding ? "69840006" : "106311005", display: breastfeeding ? "Stillend" : "Nicht stillend" }],
          text: breastfeeding ? "Patientin ist stillend" : "Patientin ist nicht stillend"
        }
      }
    });
  }

if (smoking !== undefined) {
  fhirEntries.push ({
    resource: {
      resourceType: "Observation",
      status: "final",
      subject: {reference: patientRef},
      effectiveDateTime: date,
      category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "social-history", display:" Social History" }]}],
      code: { coding: [{ system: "http://loinc.org", coce: "72166-2", display: "Tobacco smoking status" }]},
      valueCodeableConcept: {
        text: typeof smoking === "boolean"
        ? (smoking ? "Patient konsumiert Tabak/Zigaretten": "Patient konsumiert keinen Tabak")
        : `Tabakkonsum: ${smoking}` // Falls Freitext statt Boolean
      }
    }
  });
}

if (alcohol !== undefined) {
  fhirEntries.push({
    resource: {
      resourceType: "Observation",
      status: "final",
      subject: {refernce: patientRef }, 
      effectiveDateTime: date,
      category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "social-history", display: "Social History" }] }],
      code: {coding: [{ system:  "http://loinc.org", code: "74013-4", display: "Alcoholic beverage intake" }]},
      valueCodeableConcept: {
          text: typeof alcohol === "boolean"
            ? (alcohol ? "Patient konsumiert regelmäßig Alkohol" : "Patient konsumiert keinen Alkohol")
            : `Alkoholkonsum: ${alcohol}` // Falls Freitext statt Boolean
    }
  }
  });
}

  // Gegebene Symptome
  for (const symptom of symptoms) {
    const snomedCodeFromTree = await mapNameToSnomed(symptom.name_de);
    fhirEntries.push({
      resource: {
        resourceType: "Condition",
        clinicalStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }] },
        subject: { reference: patientRef },
        code: {
          coding: [
            ...(snomedCodeFromTree ? [{ system: "http://snomed.info/sct", code: snomedCodeFromTree, display: symptom.name_de }] : []),
            { system: "http://local-terminology.de/symptoms", code: "custom-text", display: symptom.name_de }
          ],
          text: symptom.name_de
        },
        ...(symptom.painscale !== null ? { severity: { text: `Schmerzskala: ${symptom.painscale}/10` } } : {})
      }
    });
  }

  // Freitext Symptome
  for (const tSymptom of textSymptoms) {
    const snomedCodeFromTree = await mapNameToSnomed(tSymptom.raw_symptoms);
    fhirEntries.push({
      resource: {
        resourceType: "Condition",
        clinicalStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }] },
        subject: { reference: patientRef },
        code: {
          coding: [
            ...(snomedCodeFromTree ? [{ system: "http://snomed.info/sct", code: snomedCodeFromTree, display: tSymptom.raw_symptoms }] : []),
            { system: "http://local-terminology.de/symptoms", code: "free-text", display: tSymptom.raw_symptoms }
          ],
          text: tSymptom.raw_symptoms
        },
        ...(tSymptom.painscale !== null ? { severity: { text: `Schmerzskala: ${tSymptom.painscale}/10` } } : {})
      }
    });
  }

  // D. Vitalwerte & Untersuchungsparameter via LOINC
  if (temperatureFloat) {
    fhirEntries.push({
      resource: {
        resourceType: "Observation",
        status: "final",
        effectiveDateTime: date,
        subject: { reference: patientRef },
        category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "vital-signs", display: "Vital Signs" }] }],
        code: { coding: [{ system: "http://loinc.org", code: "8310-5", display: "Body temperature" }] },
        valueQuantity: { value: temperatureFloat, unit: "C", system: "http://unitsofmeasure.org", code: "Cel" }
      }
    });
  }

  if (weight) {
    fhirEntries.push({
      resource: {
        resourceType: "Observation",
        status: "final",
        subject: { reference: patientRef },
        category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "vital-signs", display: "Vital Signs" }] }],
        code: { coding: [{ system: "http://loinc.org", code: "29463-7", display: "Body weight" }] },
        valueQuantity: { value: weight, unit: "kg", system: "http://unitsofmeasure.org", code: "kg" }
      }
    });
  }

if (height) {
    fhirEntries.push({
      resource: {
        resourceType: "Observation",
        status: "final",
        subject: { reference: patientRef },
        category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "vital-signs", display: "Vital Signs" }] }],
        code: { coding: [{ system: "http://loinc.org", code: "8302-2", display: "Body height" }] },
        valueQuantity: { value: height, unit: "cm", system: "http://unitsofmeasure.org", code: "cm" }
      }
    });
  }


  if (duration) {
    fhirEntries.push({
      resource: {
        resourceType: "Observation",
        status: "final",
        subject: { reference: patientRef },
        code: { coding: [{ system: "http://loinc.org", code: "64141-5", display: "Duration of symptoms" }] },
        valueQuantity: { value: duration, unit: "d", system: "http://unitsofmeasure.org", code: "d" }
      }
    });
  }


  //Symptomverschlimmerung als Observation
  if (worsening !== undefined) {
    fhirEntries.push({
      resource: {
        resourceType: "Observation",
        status: "final",
        subject: { reference: patientRef},
        code: { coding: [{ system:"http://loinc.org", code: "88724-0", display: "Symptom worsening status" }]},
        valueCodeableConcept: {
          text: worsening ? "Symptome haben sich verschlimmert" : "Symptome haben sich nicht verschlimmert"
      }
    } 
    })
  }

   // Freitext für extraInfo als Observation
  if (extraInfo) {
    fhirEntries.push({
      resource: {
        resourceType: "Observation",
        status: "final",
        subject: { reference: patientRef },
        code: { coding: [{ system: "http://local-terminology.de/extra-info", code: "extra-info", display: "Zusätzliche Patientennotiz" }] },
        valueString: extraInfo
      }
    });
  }

// E. Strukturierte Anamnese (Allergien, Medikamente, Vorerkrankungen)
  if (allergies && Array.isArray(allergies)) {
    for (const allergy of allergies) {
      if (allergy) {
        fhirEntries.push({
          resource: {
            resourceType: "AllergyIntolerance",
            clinicalStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical", code: "active" }] },
            patient: { reference: patientRef },
            code: { text: allergy }
          }
        });
      }
    }
  }

 if (medications && Array.isArray(medications)) {
    for (const med of medications) {
      if (med && med.name) {
        fhirEntries.push({
          resource: {
            resourceType: "MedicationStatement",
            status: "recorded",
            subject: { reference: patientRef },
            effectiveDateTime: date,
            medication: {
              concept: {
                text: med.name
              }
            },
            ...(med.dosage || med.unit ? {
              dosage: [{
                doseAndRate: [{
                  doseQuantity: {
                    value: med.dosage ? parseFloat(med.dosage) : undefined,
                    unit: med.unit || undefined
                  }
                }],
                ...(med.frequency || med.frequency_unit ? {
                  timing: {
                    repeat: {
                      frequency: med.frequency ? parseInt(med.frequency) : undefined,
                      period: 1,
                      periodUnit: med.frequency_unit === "täglich" ? "d" : (med.frequency_unit === "wöchentlich" ? "wk" : undefined)
                    }
                  }
                } : {})
              }]
            } : {}),
            ...(med.start_date ? {
              note: [{ text: `Eingenommen seit: ${med.start_date}` }]
            } : {})
          }
        });
      }
    }
  }
  

  if (conditions && Array.isArray(conditions)) {
    for (const condition of conditions) {
      if (condition) {
        fhirEntries.push({
          resource: {
            resourceType: "Condition",
            clinicalStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }] },
            subject: { reference: patientRef },
            category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-category", code: "medical-history", display: "Medical History" }] }],
            code: { text: condition }
          }
        });
      }
    }
  }

  return {
    resourceType: "Bundle",
    type: "batch",
    entry: fhirEntries.map(entry => ({
      ...entry,
      request: {
        method: "POST",
        url: entry.resource.resourceType
      }
    }))
  };
}


// 3. HAPI FHIR SERVER EXPORT

/**
 * Sendet ein generiertes FHIR-Bundle an den HAPI FHIR Test-Server.
 * @param accessCode der access code des zu sendenden cases
 * @returns Promise<boolean>
 */

export async function sendFhirToServer(caseId: string): Promise<boolean> {
  
  if (!caseId) {
    console.error("Senden abgebrochen: Keine caseId übergeben. ");
    return false;
  }
  
  const fhirBundle = await buildFhirBundle(caseId);

  if (!fhirBundle) {
    console.error("Senden abgebrochen: Kein FHIR-Bundle übergeben.");
    return false;
  }

  const HAPI_FHIR_URL = "https://hapi.fhir.org/baseR4";

  try {
    const response = await fetch(HAPI_FHIR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/fhir+json",
        "Accept": "application/fhir+json",
      },
      body: JSON.stringify(fhirBundle),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HAPI FHIR Server Fehler (${response.status}):`, errorText);
      return false;
    }

    const responseData = await response.json();
    console.log("Erfolgreich an HAPI FHIR gesendet! Server-Antwort:", responseData);
    return true;

  } catch (error) {
    console.error("Netzwerkfehler beim Senden an Hapi FHIR:", error);
    return false;
  }
}