const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

// set up passport
const initPassport = require('./passport-config');
initPassport(
  passport, 
  email => { return users.find(user => user.email === email) },
  id => { return users.find(user => user.id === id) }
  );

// FOR TESTING
const users = [
  {
  id: '1582914548772',
  name: 'Austin Collins',
  email: 'austcollins@hotmail.com',
  password: '$2b$10$kX48Hm/UXT0CBDA7rdCzAeVbpAWH7hQzPxM.J1I/t1MhreF35j9KG' // password is 123
}
];

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
app.use(methodOverride('_method'));


// create the login get and post routes
app.get('/login', checkNotLoggedIn, (req, res) => {
res.render('pages/login');
})

app.post('/login', checkNotLoggedIn, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotLoggedIn, (req, res) => {
  res.render('pages/register');
  })
  
  app.post('/register', checkNotLoggedIn, async (req, res, next) => {
    try {
      // hash the password the user has sent. Use await as this is async
      const passHash = await bcrypt.hash(req.body.password, 10);
      // this would be put in database
      users.push({
        id: Date.now().toString(), // this will be made by database
        name: req.body.name,
        email: req.body.email,
        password: passHash
      });
      // TODO: send confirmation email

      // this will redirect to confirm email page.
      res.redirect('/login');
    } catch (err) {
      console.log(err);
      // something went wrong try again.
      res.redirect('/register');
    }
    console.log(users);
  })

  app.get('/logout', (req, res) => {
    req.logOut(); // tell passport to log the user out
    res.redirect('/login'); // redirect to the login page
  })



// we use res.render to load up an ejs file
// res.render will look in the view file

// main application
app.get('/', checkLoggedIn, function(req, res) {
    
  res.render('pages/main-application');
  //res.redirect('/login')

});

// this will handle the /user/... api endpoints
const UserController = require('./user/UserController');
app.use('/api/user', UserController);

const ChatController = require('./chats/ChatController');
app.use('/api/chats', ChatController);

// static content
app.use('/static', express.static('public'));

// 404 route
app.get('*', function(req, res) {
    res.render('pages/404');
});

// checks if a person is logged in
function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
function checkNotLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
};

app.listen(8080, (err) => {
    if (err) console.log('Could not start server', err);
    console.log('Server listening on port 8080');
});
