const sql = require("./db.js");

const LogsModel = function (model) {
  this.object_type = model.object_type;
  this.object_id = model.object_id;
  this.object_title = model.object_title;
  this.action = model.action;
  this.details = model.details;
  this.time = model.time;
};

LogsModel.create = (model, result) => {
  sql.query("INSERT INTO logs SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

LogsModel.findById = (id, result) => {
  sql.query(`SELECT * FROM logs WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

LogsModel.getAll = (keyword, flag, result) => {
  let query = "SELECT * from logs where 1=1 ";

  if (keyword) {
    // query += ` and (users.first_name LIKE '%${keyword}%' or users.last_name LIKE '%${keyword}%' or users.handle LIKE '%${keyword}%')`;
  }

  if (flag) {
    // query += ` and ports.is_active = ${flag}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

LogsModel.update = (id, model, result) => {
  sql.query(
    "UPDATE logs SET object_type = ?, object_id = ?, object_title = ?, action = ?, detail = ?, time = ? WHERE id = ?",
    [
      model.object_type,
      model.object_id,
      model.object_title,
      model.action,
      model.detail,
      model.time,
      id,
    ],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      sql.query("SELECT * FROM logs WHERE id = ?", [id], (err, userRes) => {
        if (err) {
          result(null, err);
          return;
        }

        if (userRes.length) {
          result(null, userRes[0]);
        } else {
          result({ kind: "not_found" }, null);
        }
      });
    }
  );
};

LogsModel.remove = (id, result) => {
  sql.query("DELETE FROM logs WHERE id = ?", id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

LogsModel.removeAll = (result) => {
  sql.query("DELETE FROM logs", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = LogsModel;
