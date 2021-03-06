var db = require('../config/db');
var helpers = require('./helpers');

exports.insert = function(id_users, id_charities, amount, callback) {
  var today = new Date();
  var month = (today.getMonth() + 1) < 10 ? '' + 0 + (today.getMonth() + 1) : '' + (today.getMonth() + 1);
  var day = today.getDate() < 10 ? '' + 0 + today.getDate() : '' + today.getDate();
  var date = '' + today.getFullYear() + '-' + month + '-' + day;
  db.query({
    text: 'INSERT INTO transactions(id_users, id_charities, amount, date_time) \
      VALUES($1, $2, $3, $4)',
    values: [id_users, id_charities, amount, date]
  },
  function(err, result) {
    if (err) {
      callback(err);
    } else {
      callback('success');
    }
  });
};

exports.getTransactions = function(email, callback) {
  helpers.getUserID(email, function(id_users) {
    db.query({
      text: 'SELECT date_time, amount, name FROM transactions INNER JOIN charities \
      ON charities.id = transactions.id_charities \
      WHERE id_users= \'' + id_users + '\' ORDER BY date_time ASC;'
    },
    function(err, results) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results.rows);
      }
    });
  });
};

exports.getTransactionsForCharity = function(id_charities, callback) {
  db.query({
    text: 'SELECT date_time, amount, name, id_charities, id_users, id_owner, first_name, last_name, email FROM (SELECT date_time, amount, name, id_charities, id_users, id_owner FROM (SELECT * FROM transactions WHERE id_charities = \'' + id_charities + '\') AS t \
     INNER JOIN charities ON charities.id = t.id_charities) as c INNER JOIN users ON c.id_users = users.id;'
  },
  function(err, results) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results.rows);
    }
  });
};

//EXAMPLE USAGE
// exports.insert(79, 72, .87, function(response) {
//   console.log(response);
// });

// exports.insert(77, 72, .57, function(response) {
//   console.log(response);
// });

// exports.insert(77, 72, .34, function(response) {
//   console.log(response);
// });

// exports.insert(77, 72, .98, function(response) {
//   console.log(response);
// });

// exports.getTransactions('kk@gmail.com', function(err, result) {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log('transactions', result);
//   }
// });

// exports.getTransactionsForCharity(14, function(err, results) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(results);
//   }
// })



// CREATE TABLE transactions (
//   id BIGSERIAL   PRIMARY KEY,
//   amount REAL NULL DEFAULT NULL,
//   id_users BIGSERIAL     references users(id),
//   id_charities BIGSERIAL     references charities(id),
//   date_time date      NOT NULL
// );