const { Pool } = require('pg');

const pool = new Pool({
    database: 'lecturelink',
    statement_timeout: 5000,
    host: '/var/run/postgresql'  
});

// USERS

module.exports.getAllUsers = async () => {
    const client = await pool.connect();

    try {
        const { rows } = await client.query('SELECT * FROM user_account');
        return rows;
    } finally {
        // always always always remember to release the client
        client.release()
    }
};

module.exports.getUser = async (id) => {
    const client = await pool.connect();

    try {
        const { rows } = await client.query('SELECT * FROM user_account WHERE user_id = $1', [id]);
        return rows[0];
    } finally {
        client.release();
    }
};

// CHATS

module.exports.getChatsForUser = async (userId) => {
    const client = await pool.connect();

    try {
        const { rows } = await client.query('SELECT * FROM chat_message WHERE sender_id = $1 OR receiver_id = $1', [userId]);
        return rows;
    } finally {
        client.release();
    }
};