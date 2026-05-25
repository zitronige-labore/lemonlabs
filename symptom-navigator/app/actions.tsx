// server side actions for assessment page
"use server"

import { log } from "console";
import { connectionPool } from "./dbs/db"; // for database queries
import { cookies } from 'next/headers' // for cookies
import { parseString } from 'xml2js'; // for xml

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


    // writing additional info into db

    // insert for singular values
    await connectionPool.query(
        `
        Insert into additional_information 
        (case_id, weight, height, temperature, duration, 
        worsening, breastfeeding, extrainfo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `,
        [dbReturn.rows[0].case_id, weight || null, height || null, temperatureFloat|| null, duration|| null, 
        worseningBool, breastfeedingBool, extraInfo|| null]
    );


    // insert for multiple values

    // allergies
    insertListIntoSymptomsNoCertainCount(allergyList, "allergy", dbReturn.rows[0].case_id);

    // medication
    insertListIntoSymptomsNoCertainCount(medicationList, "medication", dbReturn.rows[0].case_id);

    // conditions
    insertListIntoSymptomsNoCertainCount(conditionList, "condition", dbReturn.rows[0].case_id);


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
            [raw_id.rows[0].raw_id, dbReturn.rows[0].case_id, symptomTextListJson[i].painscale, symptomTextListJson[i].bodyregion || null]
        );
      }
    }

    // writing prewritten symptoms into case_symptoms
    if(symptomListJson[0]!='' && symptomListJson[0]!=null && symptomListJson[0]!=undefined){
      for(let i=0; i<symptomList.length; i++) {
        await connectionPool.query(
          `INSERT INTO case_symptoms (name_de, case_id, bodyregion, painscale) 
          VALUES ($1, $2, $3, $4)`,
          [symptomListJson[i].name, dbReturn.rows[0].case_id, symptomListJson[i].bodyRegion, symptomListJson[i].painscale]
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




// function to get the data from the db and use it in frontend
// save data in a variable, prevState is to be able to use the data when outputting, accessCode is passed via formData
export async function getDBData(accessCode: string) {


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




// function to get case data
export async function getUserDataFromDB(caseId: string) {


  // DB queries
  const caseData = await connectionPool.query(`
    SELECT sex, age, pregnancy
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

  const conditionsData = await getDetailsNoCertainCount("conditions", "conditions", caseId)


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




// deleting after certain time (7 days in case of product backlog specification)
export async function deleteOldCases() {

  const current = new Date();

  // query to get cases older than 7 days
  const oldCases = await connectionPool.query(`
    SELECT case_id FROM cases
    WHERE date < $1
    `,
    [current.setDate(current.getDate() - 7)]
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
  const DatenAusDB = await getUserDataFromDB(caseId);

  // db data as string
  const data = JSON.stringify(DatenAusDB, null, 2);

  // define master prompt
  const masterPrompt = `
  du bekommst gleich daten ueber einen Fall, 
  bestehend aus Alter, Geschlecht, Schwangerschaft,
  sowie optional angegeben: Gewicht in kg, Größe in cm, gemessene  Koerpertemperatur in Grad Celsius
  wie lange die Symptome schon anhalten(duration) in Tagen, ob die symptome schlimmer werden(worsening), 
  ob eine Stillzeit vorleigt(breastfeeding), Allergien, Vorerkrankungen, Medikamente die eigenommen werden. 
  sonstige Informationen(extrainfo), und Symptomen.
  Die Symptome findest du entweder in "raw_symptoms" als freitext oder als "name_de" als name fuer ein bestimmtes symptom. 
  Zu den Symptomen gehoert jeweils eine Schmerzskala angabe, falls es sich um ein Schmerzsymptom(painscale) handelt, sowie eine Koerperregion(bodyregion).
  Falls die Koerperregion nicht zur Symptombeschreibung passt, hat ein user eine Fehlerhafte Eingabe gemacht, in diesem Fall die Koerperregion ignorieren.
  null Eintraege ebenfalls irgnorieren.
  Erstelle basierend auf diesen Daten eine Einschaetzung der Dringlichkeit.
  (auf einer Skala von 1: keine Aerztliche Abklaerung noetig, 2: ärztliche Abklärung empfohlen, 3: ärztliche Abklärung zeitnah erforderlich, 4: gang in die notaufnahme erforderlich, 5: Notruf taetigen),
  eine Liste von 5 möglichen vermutungen was der Grund ist, und dazu die Wahrscheinlichkeit der vermutung. 
  Erkläre kurz die Gründea für jede Vermutung.
  Gebe den Patienten in einfacher Sprache eine kurze Handlungsempfehlung, was evtl. vom Patienten selbst getan werden sollte, 
  und falls ein Arzt aufgesucht werden soll auch die Versorgungsebene. 
  Alles laienverständlich und in kurzen Sätzen. 
  NUR in diesem XML Format antworten, keinen Text ausserhalb des XMLs, 
  <nextSteps></nextSteps> DARF NUR 1 mal vorkommen und DARF NUR freitext enthalten. 
  NUR die vorgegebenen xml tags nutzen, nur diese xml tags sind erlaubt, keine weiteren ausdenken, in next steps: nur eine handlungsempfehlung in einfacher sprache ausgeben:
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
    const response = await fetch('http://141.19.141.155:4000/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-rwai1swh1cJ0JOROAK8iLA',
        'x-api-key': 'sk-rwai1swh1cJ0JOROAK8iLA'
      },
      body: JSON.stringify({
        model: 'medgemma:27b',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }),
    });


    // data contains response from ai
    const dataUnproccesed = await response.json();
    console.log('HTTP Status:', response.status);
    let xmlData: any;

    const xmlMatch = (dataUnproccesed.choices[0].message.content as string).match(/<assessment[\s\S]*<\/assessment>/);
    if (!xmlMatch) {
      throw new Error('falsches Antwortformat fuer XML');
    }
    const xmlProperFormat = xmlMatch[0];

    console.log(xmlProperFormat)

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
  
  // error if somethign goes wrong
  } catch (error) {
      console.error('Fehler details:', JSON.stringify(error, null, 2));
      console.error('Fehler message:', error instanceof Error ? error.message : error);
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