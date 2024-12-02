const sql = require("./db.js");

const PortModel = function (model) {
  this.title = model.title;
  this.is_https = model.is_https;
  this.target = model.target;
  this.target_port = model.target_port;
  this.listen_port = model.listen_port;
  this.is_active = model.is_active;
  this.visible = model.visible;
};

PortModel.create = (model, result) => {
  sql.query("INSERT INTO port_map SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

PortModel.findById = (id, result) => {
  sql.query(`SELECT * FROM port_map WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
    return;
  });
};

PortModel.getAll = (keyword, flag, result) => {
  let query = "SELECT * from port_map where 1=1 ";

  if (keyword) {
    query += ` and (title like '%${keyword}%' or target like '%${keyword}%' or listen_port like '%${keyword}%')`;
  }

  if (flag) {
    query += ` and port_map.is_active = ${flag}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

PortModel.update = (id, model, result) => {
  sql.query(
    "UPDATE port_map SET title = ?, listen_port = ?, is_https = ?, target_port = ?, target = ?, is_active = ?, visible = ? WHERE id = ?",
    [
      model.title,
      model.listen_port,
      model.is_https,
      model.target_port,
      model.target,
      model.is_active,
      model.visible,
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

      sql.query("SELECT * FROM port_map WHERE id = ?", [id], (err, userRes) => {
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

PortModel.remove = (id, result) => {
  sql.query("DELETE FROM port_map WHERE id = ?", id, (err, res) => {
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

PortModel.removeAll = (result) => {
  sql.query("DELETE FROM port_map", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = PortModel;
