const express = require('express');
const router = express.Router();

const db = require('../postgres-db');

// TODO add user authentication

router.get('/', async (res, req) => {
    try {
        const users = await db.getAllUsers();
        res.status(200).send(users);
    } catch (err) {
        return error(res, 'Could not fetch all users');
    }
});

router.get('/:id', async (res, req) => {
    try {
        const user = await db.getUser(req.params.id);
        if (!user) {
            return res.status(404).send('No user found');
        }

        res.status(200).send(user);
    } catch (err) {
        return error(res, 'Could not fetch user');
    }
});

function error(res, msg) {
    res.status(500).send(msg);
}

module.exports = router;