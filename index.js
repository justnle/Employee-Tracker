'use strict';

const mysql = require('mysql');
const appFunctions = require('./lib/appFunctions');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'testing123',
  database: 'employees_db'
});

connection.connect(err => {
  if (err) throw err;
  appFunctions.prompt();
});

exports.connection = connection;