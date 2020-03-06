const express = require('express');
const router = express.Router();

const db = require('../../postgres-db');

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

// send a message to a user eg. POST /api/chats/RECEIVER_ID with the sender id and content in the request body
router.post('/:id', checkAccess, async (req, res) => {
    try {
        const msg = await db.sendMessage(req.params.id, req.body.receiver, req.body.content);
    } catch (err) {
        return res.status(500).send('Could not send chat message');
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