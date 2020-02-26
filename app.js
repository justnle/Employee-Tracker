'use strict';

const mysql = require('mysql');
const appFunctions = require('./lib/appFunctions');
const prompts = require('./lib/prompts');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'testing123',
  database: 'employees_db'
});

connection.connect(err => {
  if (err) throw err;
  prompts.initPrompts();
  appFunctions.init();
});

exports.connection = connection;
