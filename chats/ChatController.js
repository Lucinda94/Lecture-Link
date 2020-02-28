const express = require('express');
const router = express.Router();

const db = require('../postgres-db');

// TODO authentication obvs
/*
Done, use:
app.get('/checkuser', (req, res) => {
  if (req.isAuthenticated()) {
    res.send("your user ID is " + req.user.id);
  } else {
    res.send("you are not logged in");
  }
})
where user.id is their primary key in the database
*/

router.get('/:id', async (req, res) => {
    try {
        const chats = await db.getChatsForUser(req.params.id);
        res.status(200).send(chats);
    } catch (err) {
        return res.status(500).send('Could not fetch chats');
    }
});

// send a message to a user eg. POST /api/chat/RECEIVER_ID with the sender id and content in the request body
router.post('/:id', async (req, res) => {
    try {
        const msg = await db.sendMessage(req.params.id, req.body.receiver, req.body.content);
    } catch (err) {
        return res.status(500).send('Could not send chat message');
    }
});

module.exports = router;