const sql = require("./db.js");

// constructor
const AutoComplete = function (model) {
  this.name = model.name;
};

AutoComplete.getList = (keyword, result) => {
  let query = `select * from view_auto_complete where name like '%${keyword}%'`;

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = AutoComplete;
