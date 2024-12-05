const sql = require("./db.js");

const UserSessionModel = function (model) {
  this.user_id = model.user_id;
  this.machine_id = model.machine_id;
  this.created_at = model.created_at;
  this.updated_at = model.updated_at;
  this.session_id = model.session_id;
  this.ip = model.ip;
  this.session_token = model.session_token;
};

UserSessionModel.create = (model, result) => {
  sql.query("INSERT INTO user_sessions SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

UserSessionModel.findByUserId = (user_id, machine_id, result) => {
  sql.query(
    `SELECT * FROM user_sessions WHERE user_id = ? and machine_id = ?`,
    [user_id, machine_id],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      return result(null, res);
    }
  );
};

UserSessionModel.getAll = (keyword, flag, result) => {
  let query = `Select a.*, users.email from (SELECT *, CASE 
        WHEN updated_at >= NOW() - INTERVAL 30 SECOND THEN 1 
        ELSE 0 
    END AS status from user_sessions where 1=1) a left join users on users.id = a.user_id `;

  if (keyword) {
    // query += ` and (users.first_name LIKE '%${keyword}%' or users.last_name LIKE '%${keyword}%' or users.handle LIKE '%${keyword}%')`;
  }

  if (flag) {
    // query += ` and ports.is_active = ${flag}`;
  }

  query += " order by updated_at desc";

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

UserSessionModel.update = (user_id, machine_id, model, result) => {
  sql.query(
    "UPDATE user_sessions SET updated_at = ?, ip = ?, session_token = ? WHERE user_id = ? and machine_id = ?",
    [model.updated_at, model.ip, model.session_token, user_id, machine_id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      return result(null, res);
    }
  );
};

UserSessionModel.updateUserSessionInfo = (user_id, machine_id, model, result) => {
  sql.query(
    "UPDATE user_sessions SET created_at = ?, updated_at = ?, ip = ? WHERE user_id = ? and machine_id = ?",
    [model.created_at, model.updated_at, model.ip, user_id, machine_id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      return result(null, res);
    }
  );
};

UserSessionModel.remove = (id, result) => {
  sql.query("DELETE FROM user_sessions WHERE id = ?", id, (err, res) => {
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

UserSessionModel.removeAll = (result) => {
  sql.query("DELETE FROM user_sessions", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = UserSessionModel;
