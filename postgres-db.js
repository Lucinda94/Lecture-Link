const { Pool } = require('pg');

const pool = new Pool({
    database: 'lecturelink',
    statement_timeout: 5000,
    host: '/var/run/postgresql'  
});

module.exports.getAllUsers = async () => {
    const client = await pool.connect();

    try {
        const { rows } = await client.query('SELECT * FROM users');
        return rows;
    } finally {
        // always always always remember to release the client
        client.release()
    }
};

module.exports.getUser = async (id) => {
    const client = await pool.connect();

    try {
        const { rows } = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        return rows[0];
    } finally {
        client.release();
    }
};