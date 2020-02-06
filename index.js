'use strict';

const express = require('express');
const app = express();

const config = require('./config');

// just a simple request logger - 
app.use('/', (req, res, next) => {
    console.log(new Date(), req.method, req.url);
    next();
});

app.use('/', express.static(config.pages, { extensions: ['htm', 'html'] }));

app.listen(config.port, (err) => {
    if (err) console.log('Error starting server', err);
    else console.log('Started server');
});