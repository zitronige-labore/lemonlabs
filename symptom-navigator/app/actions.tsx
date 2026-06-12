// server side actions for assessment page
"use server"

import { log } from "console";
import { connectionPool } from "./dbs/db"; // for database queries
import { cookies } from 'next/headers' // for cookies
import { parseString } from 'xml2js'; // for xml
import { AdditionalData, BasisData } from "./types/assessment";

// function to save form data in variables and query to write to the db
// formData is used instead of passing different data types to stay as close as possible to the default behaviour of a form action
export async function saveFormData(formData: FormData) {

    // form data is saved in variables and converted to the correct type


    // age
    const age = parseInt(formData.get("age") as string);

    //sex
    const sexString = formData.get("gender") as string;
    let sex = '';
    if (sexString === "weiblich") {
        sex = 'w';
    } else if (sexString === "männlich") {
        sex = 'm';
    } else if (sexString === "divers") {
        sex = 'd';
    }

    //pregnancy
    let pregnancy = false;
    if (formData.get("pregnancy") === "ja") {
        pregnancy = true;
    }

    //weight
    const weight = parseInt(formData.get("weight") as string);

    // height
    const height = parseInt(formData.get("height") as string); 

    // medication
    const medication = formData.get("medication") as string;
    const medicationList = medication.split(",").map(s => s.trim()).filter(s => s !== "");;
    console.log("medicationList: ", medicationList)

    // conditions
    const conditions = formData.get("conditions") as string;
    const conditionList = conditions.split(",").map(s => s.trim()).filter(s => s !== "");;

    // allergies
    const allergies = formData.get("allergies") as string;
    const allergyList = allergies.split(",").map(s => s.trim()).filter(s => s !== "");;

    // temperature
    const temperature = formData.get("temperature") as string;
    const temperatureFloat = parseFloat(temperature.replace(",", "."));

    // duration
    const duration = parseInt(formData.get("duration") as string);

    // worsening
    const worsening = formData.get("worsening") as string;
    let worseningBool = null;
    if(worsening == "ja") {
      worseningBool = true; 
    }
    else if(worsening == "nein") {
      worseningBool = false;
    }
    console.log("worsening: ", worseningBool)

    // breastfeeding
    const breastfeeding = formData.get("breastfeeding") as string;
    let breastfeedingBool = null;
    if(breastfeeding === "ja") {
      breastfeedingBool = true; 
    }
    else if(breastfeeding === "nein") {
      breastfeedingBool = false;
    }
    console.log("breastfeeding: ", breastfeedingBool)

    const extraInfo = formData.get("extraInfo") as string;
    console.log("extrainfo: ", extraInfo)

    // symptoms (prewritten, raw Text)
    const selectedSymptoms = formData.get("selectedSymptoms") as string;
    const symptomList = selectedSymptoms.split("|||");
    console.log(symptomList)
    let symptomListJson = [];
    if (symptomList[0]!="") {
      for(let i = 0; i<symptomList.length; i++) {
        symptomListJson[i] = JSON.parse(symptomList[i])
      }
    }

    const symptomText = formData.get("symptomText") as string;
    const symptomTextList = symptomText.split("|||");
    console.log("test RawSymptomList:", symptomTextList, "filled?", (symptomTextList[0]!='' && symptomTextList[0]!=null && symptomTextList[0]!=undefined));
    let symptomTextListJson = [];
    if (symptomTextList[0]!="") {
      for(let i = 0; i<symptomTextList.length; i++) {
        symptomTextListJson[i] = JSON.parse(symptomTextList[i])
      }
    }

    //test log
    console.log("test SymptomList:", symptomList, "filled?", (symptomListJson[0]!='' && symptomListJson[0]!=null && symptomListJson[0]!=undefined));
    console.log("test:", formData.toString());

    // create timestamp
    const timestamp = new Date();

    // writing data into db and returning id for later use
    const dbReturn = await connectionPool.query(
        `
        Insert into cases (age, sex, pregnancy, date)
        VALUES ($1, $2, $3, $4)

        returning case_id, access_code;
        `,
        [age, sex, pregnancy, timestamp]
    );

    const caseId = dbReturn.rows[0].case_id;


    // writing additional info into db

    // insert for singular values
    await connectionPool.query(
        `
        Insert into additional_information 
        (case_id, weight, height, temperature, duration, 
        worsening, breastfeeding, extrainfo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `,
        [caseId, weight || null, height || null, temperatureFloat|| null, duration|| null, 
        worseningBool, breastfeedingBool, extraInfo|| null]
    );


    // insert for multiple values

    // allergies
    insertListIntoSymptomsNoCertainCount(allergyList, "allergy", caseId);

    // medication
    insertListIntoSymptomsNoCertainCount(medicationList, "medication", caseId);

    // conditions
    insertListIntoSymptomsNoCertainCount(conditionList, "condition", caseId);


    // writing raw text symptoms in db
    let raw_id = null;
    if(symptomTextList[0]!='' && symptomTextList[0]!=null && symptomTextList[0]!=undefined){
      for(let i=0; i<(symptomTextList.length); i++) {
        raw_id = await connectionPool.query(
            `
            insert into raw_text_symptoms (raw_symptoms)
            VALUES ($1)
            returning raw_id;
            `,
            [symptomTextListJson[i].text_symptom]
        );

        await connectionPool.query(
            `
            insert into case_symptoms (raw_id, case_id, painscale, bodyregion)
            VALUES ($1, $2, $3, $4)
            `,
            [raw_id.rows[0].raw_id, caseId, symptomTextListJson[i].painscale, symptomTextListJson[i].bodyregion || null]
        );
      }
    }

    // writing prewritten symptoms into case_symptoms
    if(symptomListJson[0]!='' && symptomListJson[0]!=null && symptomListJson[0]!=undefined){
      for(let i=0; i<symptomList.length; i++) {
        await connectionPool.query(
          `INSERT INTO case_symptoms (name_de, case_id, bodyregion, painscale) 
          VALUES ($1, $2, $3, $4)`,
          [symptomListJson[i].name, caseId, symptomListJson[i].bodyRegion, symptomListJson[i].painscale]
        );
      }
    }


    // test logs
    console.log("Formulardaten in DB gespeichert");
    console.log("DB Rückgabe:", dbReturn);

    // set cookie to acess later on
    const sessionCookie = await cookies();
    sessionCookie.set({name: 'caseId', value: caseId, httpOnly: true, path: '/' });
    return caseId.toString();
}



// function to write information into db if there is no certain length of the list
export async function insertListIntoSymptomsNoCertainCount(list: string[], nameOfCategory: string, case_id: BigInteger) {

  for(const element of list) {
      await connectionPool.query(
        `
        Insert into details_no_certain_count 
        (case_id, category, detail)
        VALUES ($1, $2, $3);
        `,
        [case_id, nameOfCategory, element || null]
    );
    }

}






// function to get case data
export async function getUserDataFromDB(caseId: string) {


  // DB queries
  const caseData = await connectionPool.query(`
    SELECT sex, age, pregnancy, date
    FROM cases
    WHERE case_id = $1
    ;
    `,
    [caseId]
  );

  const symptomData = await connectionPool.query(`
    SELECT name_de, painscale, bodyregion
    FROM case_symptoms
    WHERE case_id = $1
    ;
    `,
    [caseId]
  );

  const textSymptomData = await connectionPool.query(`
    SELECT raw_symptoms, painscale, bodyregion
    FROM raw_text_symptoms
    INNER JOIN case_symptoms
    ON raw_text_symptoms.raw_id = case_symptoms.raw_id
    WHERE case_id = $1
    ;
    `,
    [caseId]
  );

  const additionalInfoData = await connectionPool.query(`
    SELECT weight, height, temperature, duration, worsening, breastfeeding, extraInfo
    FROM additional_information
    WHERE case_id = $1
    ;
    `,
    [caseId]
  );

  const allergyData = await getDetailsNoCertainCount("allergy", "allergies", caseId)

  const medicationData = await getDetailsNoCertainCount("medication", "medication", caseId)

  const conditionsData = await getDetailsNoCertainCount("condition", "conditions", caseId)


  // return rows
  return {
  caseData: caseData.rows,
  symptomData: symptomData.rows,
  textSymptomData: textSymptomData.rows,
  additionalInfoData: additionalInfoData.rows,
  allergyData,
  medicationData,
  conditionsData
  }

}



// function to get ai data from db
export async function getAiDataFromDB(caseId: string) {
  const aiData = await connectionPool.query(`
    SELECT urgency_level, advice_text, suspicion1, suspicion2, suspicion3, suspicion4, suspicion5, probability1, probability2, probability3, probability4, probability5
    FROM recommendations
    WHERE case_id = $1
    `,
    [caseId]
  );

  return aiData.rows;
}



// function to delete all data relating to a case
export async function deleteCaseData(caseId: string) {


  // deleting all data from tables containing case specific data

  await connectionPool.query(`
    DELETE FROM cases
    WHERE case_id = $1
  `,
  [caseId]
  );

  await connectionPool.query(`
    DELETE FROM raw_text_symptoms
    USING case_symptoms
    WHERE case_symptoms.raw_id = raw_text_symptoms.raw_id
    AND case_id = $1
  `,
  [caseId]
  );

  await connectionPool.query(`
    DELETE FROM case_symptoms
    WHERE case_id = $1
  `,
  [caseId]
  );

  await connectionPool.query(`
    DELETE FROM details_no_certain_count
    WHERE case_id = $1
  `,
  [caseId]
  );

  await connectionPool.query(`
    DELETE FROM additional_information
    WHERE case_id = $1
  `,
  [caseId]
  );

  await connectionPool.query(`
    DELETE FROM recommendations
    WHERE case_id = $1
  `,
  [caseId]
  );
}



// deleting data when recieving access code
export async function deleteDataOnAccessCode(accessCode: string) {

  // DB query to get case id from access code
  const caseId = await connectionPool.query(`
    SELECT case_id FROM cases
    WHERE access_code = $1
    `,
    [accessCode]
  );

  // deleting if case exists
  if (caseId.rows.length > 0) {
    await deleteCaseData(caseId.rows[0].case_id);
    console.log("Daten für Fall mit access code " + accessCode + " wurden gelöscht.");
    return true;
  } else {
    console.log("Kein Fall mit access code " + accessCode + " gefunden.");
    return false;
  }

}


// accessing data via access code
export async function accessDataWithAccessCode(accessCode: string) {

  // DB query to get case id from access code
  const caseId = await connectionPool.query(`
    SELECT case_id FROM cases
    WHERE access_code = $1
    `,
    [accessCode]
  );

  // returning data if case exists
  if (caseId.rows.length > 0) {
    const data = await getUserDataFromDB(caseId.rows[0].case_id);
    console.log("Daten für Fall mit access code " + accessCode + " wurden abgerufen.");
    console.log("Abgerufene Daten:", data);
    return data;
  } else {
    console.log("Kein Fall mit access code " + accessCode + " gefunden.");
    return null;
  }
}

export async function accessAiDataWithAccessCode(accessCode: string) {

    // DB query to get case id from access code
  const caseId = await connectionPool.query(`
    SELECT case_id FROM cases
    WHERE access_code = $1
    `,
    [accessCode]
  );

  // returning data if case exists
  if (caseId.rows.length > 0) {
    const data = await getAiDataFromDB(caseId.rows[0].case_id);
    console.log("Ai Daten für Fall mit access code " + accessCode + " wurden abgerufen.");
    console.log("Abgerufene Daten:", data);
    return data;
  } else {
    console.log("Kein Fall mit access code " + accessCode + " gefunden.");
    return null;
  }

}




// deleting after certain time (7 days in case of product backlog specification)
export async function deleteOldCases() {

  const daysUntilDelete = 0; // change this to 7 later

  const cutoff = new Date(
    Date.now() - daysUntilDelete * 24 * 60 * 60 * 1000
  );

  // query to get cases older than 7 days
  const oldCases = await connectionPool.query(`
    SELECT case_id FROM cases
    WHERE date < $1
    `,
    [cutoff]
  );

  // delete each old cases
  for (const row of oldCases.rows) {
    await deleteCaseData(row.case_id);
  }

}




// helper function to get details without count as proper format
export async function getDetailsNoCertainCount(category: string, listName: string, case_id: string) {
  
  const DataList = await connectionPool.query(`
    SELECT detail
    FROM details_no_certain_count
    WHERE case_id = $1
    AND category = $2
    ;
    `,
    [case_id, category]
  );

  return {[listName]: DataList.rows.map((row: any) => row.detail)};
}





// function to get access code
export async function getAccessCode(caseId: string) {
  

  const accessCode = await connectionPool.query(`
    SELECT access_code
    FROM cases
    WHERE case_id = $1
    ;
    `,
    [caseId]
  );

  return accessCode.rows[0].access_code;
}





// function to send and recieve promt/response from ollama, same concept for the argument as getDBData above
export async function sendDataToAi(basisData?: BasisData, additionalData?: AdditionalData, symptomText?: string[], selectedymptoms?: string[], caseId?: string) {


  // using cashe or db data depending on arguments given
  let cacheData = null;
  let DBdata = null;


  if (basisData && additionalData && symptomText && selectedymptoms) {
    cacheData = buildUnifiedData(basisData, additionalData, symptomText, selectedymptoms)
  }

  if(cacheData == null && caseId) {
    // get data from db
    DBdata = await getUserDataFromDB(caseId);
  }

  const data = cacheData != null ? cacheData : DBdata;

  // in case neither db data nor cashe data are available
  if (data == null) {
    console.error("Keine Daten verfügbar (weder Cache noch DB).");
    return;
  }
  

  // define promt
  const prompt = buildAiPrompt(data)

  console.log("promt: ", prompt, "case data: ", data.caseData, 
    "additionalInfo: ", data.additionalInfoData, 
    "symptoms: ", data.symptomData, "text symptoms: ", data.textSymptomData, 
    "conditions: ", data.conditionsData.conditions, "allergies: ", data.allergyData.allergies, 
    "medication: ", data.medicationData.medication)

  // JSON schema for ai answer (looks weird because it used to be xml (yes there was a reason for that too, it was not just because I felt like it))
  const format = aiAnswerFormat;

  try {
    // Make request to Ollama API
    const response = await fetch(process.env.MEDGEMMA_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MEDGEMMA_API_KEY}`,
        'x-api-key': process.env.MEDGEMMA_API_KEY!
      },
      body: JSON.stringify({
        model: `${process.env.MEDGEMMA_API_MODEL}`,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        format: format
      }),
    });

    // data contains response from ai
    const dataUnprocessed = await response.json();
    console.log('HTTP Status:', response.status);

    // response as json as for some reason it is apparently not json enough yet
    const result = JSON.parse(dataUnprocessed.choices[0].message.content);

    // trying to remove some common errors
    const parseProb = (val: unknown): number | null => {
      const num = parseFloat(String(val).replace('%', '').replace(',', '.').replace(':', ''));
      return isNaN(num) ? null : Math.min(100, Math.max(0, num <= 1 ? num * 100 : num));
    };

    // printing response
    console.log('medgemma response as object:', result, 
    "\nsuspicion1:", result.assessment.suspicions.suspicion1.reasonForSuspicion1, 
    result.assessment.suspicions.suspicion1.probability1,
    "\nsuspicion2:", result.assessment.suspicions.suspicion2.reasonForSuspicion2, 
    result.assessment.suspicions.suspicion2.probability2,
    "\nsuspicion3:", result.assessment.suspicions.suspicion3.reasonForSuspicion3, 
    result.assessment.suspicions.suspicion3.probability3,
    "\nsuspicion4:", result.assessment.suspicions.suspicion4.reasonForSuspicion4, 
    result.assessment.suspicions.suspicion4.probability4,
    "\nsuspicion5:", result.assessment.suspicions.suspicion5.reasonForSuspicion5, 
    result.assessment.suspicions.suspicion5.probability5);

    await connectionPool.query(
      `
      INSERT INTO recommendations (case_id, urgency_level, advice_text, suspicion1, suspicion2, suspicion3, suspicion4, suspicion5, probability1, probability2, probability3, probability4, probability5)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `,
      [
        caseId,
        result.assessment.urgency,
        result.assessment.nextSteps,
        result.assessment.suspicions.suspicion1.reasonForSuspicion1,
        result.assessment.suspicions.suspicion2.reasonForSuspicion2,
        result.assessment.suspicions.suspicion3.reasonForSuspicion3,
        result.assessment.suspicions.suspicion4.reasonForSuspicion4,
        result.assessment.suspicions.suspicion5.reasonForSuspicion5,
        parseProb(result.assessment.suspicions.suspicion1.probability1),
        parseProb(result.assessment.suspicions.suspicion2.probability2),
        parseProb(result.assessment.suspicions.suspicion3.probability3),
        parseProb(result.assessment.suspicions.suspicion4.probability4),
        parseProb(result.assessment.suspicions.suspicion5.probability5),
      ]
    );

    return result;

  } catch (error) {
    console.error('Fehler details:', JSON.stringify(error, null, 2));
    console.error('Fehler message:', error instanceof Error ? error.message : error);
  }
}





// function to build one type of data construct for the ai to proccess
export function buildUnifiedData(
  basisData?: BasisData,
  additionalData?: AdditionalData,
  symptomText?: string[],
  selectedymptoms?: string[]
) {
  if (!basisData || !additionalData || !symptomText || !selectedymptoms) {
    return null;
  }

  return {
    caseData: basisData,
    symptomData: selectedymptoms,
    textSymptomData: symptomText,
    additionalInfoData: additionalData,
    allergyData: { allergies: additionalData.allergies },
    medicationData: { medication: additionalData.medication },
    conditionsData: { conditions: additionalData.conditions },
  };
}




// building prompt
export function buildAiPrompt(data: NonNullable<ReturnType<typeof buildUnifiedData> | Awaited<ReturnType<typeof getUserDataFromDB>>>) {
  return `
  EINGABEDATEN:
  - Alter, Geschlecht, Schwangerschaft:
  ${JSON.stringify(data.caseData, null, 2)}
  - Optional: Gewicht (kg), Groesse (cm), Koerpertemperatur (°C), Symptomdauer (Tage), 
  Verschlimmerung, Stillzeit, Allergien, Vorerkrankungen, Medikamente:
  ${JSON.stringify(data.additionalInfoData, null, 2)}
  ${JSON.stringify(data.allergyData.allergies, null, 2)}
  ${JSON.stringify(data.conditionsData.conditions, null, 2)}
  ${JSON.stringify(data.medicationData.medication, null, 2)}
  - Symptome (vordefiniert, Feld "name_de"):
    - Schmerzskala (painscale) und Koerperregion (bodyregion) pro Symptom
    - Falls die Koerperregion nicht zur Symptombeschreibung passt, ignoriere sie
    ${JSON.stringify(data.symptomData, null, 2)}
  -Frei beschriebene Symptome (Feld "raw_symptoms"):
    - Schmerzskala (painscale) und Koerperregion (bodyregion) pro Symptom
    - Falls die Koerperregion nicht zur Symptombeschreibung passt, ignoriere sie
    ${JSON.stringify(data.textSymptomData, null, 2)}
  - null-Eintraege und leere Listen ueberall ignorieren

  Erstelle basierend auf diesen Daten:
  1. eine Einschaetzung der Dringlichkeit auf einer Skala von 1 bis 5
  ( 1 - Beobachtung der Beschwerden
    2 -  Arztbesuch erforderlich
    3 -  Zeitnahe medizinische Abklärung erforderlich
    4 - Möglicher medizinischer Notfall
    5 - Akuter Notfall ),
  2. eine Liste von 5 moeglichen Vermutungen
  3. Wahrscheinlichkeiten fuer jede Vermutung (NUR als 0.XX angeben, NICHT in Prozent umwandeln oder mit Worten)
  4. kurze Begruendung der Vermutungen
  5. eine kurze Handlungsempfehlung in einfacher Sprache fuer den Patienten, hier keine Vermutungen
`;
}




// JSON schema for ai answer (looks weird because it used to be xml (yes there was a reason for that too, it was not just because I felt like it))
  const aiAnswerFormat = {
  type: "object",
  properties: {
    assessment: {
      type: "object",
      properties: {
        urgency: { 
          type: "number",
          minimum: 1,
          maximum: 5
        },
        urgencyText: { type: "string" },
        suspicions: {
          type: "object",
          properties: {
            suspicion1: {
              type: "object",
              properties: {
                reasonForSuspicion1: { type: "string" },
                probability1: {
                  type: "number",
                  minimum: 0,
                  maximum: 1,
                  description: "Wahrscheinlichkeit als Dezimalzahl zwischen 0 und 1, z.B. 0.35"
                }
              },
              required: ["reasonForSuspicion1", "probability1"]
            },
            suspicion2: {
              type: "object",
              properties: {
                reasonForSuspicion2: { type: "string" },
                probability2: {
                  type: "number",
                  minimum: 0,
                  maximum: 1,
                  description: "Wahrscheinlichkeit als Dezimalzahl zwischen 0 und 1, z.B. 0.35"
                }
              },
              required: ["reasonForSuspicion2", "probability2"]
            },
            suspicion3: {
              type: "object",
              properties: {
                reasonForSuspicion3: { type: "string" },
                probability3: {
                  type: "number",
                  minimum: 0,
                  maximum: 1,
                  description: "Wahrscheinlichkeit als Dezimalzahl zwischen 0 und 1, z.B. 0.35"
                }
              },
              required: ["reasonForSuspicion3", "probability3"]
            },
            suspicion4: {
              type: "object",
              properties: {
                reasonForSuspicion4: { type: "string" },
                probability4: {
                  type: "number",
                  minimum: 0,
                  maximum: 1,
                  description: "Wahrscheinlichkeit als Dezimalzahl zwischen 0 und 1, z.B. 0.35"
                }
              },
              required: ["reasonForSuspicion4", "probability4"]
            },
            suspicion5: {
              type: "object",
              properties: {
                reasonForSuspicion5: { type: "string" },
                probability5:  {
                  type: "number",
                  minimum: 0,
                  maximum: 1,
                  description: "Wahrscheinlichkeit als Dezimalzahl zwischen 0 und 1, z.B. 0.35"
                }
              },
              required: ["reasonForSuspicion5", "probability5"]
            }
          },
          required: ["suspicion1", "suspicion2", "suspicion3", "suspicion4", "suspicion5"]
        },
        nextSteps: { type: "string" }
      },
      required: ["urgency", "urgencyText", "suspicions", "nextSteps"]
    }
  },
  required: ["assessment"]
};




/*
// function for fhir mapping patient data
export async function mappingFhirPerson() {
  
  // cookies auslesen um case id zu bekommen
  const cookieStore = await cookies();
  const caseId = cookieStore.get('caseId')?.value;

  // daten fuer patient auslesen
  let genderDB = await connectionPool.query(
    `
    SELECT sex FROM cases
    WHERE case_id = $1
    `,
    [caseId]);


  // gender in fhir akzeptierte strings umwandeln
  let gender = genderDB.rows[0].sex;
  if (gender == 'm') {
    gender = 'male';
  } else if (gender == 'w') {
    gender = 'female';
  } else if (gender == 'd') {
    gender = 'other';
  }
  else {
    gender = 'unknown';
  }

  // schaetzung fuer birthdate basierend auf dem alter, evtl. rausnehmen
  const DBage = await connectionPool.query(
  `
  SELECT age FROM cases
  WHERE case_id = $1
  `,
  [caseId]); 
    
  const approxBirthdate = new Date().getFullYear() - DBage.rows[0].age + "-01-01";

  const patient = {
  "resourceType" : "Patient",
  "identifier" : [],
  "active" : true,
  "gender" : gender, // male | female | other | unknown
  "birthDate" : approxBirthdate, // The date of birth for the individual
  "managingOrganization" : "lemonlabs - th mannheim", // Organization that is the custodian of the patient record
  }

  return patient;
}




// function for fhir mapping observations iun our case symptoms and basisdata and additional data 
export async function mappingFhirObservation() {

  const ovservation = {
  "resourceType" : "Observation",
  // from Resource: id, meta, implicitRules, and language
  // from DomainResource: text, contained, extension, and modifierExtension
  "identifier" : [], // Business Identifier for observation
  "category" : [], // Classification of  type of observation
  "code" : {}, // I R!  Type of observation (code / type)
  "subject" : "Patient", // Who and/or what the observation is about
  "organizer" : null, // I This observation organizes/groups a set of sub-observations
  // effective[x]: Clinically relevant time/time-period for observation. One of these 4:
  "effectiveDateTime" : "<dateTime>",
  "issued" : "<instant>", // Date/Time this version was made available
  "performer" : "Patient", // Who is responsible for the observation
  // value[x]: Actual result. One of these 12:
  "valueQuantity" : {},
  "valueCodeableConcept" : {},
  "valueString" : "<string>",
  "valueBoolean" : null,
  "valueInteger" : null,
  "valueTime" : "<time>",
  "valueDateTime" : "<dateTime>",
  "valuePeriod" : {},
  "interpretationContext" : [], // Context for understanding the observation
  "note" : [], // Comments about the observation
  "bodySite" : {}, // DEPRECATED: Observed body part, CodeableReference(BodySite)
  "bodyStructure" : {}, // Observed body structure,  CodeableReference(BodyStructure) 
  "method" : {}, // How it was done, CodeableConcept
  "hasMember" : [], // Related resource that belongs to the Observation group, { Reference(Observation|QuestionnaireResponse) }
  "derivedFrom" : [], // Related resource from which the observation is made, { Reference(DocumentReference|ImagingSelection|ImagingStudy|Observation|QuestionnaireResponse) }
  "component" : [{ // I Component results
    "code" : {}, // I R!  Type of component observation (code / type)
    // value[x]: Actual component result. One of these 12:
    "valueQuantity" : {},
    "valueCodeableConcept" : {},
    "valueString" : "<string>",
    "valueBoolean" : null,
    "valueInteger" : null,
    "valueRange" : {},
    "valueRatio" : {},
    "valueSampledData" : {},
    "valueTime" : "<time>",
    "valueDateTime" : "<dateTime>",
    "valuePeriod" : {},
    "valueAttachment" : {},
    "dataAbsentReason" : {}, // I Why the component result value is missing
    "interpretation" : [], // High, low, normal, etc
    "referenceRange" : [] // Provides guide for interpretation of component result value
  }]
}

}*/