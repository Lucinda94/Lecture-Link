const { Pool } = require('pg');

const pool = new Pool({
    database: 'lecturelink',
    statement_timeout: 5000,
    host: '/var/run/postgresql'
});
module.exports.pool = pool;

// USERS
//Not sure how to insert a query or even if we'll end up using this method of accessing the DB but these queries can be used no matter what we do
module.exports.addUser = async (user_fName, user_Lname, user_email, user_password, user_status) => {
  const {rows} = await pool.query('INSERT INTO user_account VALUES(DEFAULT,$1,$2,$3,$4,DEFAULT,$5)', [user_fName, user_Lname, user_email, user_password, user_status]);
  return rows;
};

module.exports.getAllUsers = async () => {
    const { rows } = await pool.query('SELECT * FROM user_account');
    return rows;
};

module.exports.getUser = async (id) => {
    const { rows } = await pool.query('SELECT * FROM user_account WHERE user_id = $1', [id]);
    return rows;
};

// used for logging in
module.exports.getUserByEmail = async (email) => {
    const { rows } = await pool.query('SELECT * FROM user_account WHERE user_email = $1', [email]);
    return rows;
};

module.exports.getUserRole = async (id) => {
    const { rows } = await pool.query('SELECT user_role FROM user_account WHERE user_id = $1', [id]);
    return rows;
};

// Not sure if type_of_relationship is declared properly here - works in VM
module.exports.getUsersLecturers = async (id) => {
    const { rows } = await pool.query('SELECT user_id2 FROM user_relationship WHERE user_id1 = $1 AND type_of_relationship = $2', [id, 'Lecturer']);
    return rows;
};

module.exports.getSavedUsers = async (id) => {
    const { rows } = await pool.query('SELECT user_id2 FROM user_relationship WHERE user_id1 = $1 AND type_of_relationship = $2', [id, 'Saved']);
    return rows;
};

// search user by First Name, Last Name, Email
module.exports.searchUsers = async (firstName, lastName) => {
    const { rows } = await pool.query('SELECT user_id FROM user_account WHERE user_first_name ILIKE $1 AND user_last_name ILIKE $2', [firstName, lastName]);
    return rows;
};

// CHATS

module.exports.getChatsForUser = async (userId) => {
    const { rows } = await pool.query('SELECT * FROM chat_message WHERE sender_id = $1 OR receiver_id = $1', [userId]);
    return rows;
};

module.exports.getUnreadChatsForUser = async (userId) => {
    const {rows} = await pool.query('SELECT * FROM chat_message WHERE sender_id = $1 OR receiver_id = $1 AND message_seen = False',[userId]);
    return rows;
};

module.exports.getArchivedMessageForUser = async (userId) => {
    const {rows} = await pool.query('SELECT * FROM chat_message WHERE sender_id = $1 OR receiver_id = $1 AND message_archive = True',[userId]);
    return rows;
};
// TESTED QUERIES UP TO HERE//
module.exports.sendMessage = async (senderId, receiverId, content) => {
    const { rows } = await pool.query(
        'INSERT INTO chat_message (sender_id, receiver_id, message_content) VALUES ($1, $2, $3)',
        [senderId, receiverId, content]
    );

    return rows; // idk if it returns anything on an insert so this could be wrong
};

// SESSIONS

module.exports.getLiveSession = async (live_session_id) => {
  const {rows} = await pool.query('SELECT * FROM live_session WHERE live_message_id = $1' [live_message_id]);
  return rows;
}

module.exports.getPastLiveSession = async (live_session_id) => {
  const {rows} = await pool.query('SELECT * FROM live_session WHERE live_message_id = $1 AND live_session_status = Closed' [live_message_id]);
  return rows;
}
