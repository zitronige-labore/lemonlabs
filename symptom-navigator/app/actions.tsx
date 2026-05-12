// server side actions for assessment page
"use server"

import { log } from "console";
import { connectionPool } from "./dbs/db"; // for database queries
import { cookies } from 'next/headers' // for cookies
import { parseString } from 'xml2js'; // for xml

// function to save form data in variables and query to write to the db
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
    const weight = /*parseInt(formData.get("weight") as string)*/ 70; // 70 is placeholder

    // height
    const height = /*parseInt(formData.get("height") as string)*/ 170; // 170 is placeholder


    // symptoms (prewritten, raw Text)
    const selectedSymptoms = formData.get("selectedSymptoms") as string;
    const symptomList = selectedSymptoms.split(",");

    const symptomText = formData.get("symptomText") as string;
    const symptomTextList = symptomText.split("|||");

    //test log
    console.log("test:", formData.toString());

    // create timestamp
    const timestamp = new Date();

    // writing data into db and returning id for later use
    const dbReturn = await connectionPool.query(
        `
        Insert into cases (age, sex, pregnancy, weight, height, date)
        VALUES ($1, $2, $3, $4, $5, $6)

        returning case_id, access_code;
        `,
        [age, sex, pregnancy, weight, height, timestamp]
    );

    let raw_id = null;
    if(symptomTextList.length>0){
      // writing raw text symptoms in db
      for(let i=0; i<symptomTextList.length; i++) {
        raw_id = await connectionPool.query(
            `
            insert into raw_text_symptoms (raw_symptoms)
            VALUES ($1)
            returning raw_id;
            `,
            [symptomTextList[i]]
        );
      }
    }

    if(symptomList.length>0){
      // writing prewritten symptoms into case_symptoms
      for(let i=0; i<symptomList.length; i++) {
        await connectionPool.query(
          `INSERT INTO case_symptoms (name_de, case_id) 
          VALUES ($1, $2)`,
          [symptomList[i], dbReturn.rows[0].case_id]
        );
      }
    }

    if(symptomText.length){
      // writing raw text ids into case_symptoms
      for(let i=0; i<symptomTextList.length; i++) {
      await connectionPool.query(
            `
            insert into case_symptoms (raw_id, case_id)
            VALUES ($1, $2)
            `,
            [raw_id.rows[i].raw_id, dbReturn.rows[0].case_id]
        );
      }
    }


    // test logs
    console.log("Formulardaten in DB gespeichert");
    console.log("DB Rückgabe:", dbReturn);

    // set cookie to acess later on
    const sessionCookie = await cookies();
    sessionCookie.set({name: 'caseId', value: dbReturn.rows[0].case_id, httpOnly: true, path: '/' });
}





// function to get the data from the db and use it in frontend
// save data in a variable, prevState is to be able to use the data when outputting, accessCode is passed via formData
export async function getDBData(prevState: any, formData: FormData) {

  // get access code from form
const accessCode = parseInt(formData.get("accessCode") as string); 

// DB query
const DatenAusDB = await connectionPool.query(`
    SELECT * FROM cases
    WHERE case_id = $accessCode
    `,
  [accessCode]
);

// catching incorrect inputs and returning data if exists
  if (DatenAusDB.rows.length > 0) {
  console.log("Abfrageergebnis:", DatenAusDB);
  return DatenAusDB.rows[0];
  } else {
    console.log("Keine Daten");
    return null;
  }
}




// function to send and recieve promt/response from ollama, same concept for the argument as getDBData above
export async function sendDataToAi() {

  // reading cookies to get case id
  const cookieStore = await cookies();
  const caseId = cookieStore.get('caseId')?.value;

  if (!caseId) {
  throw new Error('Keine aktive Session gefunden');
  }

  // get data from db
  // DB query
  // to be replaced later
  const DatenAusDB = await connectionPool.query(`
    SELECT weight, height, raw_symptoms, case_symptoms.name_de
    FROM cases LEFT JOIN case_symptoms ON cases.case_id = case_symptoms.case_id
    LEFT JOIN raw_text_symptoms ON raw_text_symptoms.raw_id = case_symptoms.raw_id
    LEFT JOIN symptom_catalog ON symptom_catalog.name_de = case_symptoms.name_de
    WHERE cases.case_id = $1
    ;
    `,
    [caseId]
  );

  // db data as string
  const data = JSON.stringify(DatenAusDB.rows, null, 2);

  // define master prompt
  const masterPrompt = `
  du bekommst gleich daten ueber einen Fall, bestehend aus Alter, Geschlecht, Schwangerschaft, Gewicht, Höhe und Symptomen.
  Die Symptome findest du entweder in "raw_symptoms" als freitext oder als "name_de" als name fuer ein bestimmtes symptom. 
  Erstelle basierend auf diesen Daten eine Einschaetzung der Dringlchkeit 
  (auf einer Skala von 1: keine Aerztliche Abklaerung noetig, 2: ärztliche Abklärung empfohlen, 3: ärztliche Abklärung zeitnah erforderlich, 4: gang in die notaufnahme erforderlich, 5: Notruf taetigen),
  eine Liste von 5 möglichen vermutungen was der Grund ist, und dazu die Wahrscheinlichkeit der vermutung. 
  Erkläre kurz die Gründe für jede Vermutung und nenne mögliche nächste Schritte fuer den patienten zur weiteren Abklärung. 
  Alles laienverständlich und in kurzen Sätzen. 
  Desweiteren bitte NUR in diesem XML Format antworten, keinen Text ausserhalb des XMLs, 
  NUR die vorgegebenen xml tags nutzen, keine weiteren ausdenken, in next steps: nur eine handlungsempfehlung in einfacher sprache im tag <nextSteps> ausgeben:
  <assessment>
  <urgency></urgency>
  <urgencyText></urgencyText>
  <suspicions>
    <suspicion1>
      <reasonForSuspicion1></reasonForSuspicion1>
      <probability1></probability1>
    </suspicion1>
    <suspicion2>
      <reasonForSuspicion2></reasonForSuspicion2>
      <probability2></probability2>
    </suspicion2>
    <suspicion3>
      <reasonForSuspicion3></reasonForSuspicion3>
      <probability3></probability3>
    </suspicion3>
    <suspicion4>
      <reasonForSuspicion4></reasonForSuspicion4>
      <probability4></probability4>
    </suspicion4>
    <suspicion5>
      <reasonForSuspicion5></reasonForSuspicion5>
      <probability5></probability5>
    </suspicion5>
  </suspicions>
  <nextSteps>
  </nextSteps>
  </assessment>
  Hier sind die Daten:`;

  // add master prompt to user prompt
  const prompt = masterPrompt + "\n" + data;

  console.log("Prompt:", prompt);

  try {
    // Make request to Ollama API
    const response = await fetch('http://141.19.141.150:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'medgemma:27b',
        prompt: prompt,
        stream: false,
      }),
    });
  
    // data contains response from ai
    const dataUnproccesed = await response.json();
    let xmlData: any;
    console.log("AI Response original:", dataUnproccesed.response);

    const xmlMatch = (dataUnproccesed.response as string).match(/<assessment[\s\S]*<\/assessment>/);
    if (!xmlMatch) {
      throw new Error('falsches Antwortformat fuer XML');
    }
    const xmlProperFormat = xmlMatch[0];

    parseString(xmlProperFormat, { explicitArray: false }, (err, result) => {
    if (err) {
      throw new Error('Failed parse response as xml');
    }
    xmlData = result;
    });


  
    // printing response
    console.log('medgemma response as object:', xmlData);

    await connectionPool.query(
      `
      INSERT INTO recommendations (case_id, urgency_level, advice_text)
      VALUES ($1, $2, $3)
      `,
      [caseId, xmlData.assessment.urgency, xmlData.assessment.nextSteps]
    );

    return xmlData;
  
  // throwing error if somethign goes wrong
  } catch (error) {
      console.error('Fehler details:', JSON.stringify(error, null, 2));
      console.error('Fehler message:', error instanceof Error ? error.message : error);
      throw new Error('Failed to process the request');
  }
} 




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



/*
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