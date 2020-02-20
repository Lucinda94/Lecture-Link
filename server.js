const express = require('express');
const app = express();

app.set('view engine', 'ejs');

// we use res.render to load up an ejs file
// res.render will look in the view file

// main application
app.get('/', function(req, res) {
    // if the user isn't logged in:
    // TODO: redirect to login page

    // if the user is logged in:
    res.render('pages/main-application');
});

// this will handle the /user/... api endpoints
const UserController = require('./user/UserController');
app.use('/api/user', UserController);

// static content
app.use('/', express.static('public'));

/*** 404 - Don't put any code past here ***/
app.get('*', function(req, res) {
    res.render('pages/404');
});

app.listen(8080, (err) => {
    if (err) console.log('Could not start server', err);
    console.log('Server listening on port 8080');
});