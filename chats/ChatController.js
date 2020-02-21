const express = require('express');
const router = express.Router();

const db = require('../postgres-db');

const _ = require('../util');

// TODO authentication obvs

router.get('/:id', async (req, res) => {
    try {
        const chats = await db.getChatsForUser(req.params.id);
        res.status(200).send(chats);
    } catch (err) {
        return _.error(res, 'Could not fetch chats');
    }
});

// send a message to a user eg. POST /api/chat/RECEIVER_ID with the sender id and content in the request body
router.post('/:id', async (req, res) => {
    try {
        const msg = await db.sendMessage(req.params.id, req.body.receiver, req.body.content);
    } catch (err) {
        return _.error(res, 'Could not send chat message');
    }
});

module.exports = router;