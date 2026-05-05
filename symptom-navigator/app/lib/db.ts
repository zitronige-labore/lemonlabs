const { Pool } = require('pg');
require ('dotenv').config();

export const connectionPool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

//module.exports = connectionPool;