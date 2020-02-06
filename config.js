'use strict';

const path = require('path');

module.exports.pages = path.join(__dirname, '/public/');
module.exports.port = 8080;

// I assume we will be running this on our virtual machines - if so keep the host as-is
module.exports.pgsql = {
    database: 'lecture_link',
    statement_timeout: 5000,
    host: '/var/run/postgresql'
}
