const { Pool } = require('pg');

const pool = new Pool({
    database: 'lecturelink',
    statement_timeout: 5000,
    host: '/var/run/postgresql'  
});

module.exports.getMessagesBetweenUsers = (user1, user2) => {
    return pool.connect()
        .then(client => {
            return client
                // TODO actually make the query work
                .query('SELECT * FROM message JOIN chat ON message.chat_id=chat.chat_id WHERE (chat.user_id_1 = $1 OR chat.user_id_2 = $2) AND (chat.user_id_1 = $2 OR chat.user_id_2 = $1)')
                .then(res => {
                    return res.rows[0];
                })
                .finally(client => client.release());
    });
};
