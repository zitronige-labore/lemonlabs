import { pool } from './resetTestDb';

// exports last case from test db
export async function getCaseFromDb() {
  const result = await pool.query(`
    SELECT * FROM cases ORDER BY case_id DESC LIMIT 1
  `);
  return result.rows[0] ?? null;
}

export async function getAdditionalInfoFromDb(caseId: string) {
  const result = await pool.query(`
    SELECT * FROM additional_information WHERE case_id = $1
  `, [caseId]);
  return result.rows[0] ?? null;
}

export async function getSymptomsFromDb(caseId: string) {
  const result = await pool.query(`
    SELECT * FROM case_symptoms WHERE case_id = $1
  `, [caseId]);
  return result.rows;
}

export async function getRecommendationFromDb(caseId: string) {
  const result = await pool.query(`
    SELECT * FROM recommendations WHERE case_id = $1
  `, [caseId]);
  return result.rows[0] ?? null;
}

export async function getDetailsNoCertainCountFromDb(caseId: string, category: string) {
  const result = await pool.query(`
    SELECT detail
    FROM details_no_certain_count
    WHERE case_id = $1
    AND category = $2
    ;
    `,
    [caseId, category]
  );
  return result.rows.map((row: any) => row.detail);
}