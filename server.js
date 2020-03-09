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
  secret: "92yr82gfjkbeKLJFB9PGHR3UG283y49823yruhRJKfeHERJKfweHfef3IR23HRUAKefefHfwJR38YR923fw8EFEWFHRJwfKAMXFNfwefBXFZMy4328", // keyboard cat -
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
res.render('pages/login');
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
  res.render('pages/confirm-email');
 })
// when the registration form is submitted
app.post('/register', checkNotLoggedIn, async (req, res, next) => {
  try {
    // hash the password the user has sent. Use await as this is async
    const passHash = await bcrypt.hash(req.body.password, 10);
    const user = await db.addUser(req.body.fname, req.body.lname, req.body.email, passHash, "Busy");
    // TODO: send confirmation email

    // registration worked so send to login page
    res.redirect('/register/confirm-email');

  } catch (err) {
    console.log(err);
    // something went wrong, try again.
    res.redirect('/register');
  }
})
// handles logging out
app.get('/logout', (req, res) => {
  req.logOut(); // tell passport to log the user out
  res.redirect('/login'); // redirect to the login page
})
app.get('/forgot', (req, res) => {
  res.render('pages/forgot-password');
})

/**
 * Returns the main application page
 */
app.get('/', checkLoggedIn, function(req, res) {
  const isloggedIn = req.isAuthenticated();
  console.log(isloggedIn);
  res.render('pages/main-application', {
    isloggedIn: isloggedIn
  });
});

/**
  * Returns the account page
  */
app.get('/account', checkLoggedIn, (req, res) => {
res.render('pages/account');



/****
 * API
 */
// this will handle the /user/... api endpoints
const UserController = require('./api/user/UserController');
app.use('/api/user', UserController);

const ChatController = require('./api/chats/ChatController');
app.use('/api/chats', ChatController);

/****
 * Serve static content
 */
app.use('/static', express.static('public'));

/****
 * Anything that isn't routed, show 404 page.
 */
app.get('*', function(req, res) {
    res.render('pages/404');
});

/****
 * Login checks (for use when limiting routes)
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

/****
 * Start the server
 */
app.listen(8080, (err) => {
    if (err) console.log('Could not start server', err);
    console.log('Server listening on port 8080');
});

/****
  * Get user data to popuate table
  */
function getUserDetails(id){
  app.get('/accountInfo', function(req,res){
    const { rows } = await db.pool.query('SELECT user_email, user_fName, user_Lname, user_password FROM user_account WHERE user_id = $1', [id]);
    var accountDetails = null;
    if (rows.length === 1) { // check one user returned
      user = rows[0];
      accountDetails = {
        email: user.user_email,
        firstName: user.user_fName,
        lastName: user.user_Lname,
        password: user.user_password
      };
    }
    return accountDetails;
  })
}

/****
  * Sending verification emails
  */

function sendVerificationEmail (user_email){
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
    	service: 'gmail',
    	auth: {
        userEmail: 'ouremail@gmail.com',
        password: 'ourpassword'
      }
    });

    var options = {
    	sender: 'ouremail@gmail.com',
      receiver: user_email,
      subject: 'Verification Email for Lecture Link',
      content: '4 digit code here'
    };

    transporter.sendMail(options, function(error, info){
    	if (error) {
    	   console.log(error)
    	}
    	else {
    		console.log('Email sent' + info);
    		}
    });
  }
