// server side actions for assessment page
"use server"

import { getSymptomList } from "../assessment/medicalLogic/SymptomLists"; // for snomed mapping
import { Step, AdditionalData, BasisData, SymptomSelectionList, MedicationEntry } from "../types/assessment"; // needed type
import { connectionPool } from "../dbs/db"; // for database queries



/**
 * Saves form data in variables and writes them to the DB.
 * formData is used instead of passing different data types to stay as close as possible to the default behaviour of a form action.
 * @param formData - FormData object containing all form fields
 * @returns Promise<string> - the case_id of the newly created case as string
 */
export async function saveFormData(formData: FormData) {

    
    // parsing formdata to right format
    const {age, sex, pregnancy, weight, height, medicationList, conditionList, allergyList, temperatureFloat, 
      duration, worseningBool, breastfeedingBool, extraInfo, symptomListJson, symptomTextListJson, timestamp,
      symptomList, symptomTextList, alcoholPerWeek, cigarettesPerDay} 
      = parseFormDataToDbUsable(formData)


    // writing data into db and returning id for later use
    // try catch blocks are added around suitabel inserts (with no dependencies)
    // to ensure as much data as possible is saved if there is an error
    
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
    try{
      await connectionPool.query(
          `
          Insert into additional_information 
          (case_id, weight, height, temperature, duration, 
          worsening, breastfeeding, extrainfo, cigarettes_per_day, alcohol_per_week)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
          `,
          [caseId, weight || null, height || null, temperatureFloat|| null, duration|| null, 
          worseningBool, breastfeedingBool, extraInfo|| null, cigarettesPerDay || null, alcoholPerWeek || null]
      );
    }
    catch {
      console.log("Error saving additional info")
    }


    // insert for multiple values

    // allergies
    try {
      await insertListIntoSymptomsNoCertainCount(allergyList, "allergy", caseId);
    }
    catch {
      console.log("Error saving allergies")
    }
    
    // conditions
    try {
      await insertListIntoSymptomsNoCertainCount(conditionList, "condition", caseId);
    }
    catch {
      console.log("Error saving conditions")
    }

    // medication
    try {
      for(let i = 0; i < medicationList.length; i++) {
        await connectionPool.query(
            `
            Insert into medication 
            (case_id, medication, dose, unit, frequency, frequency_unit, taken_since)
            VALUES ($1, $2, $3, $4, $5, $6, $7);
            `,
            [caseId, medicationList[i].name || null, medicationList[i].dose || null , medicationList[i].unit || null, 
            medicationList[i].frequency || null, medicationList[i].frequencyUnit || null, medicationList[i].since || null]
        );
      }
    }
    catch {
      console.log("Error saving medication entries")
    }

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
    console.log("Formdata saved in DB");
    console.log("DB return:", dbReturn);

    return caseId.toString();
}






/**
 * Truns formdata into correct format to save to db.
 * @param formData - FormData object containing all form fields
 * @returns Promise<{ age, sex, pregnancy, weight, height, medicationList, ... }> - parsed data
 */
function parseFormDataToDbUsable(formData: FormData) {
  
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
    const medicationList = JSON.parse(medication)

    // alcohol
    const alcoholPerWeek = parseInt(formData.get("alcoholPerWeek") as string)

    // smoking
    const cigarettesPerDay = parseInt(formData.get("cigarettesPerDay") as string)

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

    // symptoms (prewritten, raw Text), getting list as string, splitting into list and parsing as json
    // json format made from name/text, painscale and bodyregion

    // for prewritten symptoms
    const selectedSymptoms = formData.get("selectedSymptoms") as string;
    const symptomList = selectedSymptoms.split("|||");

    let symptomListJson = [];
    if (symptomList[0]!="") {
      for(let i = 0; i<symptomList.length; i++) {
        symptomListJson[i] = JSON.parse(symptomList[i])
      }
    }

    //test log for prewritten symptomList
    console.log("test SymptomList:", symptomList, "filled?", (symptomListJson[0]!='' && symptomListJson[0]!=null && symptomListJson[0]!=undefined));


    const symptomText = formData.get("symptomText") as string;
    const symptomTextList = symptomText.split("|||");

    // log for raw text symptomlist
    console.log("test RawSymptomList:", symptomTextList, "filled?", (symptomTextList[0]!='' && symptomTextList[0]!=null && symptomTextList[0]!=undefined));
    
    let symptomTextListJson = [];
    if (symptomTextList[0]!="") {
      for(let i = 0; i<symptomTextList.length; i++) {
        symptomTextListJson[i] = JSON.parse(symptomTextList[i])
      }
    }

    

    // create timestamp
    const timestamp = new Date();


  return { age, sex, pregnancy, weight, height, medicationList, conditionList, allergyList, temperatureFloat, 
    duration, worseningBool, breastfeedingBool, extraInfo, symptomListJson, symptomTextListJson, timestamp,
  symptomList, symptomTextList, alcoholPerWeek, cigarettesPerDay};
}




/**
 * Writes a list of values into the DB if there is no certain length of the list.
 * @param list - list of values (e.g. allergies, medication, conditions)
 * @param nameOfCategory - category name for the "category" column (e.g. "allergy")
 * @param case_id - id of the associated case
 * @returns Promise<void> - no return value, only writes to the DB
 */
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






/**
 * Gets case data from the DB.
 * @param caseId - the case_id of the case
 * @returns Promise<{
 *   caseData: Array<{
 *     sex: 'w' | 'm' | 'd',
 *     age: number,
 *     pregnancy: boolean,
 *     date: Date
 *   }>,
 *   symptomData: Array<{
 *     name_de: string,
 *     painscale: number | null,
 *     bodyregion: string | null
 *   }>,
 *   textSymptomData: Array<{
 *     raw_symptoms: string,
 *     painscale: number | null,
 *     bodyregion: string | null
 *   }>,
 *   additionalInfoData: Array<{
 *     weight: number | null,
 *     height: number | null,
 *     temperature: number | null,
 *     duration: number | null,
 *     worsening: boolean | null,
 *     breastfeeding: boolean | null,
 *     extraInfo: string | null
 *   }>,
 *   allergyData: { allergies: string[] },
 *   medicationData:  {case_id: any, medication: any, dose: any, unit: any, taken_since: any
 *   frequency: any, frequency_unit: any},
 *   conditionsData: { conditions: string[] }
 * }>
 */
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
    AND raw_id IS NULL
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
    SELECT weight, height, temperature, duration, worsening, breastfeeding, extraInfo, cigarettes_per_day, alcohol_per_week 
    FROM additional_information
    WHERE case_id = $1
    ;
    `,
    [caseId]
  );

  const medicationData = await connectionPool.query(`
    SELECT medication, dose, unit, taken_since, frequency, frequency_unit
    FROM medication
    WHERE case_id = $1
    ;
    `,
    [caseId]
  );

  const allergyData = await getDetailsNoCertainCount("allergy", "allergies", caseId)

  const conditionsData = await getDetailsNoCertainCount("condition", "conditions", caseId)


  // return rows
  return {
  caseData: caseData.rows,
  symptomData: symptomData.rows,
  textSymptomData: textSymptomData.rows,
  additionalInfoData: additionalInfoData.rows,
  allergyData,
  medicationData: medicationData.rows,
  conditionsData
  }

}




/**
 * Gets AI data from the DB.
 * @param caseId - the case_id of the case
 * @returns Promise<Array<{
 *   urgency_level: number,        // 1–5
 *   advice_text: string,
 *   suspicion1: string,
 *   suspicion2: string,
 *   suspicion3: string,
 *   suspicion4: string,
 *   suspicion5: string,
 *   probability1: number | null,  // 0–100, already scaled by parseProb
 *   probability2: number | null,
 *   probability3: number | null,
 *   probability4: number | null,
 *   probability5: number | null
 * }>> - rows from the recommendations table (empty array if no AI response exists yet)
 */
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



/**
 * Deletes all data relating to a case.
 * @param caseId - the case_id of the case to delete
 * @returns Promise<void> - deletes all related entries from cases, raw_text_symptoms, case_symptoms, details_no_certain_count, additional_information, recommendations
 */
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
    DELETE FROM medication
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



/**
 * gets case id per access code
 * @param accessCode - the access code of the case
 * @returns Promise<any> - caseId
 */
export async function getCaseIdFromAccessCode(accessCode: string) {
    // DB query to get case id from access code
  const caseId = await connectionPool.query(`
    SELECT case_id FROM cases
    WHERE access_code = $1
    `,
    [accessCode]
  );
  return caseId.rows[0].case_id;
}




/**
 * Deletes data when receiving an access code.
 * @param accessCode - the access code of the case
 * @returns Promise<boolean> - true if a case was found and deleted, otherwise false
 */
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
    console.log("Data for case with access code " + accessCode + " have been deleted.");
    return true;
  } else {
    console.log("No case with access code " + accessCode + " found.");
    return false;
  }

}




/**
 * Accesses case data via access code.
 * @param accessCode - the access code of the case
 * @returns Promise<object|null> - object in the same format as getUserDataFromDB(), or null if no case with this code exists
 */
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
    console.log("Data for case with access code " + accessCode + " has been recieved.");
    console.log("recieved data: ", data);
    return data;
  } else {
    console.log("Kein Fall mit access code " + accessCode + " gefunden.");
    return null;
  }
}



/**
 * Accesses AI data via access code.
 * @param accessCode - the access code of the case
 * @returns Promise<Array|null> - array in the same format as getAiDataFromDB(), or null if no case with this code exists
 */
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




/**
 * Deletes cases older than a certain time (7 days as per product backlog specification).
 * @returns Promise<void> - deletes all cases older than daysUntilDelete days (currently 7)
 */
export async function deleteOldCases() {

  const daysUntilDelete = 7; // change this to 7 later

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




/**
 * Helper function to get details without certain count in proper format.
 * @param category - value of the "category" column (e.g. "allergy", "medication", "condition")
 * @param listName - desired key name in the returned object
 * @param case_id - the case_id of the case
 * @returns Promise<{ [listName]: string[] }> - object with a dynamic key whose value is an array of "detail" values
 */
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





/**
 * Gets the access code for a case.
 * @param caseId - the case_id of the case
 * @returns Promise<string> - the access_code of the case (assumes case_id exists; no null check)
 */
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