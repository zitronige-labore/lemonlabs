"use server"
import { redirect } from "next/navigation";
import { connectionPool } from "./lib/db";
import { NextResponse } from 'next/server';

// funktion zum speichern der formulardaten in einer variable und query zum schreiben in die db
export async function saveAlreadyVisited(formData: FormData) {
  const alreadyVisited = formData.get("alreadyVisitedDoctor");
  console.log("test:", alreadyVisited);

  // schreiben der Daten in die DB und return der ID zum Abruf auf assesment
  const dbReturn = await connectionPool.query(
    `INSERT INTO patients (first_name)
    VALUES ($1)
    RETURNING first_name`,
    [alreadyVisited]
  );
  console.log("getAlreadyVisited gespeichert");
  console.log("DB Rückgabe:", dbReturn);

  redirect(`/assessment`);
}

//funktion zum holen der Daten aus der DB und in eine Variable speichern
export async function getAlreadyVisited(prevState: any, formData: FormData) {
  const redundant = formData.get("textfeld");
  const DatenAusDB = await connectionPool.query(`
    SELECT first_name
    FROM patients`
);
  if (DatenAusDB.rows.length > 0) {
  console.log("Abfrageergebnis:", DatenAusDB);
  return DatenAusDB.rows[0].first_name;
  } else {
    console.log("Keine Daten");
    return null;
  }
}

export async function sendPrompt(formData: FormData) {
  const prompt = formData.get("textfeld");

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
  
    const data = await response.json();
  
    console.log('Ollama API Response:', data);
    return data.response;
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process the request' },
      { status: 500 }
    );
  }
} 


