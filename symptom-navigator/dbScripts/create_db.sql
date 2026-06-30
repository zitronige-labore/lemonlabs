CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS case_symptoms CASCADE;
DROP TABLE IF EXISTS symptom_catalog CASCADE;
DROP TABLE IF EXISTS cases CASCADE;
DROP TABLE IF EXISTS details_no_certain_count CASCADE;
DROP TABLE IF EXISTS raw_text_symptoms CASCADE;
DROP TABLE IF EXISTS additional_information CASCADE;
DROP TABLE IF EXISTS medication CASCADE;
DROP TABLE IF EXISTS recommendations CASCADE;

CREATE TABLE cases (
    case_id  SERIAL PRIMARY KEY,
    age      INTEGER,
    sex      CHAR(1),
    date     TIMESTAMP,
    pregnancy BOOLEAN,
    access_code UUID DEFAULT gen_random_uuid()
);

CREATE TABLE additional_information (
    case_id          INTEGER REFERENCES cases(case_id) ON DELETE CASCADE,
    weight           INTEGER,
    height           INTEGER,
    temperature      REAL,
    duration         INTEGER,
    cigarettes_per_day INTEGER,
    alcohol_per_week INTEGER,
    worsening        BOOLEAN,
    breastfeeding    BOOLEAN,
    extraInfo        VARCHAR
);

CREATE TABLE details_no_certain_count (
    case_id  INTEGER REFERENCES cases(case_id) ON DELETE CASCADE,
    category VARCHAR(25),
    detail   VARCHAR(255)
);

CREATE TABLE medication (
    case_id        INTEGER REFERENCES cases(case_id) ON DELETE CASCADE,
    medication     VARCHAR(255),
    dose           INTEGER,
    unit           VARCHAR(5),
    taken_since    DATE,
    frequency      INTEGER,
    frequency_unit VARCHAR(15)
);

CREATE TABLE raw_text_symptoms (
    raw_id       SERIAL PRIMARY KEY,
    raw_symptoms VARCHAR(500)
);

CREATE TABLE case_symptoms (
    case_id    INTEGER REFERENCES cases(case_id) ON DELETE CASCADE,
    name_de    VARCHAR,
    raw_id     INTEGER REFERENCES raw_text_symptoms(raw_id) ON DELETE SET NULL,
    painscale  INTEGER,
    bodyregion VARCHAR
);

CREATE TABLE recommendations (
    rec_id        SERIAL PRIMARY KEY,
    case_id       INTEGER UNIQUE REFERENCES cases(case_id) ON DELETE CASCADE,
    urgency_level INTEGER,
    advice_text   TEXT,
    suspicion1    TEXT,
    suspicion2    TEXT,
    suspicion3    TEXT,
    suspicion4    TEXT,
    suspicion5    TEXT,
    probability1  REAL,
    probability2  REAL,
    probability3  REAL,
    probability4  REAL,
    probability5  REAL
);