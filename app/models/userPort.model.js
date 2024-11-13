const sql = require("./db.js");

const UserPortModel = function (model) {
  this.user_id = model.user_id;
  this.port_map_id = model.port_map_id;
  this.is_valid = model.is_valid;
};

UserPortModel.create = (model, result) => {
  sql.query("INSERT INTO user_ports SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

UserPortModel.findById = (id, result) => {
  sql.query(
    `SELECT user_ports.*, users.email, port_map.title, port_map.listen_port, port_map.target, port_map.is_https, port_map.target FROM user_ports left join users on users.id = user_ports.user_id left join port_map on port_map.id = user_ports.port_map_id WHERE user_ports.id = ${id}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, res);
      return;
    }
  );
};

UserPortModel.findByUserId = (id, result) => {
  sql.query(
    `SELECT user_ports.*, users.email, port_map.title, port_map.listen_port, port_map.target, port_map.is_https, port_map.target_port FROM user_ports left join users on users.id = user_ports.user_id left join port_map on port_map.id = user_ports.port_map_id WHERE user_ports.user_id = ${id}`,
    (err, res) => {
      if (err) {
        console.log(err);
        result(err, null);
        return;
      }

      result(null, res);
      return;
    }
  );
};

UserPortModel.getHttpsRules = (id, result) => {
  sql.query(
    `SELECT user_ports.*, users.email, port_map.title, port_map.listen_port, port_map.target, port_map.is_https, port_map.target_port FROM user_ports left join users on users.id = user_ports.user_id left join port_map on port_map.id = user_ports.port_map_id WHERE user_ports.user_id = ${id} and is_https = 1`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, res);
      return;
    }
  );
};

UserPortModel.getAll = (keyword, flag, result) => {
  let query =
    "SELECT user_ports.*, users.email, port_map.title, port_map.listen_port, port_map.target_port, port_map.is_https, port_map.target from user_ports left join users on user_ports.user_id = users.id left join port_map on port_map.id = user_ports.port_map_id where 1=1 ";

  if (keyword) {
    query += ` and (users.email LIKE '%${keyword}%' or port_map.title LIKE '%${keyword}%' or port_map.target_port LIKE '%${keyword}%' or port_map.target LIKE '%${keyword}%' or port_map.listen_port LIKE '%${keyword}%')`;
  }

  if (flag) {
    query += ` and user_ports.is_valid = ${flag}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

UserPortModel.update = (id, model, result) => {
  sql.query(
    "UPDATE user_ports SET user_id = ?, port_map_id = ?, is_valid = ? WHERE id = ?",
    [model.user_id, model.port_map_id, model.is_valid, id],
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
        "SELECT * FROM user_ports WHERE id = ?",
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

UserPortModel.batchUpdate = (id, models, result) => {
  sql.query("DELETE FROM user_ports WHERE user_id = ?", [id], (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    const values = models.map((model) => [id, model.id, 1]);
    const query = `
    INSERT INTO user_ports (user_id, port_map_id, is_valid)
    VALUES ?`;

    sql.query(query, [values], (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, { affectedRows: res.affectedRows });
    });
  });
};

UserPortModel.remove = (id, result) => {
  sql.query("DELETE FROM user_ports WHERE id = ?", id, (err, res) => {
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

UserPortModel.removeAll = (result) => {
  sql.query("DELETE FROM user_ports", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = UserPortModel;
