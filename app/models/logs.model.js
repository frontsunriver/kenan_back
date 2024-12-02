const sql = require("./db.js");

const LogsModel = function (model) {
  this.user_type = model.user_type;
  this.user_email = model.user_email;
  this.user_id = model.user_id;
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

LogsModel.getLoginCount = (result) => {
  sql.query(
    `SELECT *
      FROM logs
      WHERE DATE(time) = CURDATE() AND user_type = 0 AND action = 'login'`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      return result(null, res);
    }
  );
};

LogsModel.findByUserId = (id, user_type, result) => {
  sql.query(
    `SELECT * FROM logs WHERE user_id = ${id} and user_type = ${user_type}`,
    (err, res) => {
      console.log(err);
      if (err) {
        result(err, null);
        return;
      }

      return result(null, res);
    }
  );
};

LogsModel.getAll = (keyword, flag, result) => {
  let query = `SELECT 
              l.*, 
              CASE 
                  WHEN l.user_type = 1 THEN a.email 
                  WHEN l.user_type = 0 THEN u.email
              END AS email
          FROM 
              logs l
          LEFT JOIN 
              admins a ON l.user_id = a.id AND l.user_type = 1
          LEFT JOIN 
              users u ON l.user_id = u.id AND l.user_type = 0`;

  if (keyword) {
    // query += ` and (users.first_name LIKE '%${keyword}%' or users.last_name LIKE '%${keyword}%' or users.handle LIKE '%${keyword}%')`;
  }

  if (flag) {
    // query += ` and ports.is_active = ${flag}`;
  }

  query += " order by l.time desc";

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
    "UPDATE logs SET user_type = ?, user_id = ?, user_email = ?, object_title = ?, action = ?, detail = ?, time = ? WHERE id = ?",
    [
      model.user_type,
      model.user_id,
      model.user_email,
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
