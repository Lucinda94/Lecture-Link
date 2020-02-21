const express = require('express');
const router = express.Router();

const db = require('../postgres-db');

const _ = require('../util');

// TODO add user authentication

router.get('/', async (res, req) => {
    try {
        const users = await db.getAllUsers();
        res.status(200).send(users);
    } catch (err) {
        return _.error(res, 'Could not fetch all users');
    }
});

router.get('/:id', async (res, req) => {
    try {
        const user = await db.getUser(req.params.id);
        if (!user) {
            return _.error(res, 404, 'No user found');
        }

        res.status(200).send(user);
    } catch (err) {
        return _.error(res, 'Could not fetch user');
    }
});

module.exports = router;