const sql = require("./db.js");

const SessionModel = function (model) {
  this.session_expircy_time = model.session_expircy_time;
};

SessionModel.create = (model, result) => {
  sql.query("INSERT INTO global_configs SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

SessionModel.findById = (id, result) => {
  sql.query(`SELECT * FROM global_configs WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
    return;
  });
};

SessionModel.getAll = (keyword, flag, result) => {
  let query = "SELECT * FROM global_configs where 1=1 ";

  if (keyword) {
    // query += ` and (users.email LIKE '%${keyword}%' or user_machines.machine_id LIKE '%${keyword}%')`;
  }

  if (flag) {
    // query += ` and user_machines.is_valid = ${flag}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

SessionModel.update = (model, result) => {
  sql.query(
    "UPDATE global_configs SET session_expircy_time = ?",
    [model.session_expircy_time],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      result(null, res);
    }
  );
};

module.exports = SessionModel;
