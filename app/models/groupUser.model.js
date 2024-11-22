const sql = require("./db.js");

const GroupUserModel = function (model) {
  this.user_id = model.user_id;
  this.group_id = model.group_id;
  this.is_valid = model.is_valid;
};

GroupUserModel.create = (model, result) => {
  sql.query("INSERT INTO group_users SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

GroupUserModel.findById = (id, result) => {
  sql.query(`SELECT * FROM group_users WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
    return;
  });
};

GroupUserModel.findByUserId = (id, result) => {
  sql.query(`SELECT * FROM group_users WHERE user_id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
    return;
  });
};

GroupUserModel.getAll = (keyword, flag, result) => {
  let query =
    "SELECT group_users.*, users.email, groups.name from group_users left join users on users.id = group_users.user_id left join groups on groups.id = group_users.group_id where 1=1 ";

  if (keyword) {
    query += ` and (users.email like '%${keyword}%' or groups.name like '%${keyword}%')`;
  }

  if (flag) {
    query += ` and group_users.is_valid = ${flag}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

GroupUserModel.batchUpdate = (id, models, result) => {
  sql.query("DELETE FROM group_users WHERE user_id = ?", [id], (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (models.length > 0) {
      const values = models.map((model) => [id, model.id, 1]);
      const query = `
      INSERT INTO group_users (user_id, group_id, is_valid)
      VALUES ?`;
      sql.query(query, [values], (err, res) => {
        if (err) {
          result(err, null);
          return;
        }

        result(null, { affectedRows: res.affectedRows });
      });
    } else {
      result(null, res);
    }
  });
};

GroupUserModel.update = (id, model, result) => {
  sql.query(
    "UPDATE group_users SET user_id = ?, group_id = ?, is_valid = ? WHERE id = ?",
    [model.user_id, model.group_id, model.is_valid, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      return result(null, res);
    }
  );
};

GroupUserModel.remove = (id, result) => {
  sql.query("DELETE FROM group_users WHERE id = ?", id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

GroupUserModel.removeAll = (result) => {
  sql.query("DELETE FROM group_users", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = GroupUserModel;
