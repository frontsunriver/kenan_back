const sql = require("./db.js");

const UserConnectionModel = function (model) {
  this.user_id = model.user_id;
  this.machine_id = model.machine_id;
  this.listen_port = model.listen_port;
  this.status = model.status;
  this.updated_at = model.updated_at;
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

UserConnectionModel.findByUserId = (user_id, machine_id, result) => {
  sql.query(
    `SELECT * FROM user_conns WHERE user_id = ? and machine_id = ?`,
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

UserConnectionModel.getAll = (keyword, flag, result) => {
  let query = `Select * from (SELECT *, CASE 
        WHEN updated_at >= NOW() - INTERVAL 30 SECOND THEN 1 
        ELSE 0 
    END AS status from user_conns where 1=1) a left join users on users.id = a.user_id `;

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

UserConnectionModel.update = (user_id, machine_id, model, result) => {
  sql.query(
    "UPDATE user_conns SET updated_at = ?, status = ? WHERE user_id = ? and machine_id = ?",
    [model.updated_at, model.status, user_id, machine_id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      return result(null, res);
    }
  );
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