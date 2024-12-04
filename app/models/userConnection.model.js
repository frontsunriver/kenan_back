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

UserConnectionModel.getAll = (
  keyword,
  portName,
  listenPort,
  target,
  targetPort,
  flag,
  result
) => {
  let query = ` SELECT * 
        FROM (
            SELECT
                a.*,
                users.email,
                port_map.title,
                port_map.target,
                port_map.target_port,
                CASE
                    WHEN connection_status = 1 THEN
                        CASE
                            WHEN time_difference_seconds > 0 AND traffic_bytes / time_difference_seconds > 100 THEN 1
                            ELSE 2
                        END
                    WHEN connection_status = 0 THEN 0
                END AS status_value,
                CASE
                    WHEN connection_status = 1 THEN 
                        CASE 
                            WHEN time_difference_seconds > 0 THEN traffic_bytes / time_difference_seconds
                            ELSE 0
                        END
                    WHEN connection_status = 0 THEN 0
                END AS speed
            FROM (
                SELECT
                    *,
                    CASE
                        WHEN updated_at >= NOW() - INTERVAL 60 SECOND THEN 1
                        ELSE 0
                    END AS connection_status,
                    TIMESTAMPDIFF(SECOND, started_at, updated_at) AS time_difference_seconds
                FROM
                    user_conns
                WHERE
                    1 = 1
            ) a
            LEFT JOIN users ON users.id = a.user_id
            LEFT JOIN port_map ON a.listen_port = port_map.listen_port
            WHERE
                1 = 1
        ) AS user_table 
        WHERE 1 = 1 `;

  if (keyword) {
    query += ` and (user_table.email LIKE '%${keyword}%' or user_table.machine_id LIKE '%${keyword}%')`;
  }

  if (portName) {
    query += ` and user_table.title LIKE '%${portName}%' `;
  }

  if (listenPort) {
    query += ` and user_table.listen_port LIKE '%${portName}%' `;
  }

  if (target) {
    query += ` and user_table.target LIKE '%${target}%' `;
  }

  if (targetPort) {
    query += ` and user_table.target_port LIKE '%${targetPort}%' `;
  }

  if (flag) {
    query += ` and user_table.status_value = ${flag}`;
  }

  query += " order by user_table.updated_at desc";

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
        model.ip,
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
        model.ip,
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
