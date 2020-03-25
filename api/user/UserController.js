/**
 * UserController Module
 * @module api/UserController
 */


 /**
 * express module
 * @const
 */
const express = require('express');


/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 */
const router = express.Router();

/**
 * database module
 * @const
 */
const db = require('../../postgres-db');

/**
 * API endpoint to get the logged in user.
 * @name api/user/get
 * @function
 * @param {string} path - Express path.
 * @param {function} checkAccess  - Checks if the user is logged in.
 * @param {callback} middleware - Express middleware.
 */
router.get('/get', checkAccess, async (req, res) => {
    // Get the current user from passport (middleware)
    const user_id = req.session.passport.user;
    try {
        const users = await db.getUser(user_id);
        res.status(200).send(users);
    } catch (err) {
        console.log(err);
        return error(res, 'Unable to get your information');
    }
});

/**
 * API endpoint to get a specific user.
 * @name api/user/get/:id
 * @function
 * @param {string} path - Express path.
 * @param {function} checkAccess  - Checks if the user is logged in.
 * @param {callback} middleware - Express middleware.
 */
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

/**
 * API endpoint add a relationship.
 * @name api/relationships/add/:id
 * @function
 */

 router.post('/relationships/add/:id', checkAccess, async (req, res) => {
    const user_id = req.session.passport.user;
    const second_user_id = req.params.id;
    try {
        const { rows } = await db.pool.query(`INSERT into user_relationship (user_id, ref_user_id, type_of_relationship) VALUES (${user_id}, ${second_user_id}, 'Saved')`);
        return res.status(200).json({success: true});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false});
    }
});

/**
 * API endpoint to get a users 'Saved Student' relationships
 * @name api/relationships/saved
 * @function
 * @param {string} path - Express path.
 * @param {function} checkAccess  - Checks if the user is logged in.
 * @param {callback} middleware - Express middleware.
 */
router.get('/relationships/saved', checkAccess, async (req, res) => {
    const user_id = req.session.passport.user;
    const { rows } = await db.pool.query('SELECT user_account.user_id, user_account.user_first_name, user_account.user_last_name, user_account.user_email, user_account.user_role, user_relationship.type_of_relationship FROM user_relationship INNER JOIN user_account ON (user_relationship.ref_user_id = user_account.user_id) WHERE user_account.user_role = $1 AND user_relationship.type_of_relationship = $2 AND user_relationship.user_id = $3;', ["Student", "Saved", user_id]);
    res.status(200).json(rows);
});

/**
 * API endpoint to get a users 'Blocked Users' relationships
 * @name api/relationships/blocked
 * @function
 * @param {string} path - Express path.
 * @param {function} checkAccess  - Checks if the user is logged in.
 * @param {callback} middleware - Express middleware.
 */
router.get('/relationships/blocked', checkAccess, async (req, res) => {
    // Get the current user from passport (middleware)
    const user_id = req.session.passport.user;
    const { rows } = await db.pool.query('SELECT user_account.user_id, user_account.user_first_name, user_account.user_last_name, user_account.user_email, user_account.user_role, user_relationship.type_of_relationship FROM user_relationship INNER JOIN user_account ON (user_relationship.ref_user_id = user_account.user_id) WHERE user_relationship.type_of_relationship = $1 AND user_relationship.user_id = $2;', ["Blocked", user_id]);
    res.status(200).json(rows);
});

/**
 * API endpoint to get a users 'Saved Lecturers' relationships
 * @name api/relationships/lecturers
 * @function
 * @param {string} path - Express path.
 * @param {function} checkAccess  - Checks if the user is logged in.
 * @param {callback} middleware - Express middleware.
 */
router.get('/relationships/lecturers', checkAccess, async (req, res) => {
    // Get the current user from passport (middleware)
    const user_id = req.session.passport.user;
    const { rows } = await db.pool.query('SELECT user_account.user_id, user_account.user_first_name, user_account.user_last_name, user_account.user_email, user_account.user_role, user_relationship.type_of_relationship FROM user_relationship INNER JOIN user_account ON (user_relationship.ref_user_id = user_account.user_id) WHERE user_account.user_role = $1 AND user_relationship.user_id = $2;', ["Lecturer", user_id]);
    res.status(200).json(rows);
});

/**
 * API endpoint to search users by first and last name.
 * @name api/users/search
 * @function
 * @param {string} path - Express path.
 * @param {function} checkAccess  - Checks if the user is logged in.
 * @param {callback} middleware - Express middleware.
 * @example 
 * POST -> /api/user/search?fname=j&lname=doe
 * RESULT -> [{user_id: 1, user_first_name: "John", user_last_name: "doe", user_email: "johndoe&#65312;example.com"}]
 */
router.post('/search', checkAccess, async (req, res) => {

    // TODO: sanitize these
    // get values, use empty string if one not supplied
    const fname = req.body.fname || "";
    const lname = req.body.lname || "";

    const { rows } = await db.pool.query('SELECT user_id, user_first_name, user_last_name, user_email, user_role FROM user_account WHERE user_first_name ~* $1 AND user_last_name ~* $2', [fname, lname]);
    
    res.status(200).json(rows);
    
});

/**
 * Sends an error responce to an express request object.
 * @param {object} res - Express responce object 
 * @param {string} msg - Error message
 */
function error(res, msg) {
    res.status(500).send(msg);
}
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