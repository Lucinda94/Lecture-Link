/**
 * Module storing the postgres settings.
 * @module postgres-db
 */

/**
 * Import the postgres module
 * @const
 * @module pg
 */
const { Pool } = require('pg');

/**
 * Set up the database connection
 * @const
 */
const pool = new Pool({
    database: 'lecturelink2',
    statement_timeout: 5000,
    host: '/var/run/postgresql'
});
/**
 * Export the modual for use in the application
 */
module.exports.pool = pool;
