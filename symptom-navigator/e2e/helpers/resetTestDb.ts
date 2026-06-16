import { Pool } from 'pg';
require('dotenv').config();

const pool = new Pool({
  connectionString: "postgres://postgres:123@127.0.0.1:5432/testlemonlabs_db",
});

export async function resetDb() {
  await pool.query(`
    TRUNCATE cases, case_symptoms, raw_text_symptoms,
    details_no_certain_count, additional_information,
    recommendations RESTART IDENTITY CASCADE;
  `);
}

export { pool };