const sql = require("./db.js");

// constructor
const Message = function (message) {
  this.name = message.name;
  this.email = message.email;
  this.msg = message.msg;
  this.reg_date = message.reg_date;
};

Message.create = (newMessage, result) => {
  sql.query("INSERT INTO messages SET ?", newMessage, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newMessage });
  });
};

Message.getAll = (result) => {
  let query =
    "select * from (select * from messages order by reg_date desc limit 0, 100) a order by a.reg_date";

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = Message;
