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


// just testing params (probably wont use this)
app.get('/user/:userId/', function (req, res) {
    const userID = req.params["userId"];
    res.render('pages/user', {
        userId:userID
    });
  })

// static content
app.use('/static', express.static('public'))

/*** 404 - Don't put any code past here ***/
app.get('*', function(req, res){
    res.render('pages/404');
  });

app.listen(8080);
console.log("Server listening on port 8080");