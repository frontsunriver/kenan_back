const sql = require("./db.js");

const GroupPortModel = function (model) {
  this.group_id = model.group_id;
  this.port_map_id = model.port_map_id;
  this.is_valid = model.is_valid;
};

GroupPortModel.create = (model, result) => {
  sql.query("INSERT INTO group_ports SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

GroupPortModel.findById = (id, result) => {
  sql.query(
    `SELECT group_ports.*, groups.name, port_map.title, port_map.listen_port, port_map.target, port_map.is_https, port_map.target FROM group_ports left join groups on groups.id = group_ports.group_id left join port_map on port_map.id = group_ports.port_map_id WHERE group_ports.id = ${id}`,
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

GroupPortModel.findByGroupId = (id, result) => {
  sql.query(
    `SELECT group_ports.*, groups.name, port_map.title, port_map.listen_port, port_map.target, port_map.is_https, port_map.target_port FROM group_ports left join groups on groups.id = group_ports.group_id left join port_map on port_map.id = group_ports.port_map_id WHERE group_ports.group_id = ${id}`,
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

GroupPortModel.getHttpsRules = (id, result) => {
  sql.query(
    `SELECT group_ports.*, groups.name, port_map.title, port_map.listen_port, port_map.target, port_map.is_https, port_map.target_port FROM group_ports left join groups on groups.id = group_ports.group_id left join port_map on port_map.id = group_ports.port_map_id WHERE group_ports.group_id = ${id} and group_ports.is_https = 1`,
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

GroupPortModel.getAll = (keyword, flag, result) => {
  let query =
    "SELECT group_ports.*, groups.name, port_map.title, port_map.listen_port, port_map.target_port, port_map.is_https, port_map.target from group_ports left join groups on group_ports.user_id = groups.id left join port_map on port_map.id = group_ports.port_map_id where 1=1 ";

  if (keyword) {
    query += ` and (groups.name LIKE '%${keyword}%' or port_map.title LIKE '%${keyword}%' or port_map.target_port LIKE '%${keyword}%' or port_map.target LIKE '%${keyword}%' or port_map.listen_port LIKE '%${keyword}%')`;
  }

  if (flag) {
    query += ` and group_ports.is_valid = ${flag}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

GroupPortModel.update = (id, model, result) => {
  sql.query(
    "UPDATE group_ports SET group_id = ?, port_map_id = ?, is_valid = ? WHERE id = ?",
    [model.group_id, model.port_map_id, model.is_valid, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      return result(null, res);
    }
  );
};

GroupPortModel.batchUpdate = (id, models, result) => {
  sql.query("DELETE FROM group_ports WHERE group_id = ?", [id], (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (models.length > 0) {
      const values = models.map((model) => [id, model.id, 1]);
      const query = `
      INSERT INTO group_ports (group_id, port_map_id, is_valid)
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
      return;
    }
  });
};

GroupPortModel.remove = (id, result) => {
  sql.query("DELETE FROM group_ports WHERE id = ?", id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    return result(null, res);
  });
};

GroupPortModel.removeAll = (result) => {
  sql.query("DELETE FROM group_ports", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = GroupPortModel;
