const express = require('express');
const router = express.Router();

const db = require('../../postgres-db');

/* 

How user authencation works.

1. checkAccess calls the function down below.
2. req.isAuthenticated() checks if the user is logged in
3. if so, next() proceeds with the request

TODO:

- Change checkAccess to checkAccess(role);
- This would then check database for the user role before giving access.

*/

// Returns the users own information
// Used for own acount page
router.get('/', checkAccess, async (req, res) => {
    const user_id = req.session.passport.user;
    try {
        const users = await db.getUser(user_id);
        res.status(200).send(users);
    } catch (err) {
        console.log(err);
        return error(res, 'Unable to get your information');
    }
});

// Returns a complete list of users
router.get('/all', checkAccess, async (req, res) => {
    try {
        const users = await db.getAllUsers();
        res.status(200).send(users);
    } catch (err) {
        console.log(err);
        return error(res, 'Could not fetch all users');
    }
});

// Returns a list of users public information based on name or email query
router.get('/search', checkAccess, async (req, res) => {

    const fnameQuery = req.query.fname;
    const lnameQuery = req.query.lname;
    
    const users = await db.searchUsers(fnameQuery, lnameQuery);
    console.log(users);
    res.status(200).send(users);

    
});

// Returns another users public informaiton
router.get('/:id', checkAccess, async (req, res) => {
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

/****
 * Check Access // Currently just checks if user is logged in but can be changed to check user_roll aswell.
 */
function checkAccess(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // user allowed, proceed with request
    }
    return res.status(403).send("Error 403 - Forbidden"); // user not allowed, terminate request
  };

module.exports = router;