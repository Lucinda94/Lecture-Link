const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

/****
 * Database
 */
const db = require('./postgres-db.js');

/****
 * Set up passport (handles logging in and client sessions)
 */
const initPassport = require('./passport-config');
// TODO: connect passport to the database
initPassport(
  passport, 
  async email => {
    // where given 'email' get 'id' and 'password' from the database.
    const user = await db.getUserByEmail(email);
    var userData = null;
    if (user.length === 1) { // check one user returned
      userData = {
        id: user[0].user_id,
        password: user[0].user_password
      };
    }
    return userData;
  },
  async id => {
    // where given 'id' get 'password' from the database.
    const user = await db.getUser(id);
    var userData = null;
    if (user.length === 1) { // check one user returned
      userData = {
        id: id,
        password: user[0].user_password
      };
    }
    return userData;
  }
  );

// FOR TESTING
const users = [
  {
  id: '0',
  name: 'Austin Collins',
  email: 'austcollins@hotmail.com',
  password: '$2b$10$kX48Hm/UXT0CBDA7rdCzAeVbpAWH7hQzPxM.J1I/t1MhreF35j9KG' // password is 123
}
];

/****
 * Set up application
 */
// set ejs as our view engine
app.set('view engine', 'ejs');
// tell the app that we are receiving informaiton from forms
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(session({
  secret: "92yr82gfjkbeKLJFB9PGHR3UG", // keyboard cat -
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());


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

/*****
 * Main application page
 */
// main application
app.get('/', checkLoggedIn, function(req, res) {
  res.render('pages/main-application');
});

/****
 * API
 */
// this will handle the /user/... api endpoints
const UserController = require('./user/UserController');
app.use('/api/user', UserController);

const ChatController = require('./chats/ChatController');
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
