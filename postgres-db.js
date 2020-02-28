const { Pool } = require('pg');

const pool = new Pool({
    database: 'lecturelink',
    statement_timeout: 5000,
    host: '/var/run/postgresql'  
});

// USERS

module.exports.getAllUsers = async () => {
    const { rows } = await pool.query('SELECT * FROM user_account');
    return rows;
};

module.exports.getUser = async (id) => {
    const { rows } = await pool.query('SELECT * FROM user_account WHERE user_id = $1', [id]);
    return rows[0];
};

// CHATS

module.exports.getChatsForUser = async (userId) => {
    const { rows } = await pool.query('SELECT * FROM chat_message WHERE sender_id = $1 OR receiver_id = $1', [userId]);
    return rows;
};

module.exports.sendMessage = async (senderId, receiverId, content) => {
    const { rows } = await pool.query(
        'INSERT INTO chat_message (sender_id, receiver_id, message_content) VALUES ($1, $2, $3)', 
        [senderId, receiverId, content]
    );

    return rows; // idk if it returns anything on an insert so this could be wrong
};