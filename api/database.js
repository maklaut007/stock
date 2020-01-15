    
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'maksym',
  password: 'qweasd',
  database: 'testbase'
})

db.connect(function (err) {
  if (err) {
    console.error(err);
    return;
  } 
});

module.exports = db;