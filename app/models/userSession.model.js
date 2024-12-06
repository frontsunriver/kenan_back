const sql = require("./db.js");

const UserSessionModel = function (model) {
  this.user_id = model.user_id;
  this.machine_id = model.machine_id;
  this.created_at = model.created_at;
  this.updated_at = model.updated_at;
  this.session_id = model.session_id;
  this.ip = model.ip;
  this.session_token = model.session_token;
  this.traffic_bytes = model.traffic_bytes;
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
  let query = `SELECT 
        a.*, 
        users.email,
        CASE 
            WHEN a.status = 0 THEN 0 
            ELSE (NULLIF(a.traffic_bytes, 0) / TIMESTAMPDIFF(SECOND, a.created_at, a.updated_at)) 
        END AS speed
    FROM (
        SELECT 
            us.id,  
            us.user_id,
            us.machine_id,
            us.session_id,
            us.created_at,
            us.updated_at,
            us.ip,
            gc.session_expircy_time,
            TIMESTAMPDIFF(SECOND, us.updated_at, NOW()) AS timeDiffVal,
            CASE 
                WHEN TIMESTAMPDIFF(SECOND, us.updated_at, NOW()) < gc.session_expircy_time THEN 1 
                ELSE 0 
            END AS status,
            -- Assuming traffic_bytes is a column in user_sessions or needs to be calculated
            us.traffic_bytes  -- Adjust this if traffic_bytes comes from another source
        FROM 
            user_sessions us
        JOIN 
            global_configs gc ON 1=1
    ) a 
    LEFT JOIN users ON users.id = a.user_id `;

  if (keyword) {
    // query += ` and (users.first_name LIKE '%${keyword}%' or users.last_name LIKE '%${keyword}%' or users.handle LIKE '%${keyword}%')`;
  }

  if (flag) {
    // query += ` and ports.is_active = ${flag}`;
  }

  query += " order by a.updated_at desc";

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

UserSessionModel.findBySessionId = (session_id, result) => {
  sql.query(
    `SELECT * FROM user_sessions WHERE session_id = ?`,
    session_id,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      } else {
        return result(null, res);
      }
    }
  );
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

UserSessionModel.updateUserSessionInfo = (
  user_id,
  machine_id,
  model,
  result
) => {
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

UserSessionModel.updateTime = (user_id, machine_id, session_id, result) => {
  sql.query(
    "UPDATE user_sessions SET updated_at = ? WHERE user_id = ? and machine_id = ? and session_id = ?",
    [model.updated_at, user_id, machine_id, session_id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      return result(null, res);
    }
  );
};

UserSessionModel.updateSessionInfo = (model, result) => {
  sql.query(
    "UPDATE user_sessions SET updated_at = ?, traffic_bytes = ?, ip = ? WHERE session_id = ?",
    [model.updated_at, model.traffic_bytes, model.ip, model.session_id],
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
