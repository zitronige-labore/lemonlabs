// server side actions for assessment page
"use server"

import { connectionPool } from "../db"; // for database queries
import { cookies } from 'next/headers' // for cookies
import { randomUUID } from 'crypto'; // for generating access codes for the db data
import { NextResponse } from 'next/server'; // for redirecting and returning json responses in this case mainly ai responses
import { access } from "fs";

// function to save form data in variables and query to write to the db
export async function saveFormData(formData: FormData, redFlags: any, selectedRegion: any) {

    // form data is saved in variables and converted to the correct type
    const age = parseInt(formData.get("age") as string);

    const sexString = formData.get("gender") as string;
    let sex = '';
    if (sexString === "weiblich") {
        sex = 'w';
    } else if (sexString === "männlich") {
        sex = 'm';
    } else if (sexString === "divers") {
        sex = 'd';
    }

    let pregnancy = false;
    if (formData.get("pregnancy") === "ja") {
        pregnancy = true;
    }

    //test log
    console.log("test:", formData.toString());
    console.log("redFlags:", redFlags);
    console.log("selectedRegion:", selectedRegion);

    // generate uuid as access code for the db data later on
    const accessCode = randomUUID();

    // schreiben der Daten in die DB und return der ID zum Abruf auf assesment
    const dbReturn = await connectionPool.query(
        `
        Insert into cases (age, sex, pregnancy)
        VALUES ($1, $2, $3)

        returning case_id;
        `,
        [age, sex, pregnancy]
    );

    /*await connectionPool.query(
        `
        insert into assessments (access_code)
        VALUES ($1)
        `,
        [accessCode]
    );*/


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
    WHERE case_id = ${accessCode}
    `
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

  // get data from db
  // DB query
  // to be replaced later
  const DatenAusDB = await connectionPool.query(`
    SELECT * FROM cases
    `
  );
  // erste Zeile übergeben, achtung nur zu beispielzwecken! Muss später anders gehandelt werden
  const data = DatenAusDB.rows[0];

  // define master prompt
  const masterPrompt = "";

  // add master prompt to user prompt
  const prompt = masterPrompt + "\n" + data;

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
    const data = await response.json();
  
    // printing response
    console.log('medgemma response:', data.response);
    return data.response;
  // throwing error if somethign goes wrong
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process the request' },
      { status: 500 }
    );
  }
} 