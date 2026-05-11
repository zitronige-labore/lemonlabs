// database connection pool
// in this file the connection is defined which is used for queries
// use connectionPool.query() and import "import { connectionPool } from "path/to/db";"" to make queries to the database

const { Pool } = require('pg');
require ('dotenv').config();

export const connectionPool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});