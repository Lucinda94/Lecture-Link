'use strict';

const { Pool, Client } = require('pg');
const config = require('./config');

// We want to be using connection pooling ideally
const pool = new Pool(config.pgsql);

pool.on('error', (err) => {
    console.error(err);
    process.exit(-1);
});
