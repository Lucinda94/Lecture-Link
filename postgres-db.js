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


// Methods to create all of the tables for the data
const createUserAccountTable = () =>{
    const query =
        `CREATE TYPE status as enum('Online', 'Away', 'Busy');
        CREATE TABLE IF NOT EXISTS user_account(
            user_id int PRIMARY KEY,
            user_first_name varchar(35) NOT NULL,
            user_last_name varchar(35) NOT NULL,
            user_email varchar(255) NOT NULL,
            user_password varchar(50) NOT NULL,
            user_status status NOT NULL);`;
    
    pool.query(query)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        })
}

const createUserRelationshipTable = () => {
    const query =
        `CREATE TYPE relationship as enum('Saved', 'Blocked');
        CREATE TABLE IF NOT EXISTS user_relationship (
            user_id int PRIMARY KEY REFERENCES user_account(user_id),
            type_of_relationship relationship NOT NULL);`;
    
    pool.query(query)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        })
}

const createChatTable = () => {
    const query = 
        `CREATE TABLE IF NOT EXISTS chat (
            chat_id int PRIMARY KEY,
            user_id_1 int REFERENCES user_account(user_id) NOT NULL,
            user_id_2 int REFERENCES user_account(user_id) NOT NULL);`;

    pool.query(query)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        })
}

const createMessageTable = () => {
    const query = 
        `CREATE TABLE IF NOT EXISTS message (
            message_id int PRIMARY KEY,
            chat_id int REFERENCES chat(chat_id) NOT NULL,
            message_time timestamp NOT NULL,
            message_content varchar(255) NOT NULL,
            message_sender_id int REFERENCES chat(user_id_1) NOT NULL);`;

    pool.query(query)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        })
}

const createReportTable = () => {
    const query = 
    `CREATE TABLE IF NOT EXISTS report (
        report_id int PRIMARY KEY,
        report_status varchar(50),
        report_comments varchar(255),
        flagged_message_id int REFERENCES message(message_id));`;

    pool.query(query)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        })
}

const createLiveSessionTable = () => {
    const query = 
    `CREATE TABLE IF NOT EXISTS live_session (
        live_session_id int PRIMARY KEY,
        live_sesion_name varchar(50) NOT NULL,
        live_session_owner_id int REFERENCES user_account(user_id) NOT NULL,
        live_session_date timestamp NOT NULL);`;
    
    pool.query(query)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        }) 
}

const createLiveMessage = () => {
    const query =
    `CREATE TABLE IF NOT EXISTS live_message (
        live_message_id int PRIMARY KEY,
        live_session_id int REFERENCES live_session(live_session_id) NOT NULL,
        user_id int REFERENCES user_account(user_id) NOT NULL,
        live_message_time timestamp NOT NULL,
        live_message_content varchar(255) NOT NULL);`
    
    pool.query(query)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        })
}

//Create all tables
const createEveryTable = () => {
    createUserAccountTable()
    createUserRelationhsipTable()
    createChatTable()
    createMessageTable()
    createReportTable()
    createLiveSessionTable()
    createLiveMessageTable()
}