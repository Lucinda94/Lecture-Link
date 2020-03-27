/**
 * ChatController Module
 * @module api/ChatController
 */


/**
 * Express modual
 * @const
 */
const express = require('express');
/**
 * Creating an express router to handle api requests
 * @const
 */
const router = express.Router();

/**
 * Import the database
 * @const
 */
const db = require('../../postgres-db');

/**
 * API Endpoint for getting messages with a specific user
 */
router.get('/get/:id', checkAccess, async (req, res) => {
    const user_id = req.session.passport.user;
    if (req.params.id == null || req.params.id == "undefined") {
        return res.status(422).json({error: "missing id value"});
    }
    const user_2_id = req.params.id;
    console.log(user_2_id);
    const { rows } = await db.pool.query("SELECT user_account.user_id, user_account.user_first_name, user_account.user_last_name, chat_message.* FROM chat_message INNER JOIN user_account ON (chat_message.sender_id = user_account.user_id) WHERE chat_message.sender_id = $2 AND chat_message.receiver_id = $1 OR chat_message.receiver_id = $2 AND chat_message.sender_id = $1", [user_id, user_2_id]);
    // tell the client which messages are outbound
    for (message in rows) {
        if (rows[message].sender_id === user_id) {
            rows[message].outbound = true;
        }
    }
    res.status(200).json(rows);
});

/**
 * API endpoint for sending a message to a specific user
 */
router.post('/send/:id', checkAccess, async (req, res) => {
    const user_id = req.session.passport.user.toString();
    console.log(user_id);
    const user_2_id = req.params.id;
    const message = req.body.message;
    var message_id;

    // send the message
    try {
        const { rows } = await db.pool.query('INSERT INTO chat_message (sender_id, receiver_id, message_content, message_seen) VALUES ($1, $2, $3, $4) RETURNING message_id',[user_id, user_2_id, message, false]);
        console.log(rows);
        message_id = rows[0].message_id;
    } catch (err) {
        console.log(err);
        return res.status(500).send('Could not send chat message');
    }

    // get the message
    try {
        const { rows } = await db.pool.query("SELECT user_account.user_id, user_account.user_first_name, user_account.user_last_name, chat_message.* FROM chat_message INNER JOIN user_account ON (chat_message.sender_id = user_account.user_id) WHERE chat_message.message_id = $1", [message_id]);
        if (rows.length === 1){
            rows[0].outbound = true;
            res.status(200).json(rows[0]);
        } else {
            return res.status(500).send('Error getting message from database.');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Error getting message from database.');
    }
});

/**
 * Used in an express route to check if a user is logged in.
 * @param {object} req - Express request object.
 * @param {object} res - Express responce object.
 * @param {callback} next - Express callback.
 */
function checkAccess(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // user allowed, proceed with request
    }
    return res.status(403).json({error: "access denied"}); // user not allowed, terminate request
  };

module.exports = router;