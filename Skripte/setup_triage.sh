#!/bin/bash
DB_NAME="triage_db"
USER_NAME=$(whoami)

echo "Prüfe, ob Datenbank $DB_NAME existiert..."

if psql -lqt | cut -d\| -f 1 | grep -qw "$DB_NAME"; then
	echo "Datenbank ist bereits vorhanden."
else
	echo "Erstelle Datenbank $DB_NAME..."
	createdb $DB_NAME
fi

echo "Initialisiere Tabellen..."

psql -d $DB_NAME <<EOF

DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS assessment_symptoms CASCADE;
DROP TABLE IF EXISTS assessment CASCADE;
DROP TABLE IF EXISTS symptom_catalog CASCADE;
DROP TABLE IF EXISTS patients CASCADE;


CREATE TABLE cases (
	patient_id SERIAL PRIMARY KEY,
	first_name VARCHAR(100),
	last_name VARCHAR (100),
	birth_date DATE
);

CREATE TABLE symptom_catalog (
	symptom_id SERIAL PRIMARY KEY,
	name_de VARCHAR(255) NOT NULL,
	snomed_code VARCHAR(50) UNIQUE,
	is_red_flag BOOLEAN DEFAULT FALSE
);

CREATE TABLE redflag_scan (
  	redflag_id SERIAL PRIMARY KEY,
	redflag_name VARCHAR(100)
)

CREATE TABLE assessments (
	assessment_id SERIAL PRIMARY KEY, 
	patient_id INTEGER REFERENCES patients(patient_id) ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	raw_input TEXT
        
);

CREATE TABLE assessment_symptoms ( 
	assessment_id INTEGER REFERENCES assessments(assessment_id) ON DELETE CASCADE,
	symptom_id INTEGER REFERENCES symptom_catalog(symptom_id),
	confidence_score FLOAT,
	PRIMARY KEY (assessment_id, symptom_id)
);

CREATE TABLE recommendations (
	rec_id SERIAL PRIMARY KEY,
	assessment_id INTEGER UNIQUE REFERENCES assessments(assessment_id) ON DELETE CASCADE,
	urgency_level INTEGER,
	advice_text TEXT,
	fhir_json JSONB
);

EOF

echo "Setup abgeschlossen!"

 
