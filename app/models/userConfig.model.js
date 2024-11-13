const sql = require("./db.js");

const UserConfig = function (model) {
  this.user_id = model.user_id;
  this.copy_to_vm = model.copy_to_vm;
  this.enable_outbound = model.enable_outbound;
  this.is_valid = model.is_valid;
};

UserConfig.create = (model, result) => {
  sql.query("INSERT INTO user_configs SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

UserConfig.findById = (id, result) => {
  sql.query(`SELECT * FROM user_configs WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    return result(null, res);
  });
};

UserConfig.findByUserId = (id, result) => {
  sql.query(`SELECT * FROM user_configs WHERE user_id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    return result(null, res);
  });
};

UserConfig.getAll = (keyword, flag, result) => {
  let query = "SELECT * from user_configs where 1=1 ";

  if (keyword) {
    // query += ` and (users.first_name LIKE '%${keyword}%' or users.last_name LIKE '%${keyword}%' or users.handle LIKE '%${keyword}%')`;
  }

  if (flag) {
    query += ` and user_configs.is_valid = ${flag}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

UserConfig.update = (id, model, result) => {
  sql.query(
    "UPDATE user_configs SET user_id = ?, copy_to_vm = ?, enable_outbound = ? WHERE id = ?",
    [model.user_id, model.copy_to_vm, model.enable_outbound, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      sql.query(
        "SELECT * FROM user_configs WHERE id = ?",
        [id],
        (err, userRes) => {
          if (err) {
            result(null, err);
            return;
          }

          if (userRes.length) {
            result(null, userRes[0]);
          } else {
            result({ kind: "not_found" }, null);
          }
        }
      );
    }
  );
};

UserConfig.updateByUserId = (id, model, result) => {
  sql.query(
    "UPDATE user_configs SET user_id = ?, copy_to_vm = ?, enable_outbound = ? WHERE user_id = ?",
    [model.user_id, model.copy_to_vm, model.enable_outbound, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      result(null, res);
      return;
    }
  );
};

UserConfig.remove = (id, result) => {
  sql.query("DELETE FROM user_configs WHERE id = ?", id, (err, res) => {
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

UserConfig.removeAll = (result) => {
  sql.query("DELETE FROM user_configs", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = UserConfig;
