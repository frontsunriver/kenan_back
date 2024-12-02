const sql = require("./db.js");

const UserConnectionModel = function (model) {
  this.user_id = model.user_id;
  this.machine_id = model.machine_id;
  this.listen_port = model.listen_port;
  this.status = model.status;
  this.ip = model.ip;
  this.traffic_bytes = model.traffic_bytes; // status : 1 ; set 0 : add
  this.updated_at = model.updated_at; // status : 1, 0 ; set current time
  this.started_at = model.started_at; // status : 1 ; set current time
};

UserConnectionModel.create = (model, result) => {
  sql.query("INSERT INTO user_conns SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

UserConnectionModel.findByUserAndMachinePort = (model, result) => {
  sql.query(
    `SELECT * FROM user_conns WHERE user_id = ? and machine_id = ? and listen_port = ?`,
    [model.user_id, model.machine_id, model.listen_port],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      return result(null, res);
    }
  );
};

UserConnectionModel.getAll = (keyword, flag, result) => {
  let query = `Select a.*, users.email, port_map.title, port_map.target, port_map.target_port from (SELECT *, CASE 
        WHEN updated_at >= NOW() - INTERVAL 30 SECOND THEN 1 
        ELSE 0 
    END AS connection_status, TIMESTAMPDIFF(SECOND, started_at, updated_at) AS time_difference_seconds from user_conns where 1=1) a left join users on users.id = a.user_id left join port_map on a.listen_port = port_map.listen_port where 1=1 `;

  if (keyword) {
    query += ` and (users.email LIKE '%${keyword}%' or a.listen_port LIKE '%${keyword}%' or a.machine_id LIKE '%${keyword}%')`;
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

UserConnectionModel.update = (model, result) => {
  if (model.status == 1) {
    sql.query(
      "UPDATE user_conns SET updated_at = ?, started_at = ?, traffic_bytes = ?, ip = ?, status = ? WHERE user_id = ? and machine_id = ? and listen_port = ?",
      [
        model.updated_at,
        model.started_at,
        model.traffic_bytes,
        ip,
        model.status,
        model.user_id,
        model.machine_id,
        model.listen_port,
      ],
      (err, res) => {
        if (err) {
          result(null, err);
          return;
        }
        return result(null, res);
      }
    );
  } else {
    sql.query(
      "UPDATE user_conns SET updated_at = ?, traffic_bytes = ?, ip = ?, status = ? WHERE user_id = ? and machine_id = ? and listen_port = ?",
      [
        model.updated_at,
        model.traffic_bytes,
        ip,
        model.status,
        model.user_id,
        model.machine_id,
        model.listen_port,
      ],
      (err, res) => {
        if (err) {
          result(null, err);
          return;
        }
        return result(null, res);
      }
    );
  }
};

UserConnectionModel.remove = (id, result) => {
  sql.query("DELETE FROM user_conns WHERE id = ?", id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

UserConnectionModel.removeAll = (result) => {
  sql.query("DELETE FROM user_conns", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = UserConnectionModel;
