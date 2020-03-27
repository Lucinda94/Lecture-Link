/**
 * @module Server
 */

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

/**
 * Import the database
 */
const db = require('./postgres-db.js');

/****
 * Set up passport (handles logging in and client sessions)
 */
const initPassport = require('./passport-config');
/**
 * Connect passport to the database
 */
initPassport(
  passport,
  async email => {
    // where given 'email' get 'id' and 'password' from the database.
    const { rows } = await db.pool.query('SELECT user_id, user_password FROM user_account WHERE user_email = $1', [email]);
    var userData = null;
    if (rows.length === 1) { // check one user returned
      user = rows[0];
      userData = {
        id: user.user_id,
        password: user.user_password
      };
    }
    return userData;
  },
  async id => {
    // where given 'id' get 'password' from the database.
    const { rows } = await db.pool.query('SELECT user_id, user_password FROM user_account WHERE user_id = $1', [id]);
    var userData = null;
    if (rows.length === 1) { // check one user returned
      user = rows[0];
      userData = {
        id: user.user_id,
        password: user.user_password
      };
    }
    return userData;
  }
  );

/****
 * Set up application
 */
// set ejs as our view engine
app.set('view engine', 'ejs');
// tell the app that we are receiving informaiton from forms
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(session({
  secret: "92yr82gfjkbeKLJFB9PGHR3UG283y49823yruhRJKfeHERJKfweHfef3IR23HRUAKefefHfwJR38YR923fw8EFEWFHRJwfKAMXFNfwefBXFZMy4328", // keyboard cat
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
// sorts out post query parameters
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/****
 *
 * Login/Register/Logout Routes
 *
 */
// Returns login page, only if they are not logged in
app.get('/login', checkNotLoggedIn, (req, res) => {
  renderEJSPage(req, res, 'pages/login');
})
// when the login form is submitted, passport handles the login
app.post('/login', checkNotLoggedIn, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))
// return the registration page
app.get('/register', checkNotLoggedIn, (req, res) => {
  res.redirect('/login');
 })
 // return the registration page
app.get('/register/confirm-email', checkNotLoggedIn, (req, res) => {
  renderEJSPage(req, res, 'pages/confirm-email');
 })
// when the registration form is submitted
app.post('/register', checkNotLoggedIn, async (req, res, next) => {
  try {    
    // hash the password the user has sent. Use await as this is async
    const passHash = await bcrypt.hash(req.body.password, 10);
    const { rows } = await db.pool.query('INSERT INTO user_account VALUES(DEFAULT,$1,$2,$3,$4,DEFAULT,$5)', [req.body.fname, req.body.lname, req.body.email, passHash, "Busy"]);
    // TODO: send confirmation email

    // registration worked so send to login page
    res.redirect('/register/confirm-email');

    res.json({success: True, reason: "Account was created"})

  } catch (err) {
    console.log(err);
    // something went wrong, try again.
    res.redirect('/login?registration_failed=true');
  }
})
// handles logging out
app.get('/logout', (req, res) => {
  req.logOut(); // tell passport to log the user out
  res.redirect('/login'); // redirect to the login page
})
app.get('/forgot', (req, res) => {
  renderEJSPage(req, res, 'pages/forgot-password');
})

/**
 * Returns the main application page
 */
app.get('/', checkLoggedIn, function(req, res) {
  renderEJSPage(req, res, 'pages/main-application');
});

/**
  * Returns the account page
  */
app.get('/account', checkLoggedIn, async (req, res) => {
  const user_id = req.session.passport.user;
  let accountDetails = await getUserDetails(user_id);
  console.log(user_id, accountDetails)
  renderEJSPage(req, res, 'pages/account', {
    email: accountDetails.email,
    firstName: accountDetails.firstName,
    lastName: accountDetails.lastName
  })
});

/**
  * Updates the account information
  */
 app.post('/account', checkLoggedIn, async (req, res) => {
  const user_id = req.session.passport.user;
  var fName = req.body.fName;
  var lName = req.body.lName;
  var pass = req.body.password;
  var success = true;
  if (fName){
    try{
          db.pool.query("UPDATE user_account SET user_fName = $1 WHERE user_id = $2"[fName, user_id]);
    }catch{
      success = false;



    }
  }

  if (lName){
    try{
          db.pool.query("UPDATE user_account SET user_lName = $1 WHERE user_id = $2"[lName, user_id]);
    }catch{
      success = false;
    }
  }


  if (pass){
    try{
          db.pool.query("UPDATE user_account SET user_password = $1 WHERE user_id = $2"[pass, user_id]);
    }catch{
      success = false;
    }

  }

  res.redirect('/account?success='+success);
});

/**
 * Gets the account details from the database
 * @param {*} id
 * @returns {object} - Account details in an object, or returns error.
 */
async function getUserDetails(id) {
  const { rows } = await db.pool.query('SELECT user_email, user_first_name, user_last_name FROM user_account WHERE user_id = $1', [id]);
  var accountDetails = null;
  if (rows.length === 1) { // check one user returned
    user = rows[0];
    accountDetails = {
      email: user.user_email,
      firstName: user.user_first_name,
      lastName: user.user_last_name,
    };
    return accountDetails;
  } else {
    return {error: "Could not load account details"};
  }
}
exports.getUserDetails = getUserDetails


/****
 * API
 */
// this will handle the /user/... api endpoints
const UserController = require('./api/user/UserController');
app.use('/api/user', UserController);

const ChatController = require('./api/chats/ChatController');
app.use('/api/chats', ChatController);

/**
 * Serve static content
 */
app.use('/static', express.static('public'));

/**
 * Serve the documentation. (remove in final release)
 */
app.use('/docs', express.static('docs'));

/****
 * Anything that isn't routed, show 404 page.
 */
app.get('*', function(req, res) {
    renderEJSPage(req, res, 'pages/404');
});

/**
 * Takes an express route request, checks if the user is logged in.
 * If user is logged in, proceed with the request.
 * If not, terminate the request the redirect to the login page.
 * @param {callback} req - Express Middleware
 * @param {callback} res - Express Middleware
 * @param {callback} next - Express middleware
 * @returns {callback} - Express callback function
 */
// checks if user is logged in, if not redirects to login page
function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
// checks if the user is logged in, if so redirects to main applicaiton
function checkNotLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
};

/**
 * Start the server
 * @function
 * @module express
 */
app.listen(8080, (err) => {
    if (err) console.log('Could not start server', err);
    console.log('Server listening on port 8080');
});

/**
 * Wraps the EJS render function but adds the isLoggedIn param as needed by the header.
 * @param {callback} res - Express middleware
 * @param {string} location - The EJS page to load
 * @param {object} data - Optional data to pass to EJS middleware
 */
function renderEJSPage(req, res, location, data) {
  const isLoggedIn = req.isAuthenticated();
  if (data) {
    data.isLoggedIn = isLoggedIn;
  } else {
    data = {isLoggedIn: isLoggedIn}
  }
  console.log(data);
  res.render(location, data);
}

/**
 * Emails a verificaiton code to user_email. Pushes the code to the database so it can be compared to later.
 * @param {string} user_email - The email to send the verification email to.
 */
/* WIP
function sendVerificationEmail (user_email){

    // TODO: send email without auth (just tell them to check spam!)
    const transporter = nodemailer.createTransport({
    	service: 'gmail',
    	auth: {
        userEmail: 'ouremail@gmail.com',
        password: 'ourpassword'
      }
    });


    var code = Math.floor(1000+Math.random()*9000);

    const options = {
    	sender: 'ouremail@gmail.com',
      receiver: user_email,
      subject: 'Verification Email for Lecture Link',
      content: 'Here is your verification code: ' + code
    };

    transporter.sendMail(options, function(error, info){
    	if (error) {
    	   console.log(error)
    	}
    	else {
        console.log('Email sent' + info);


        db.pool.query("INSERT INTO ver_code VALUES($1, $2)"[user_email, code]);

    		}

    });
  }
*/

// Testing travis