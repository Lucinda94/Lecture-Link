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

/*

Use router.get while testing results but will need changing to router.post so we can get results via ajax

*/


/***
 * Account API
 */
// Used for own acount page
router.get('/get', checkAccess, async (req, res) => {
    const user_id = req.session.passport.user;
    try {
        const users = await db.getUser(user_id);
        res.status(200).send(users);
    } catch (err) {
        console.log(err);
        return error(res, 'Unable to get your information');
    }
});
// Returns another users public informaiton
router.get('/get/:id', checkAccess, async (req, res) => {
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

/****
 * User Relationships API
 */
router.get('/relationships/saved', checkAccess, async (req, res) => {
    const user_id = req.session.passport.user;
    const { rows } = await db.pool.query('SELECT user_account.user_id, user_account.user_first_name, user_account.user_last_name, user_account.user_email, user_account.user_role, user_relationship.type_of_relationship FROM user_relationship INNER JOIN user_account ON (user_relationship.ref_user_id = user_account.user_id) WHERE user_account.user_role = $1 AND user_relationship.type_of_relationship = $2 AND user_relationship.user_id = $3;', ["Student", "Saved", user_id]);
    res.status(200).json(rows);
});
router.get('/relationships/blocked', checkAccess, async (req, res) => {
    const user_id = req.session.passport.user;
    const { rows } = await db.pool.query('SELECT user_account.user_id, user_account.user_first_name, user_account.user_last_name, user_account.user_email, user_account.user_role, user_relationship.type_of_relationship FROM user_relationship INNER JOIN user_account ON (user_relationship.ref_user_id = user_account.user_id) WHERE user_relationship.type_of_relationship = $1 AND user_relationship.user_id = $2;', ["Blocked", user_id]);
    res.status(200).json(rows);
});
router.get('/relationships/lecturers', checkAccess, async (req, res) => {
    // TODO: There is a way to check if the user is a lecturer using SQL, will look up
    const user_id = req.session.passport.user;
    const { rows } = await db.pool.query('SELECT user_account.user_id, user_account.user_first_name, user_account.user_last_name, user_account.user_email, user_account.user_role, user_relationship.type_of_relationship FROM user_relationship INNER JOIN user_account ON (user_relationship.ref_user_id = user_account.user_id) WHERE user_account.user_role = $1 AND user_relationship.user_id = $2;', ["Lecturer", user_id]);
    res.status(200).json(rows);
});
router.get('/relationships/add', checkAccess, async (req, res) => {

});

/****
 * Search Users API
 */
// Used by the discover search column
router.post('/search', checkAccess, async (req, res) => {

    // TODO: sanitize these
    // get values, use empty string if one not supplied
    const fname = req.body.fname || "";
    const lname = req.body.lname || "";

    const { rows } = await db.pool.query('SELECT user_id, user_first_name, user_last_name, user_email, user_role FROM user_account WHERE user_first_name ~* $1 AND user_last_name ~* $2', [fname, lname]);
    
    res.status(200).json(rows);
    
});

/****
 * Error handling
 */
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
    return res.status(403).json({error: "access denied"}); // user not allowed, terminate request
  };

module.exports = router;