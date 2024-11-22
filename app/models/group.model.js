const sql = require("./db.js");

const GroupModel = function (model) {
  this.name = model.name;
  this.created_at = model.created_at;
  this.updated_at = model.updated_at;
  this.is_valid = model.is_valid;
};

GroupModel.create = (model, result) => {
  sql.query("INSERT INTO groups_db SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

GroupModel.findById = (id, result) => {
  sql.query(`SELECT * FROM groups_db WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
    return;
  });
};

GroupModel.getAll = (keyword, flag, result) => {
  let query = "SELECT * from groups_db where 1=1 ";

  if (keyword) {
    query += ` and (name like '%${keyword}%')`;
  }

  if (flag) {
    query += ` and groups_db.is_valid = ${flag}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

GroupModel.update = (id, model, result) => {
  sql.query(
    "UPDATE groups_db SET name = ?, updated_at = ?, is_valid = ? WHERE id = ?",
    [model.name, model.updated_at, model.is_valid, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      return result(null, res);
    }
  );
};

GroupModel.remove = (id, result) => {
  sql.query("DELETE FROM groups_db WHERE id = ?", id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    return result(null, res);
  });
};

GroupModel.removeAll = (result) => {
  sql.query("DELETE FROM groups_db", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = GroupModel;
