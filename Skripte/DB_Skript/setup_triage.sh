#!/bin/bash
DB_NAME="lemonlabs_db"
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
DROP TABLE IF EXISTS cases CASCADE;


CREATE TABLE cases (
	case_id SERIAL PRIMARY KEY,
	age INTEGER,
	sex CHAR(1),
	pregnancy BOOLEAN,
	weight INTEGER,
	date TIMESTAMP
);

CREATE TABLE drug_use (
	alcohol BOOLEAN
	cigarettes BOOLEAN,
	drugs BOOLEAN,
	drug_name VARCHAR(100)
);

CREATE TABLE details_no_certain_count (
	case_id INTEGER,
	detail VARCHAR(25),
	value(50)
);

CREATE TABLE symptom_catalog (
	symptom_id SERIAL PRIMARY KEY,
	name_de VARCHAR(255) NOT NULL,
	snomed_code VARCHAR(50) UNIQUE,
	is_red_flag BOOLEAN DEFAULT FALSE
);

INSERT INTO symptom_catalog (name_de, snomed_code, is_redflag)
VALUES ("Besitz einer Katze", "1234", no) 

;

CREATE TABLE redflag_scan (
  	redflag_id SERIAL PRIMARY KEY,
	redflag_name VARCHAR(100)
)

CREATE TABLE assessments (
	assessment_id SERIAL PRIMARY KEY, 
	case_id INTEGER REFERENCES cases(case_id) ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	access_code INTEGER UNIQUE 
        
);

CREATE TABLE raw_text_symptoms (
	raw_id SERIAL PRIMARY KEY,
	raw_symptoms VARCHAR(500)
);

CREATE TABLE assessment_symptoms ( 
	assessment_id INTEGER REFERENCES assessments(assessment_id) ON DELETE CASCADE,
	symptom_id INTEGER REFERENCES symptom_catalog(symptom_id),
	PRIMARY KEY (assessment_id, symptom_id)
);

CREATE TABLE recommendations (
	rec_id SERIAL PRIMARY KEY,
	assessment_id INTEGER UNIQUE REFERENCES assessments(assessment_id) ON DELETE CASCADE,
	urgency_level INTEGER,
	advice_text TEXT,
	context_data JSONB,
	fhir_json JSONB
);

EOF

echo "Setup abgeschlossen!"

 
