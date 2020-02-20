const express = require('express');
const router = express.Router();

const db = require('../postgres-db');

router.get('/:id', async (req, res) => {
    try {
        const chats = await db.getChatsForUser(req.params.id);
        res.status(200).send(chats);
    } catch (err) {
        res.status(500).send('Could not fetch chats');
    }
});

module.exports = router;