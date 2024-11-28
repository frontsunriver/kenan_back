const sql = require("./db.js");

const UserMachine = function (model) {
  this.machine_id = model.machine_id;
  this.user_id = model.user_id;
  this.is_valid = model.is_valid;
  this.os = model.os;
  this.details = model.details;
  this.status = model.status;
  this.started_count = model.started_count;
  this.last_started_at = model.last_started_at;
};

UserMachine.create = (model, result) => {
  sql.query("INSERT INTO user_machines SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

UserMachine.findById = (id, result) => {
  sql.query(`SELECT * FROM user_machines WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
    return;
  });
};

UserMachine.findByUserIdAndMachine = (user_id, machine_id, result) => {
  sql.query(
    `SELECT * FROM user_machines where user_id = ${user_id} and machine_id = '${machine_id}' `,
    (err, data) => {
      if (err) {
        result(err, null);
        return;
      }
      return result(null, res);
    }
  );
};

UserMachine.checkValidMachine = (user_id, machine_id, result) => {
  sql.query(
    `SELECT * FROM user_machines WHERE user_id = ${user_id} and machine_id = '${machine_id}'`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      return result(null, res);
    }
  );
};

UserMachine.user = (id, result) => {
  sql.query(`SELECT * FROM user_machines WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

UserMachine.getAll = (keyword, flag, result) => {
  let query =
    "SELECT user_machines.*, users.email from user_machines left join users on users.id = user_machines.user_id where 1=1 ";

  if (keyword) {
    query += ` and (users.email LIKE '%${keyword}%' or user_machines.machine_id LIKE '%${keyword}%')`;
  }

  if (flag) {
    query += ` and user_machines.is_valid = ${flag}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

UserMachine.update = (id, model, result) => {
  sql.query(
    "UPDATE user_machines SET machine_id = ?, user_id = ?, is_valid = ? WHERE id = ?",
    [model.machine_id, model.user_id, model.is_valid, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      sql.query(
        "SELECT * FROM user_machines WHERE id = ?",
        [id],
        (err1, userRes) => {
          if (err1) {
            result(null, err);
            return;
          }

          result(null, userRes);
        }
      );
    }
  );
};

UserMachine.updateOsInfo = (id, os, result) => {
  sql.query(
    "UPDATE user_machines SET os = ?, last_started_at = ? WHERE id = ?",
    [os, new Date(), id],
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
        `update user_machines set started_count = (select started_count from user_machines where id = ${id}) + 1 where id = ${id}`,
        (err1, res1) => {
          if (err1) {
            result(null, err1);
            return;
          }

          if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
          }

          result(null, res1);
        }
      );
    }
  );
};

UserMachine.remove = (id, result) => {
  sql.query("DELETE FROM user_machines WHERE id = ?", id, (err, res) => {
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

UserMachine.removeAll = (result) => {
  sql.query("DELETE FROM user_machines", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = UserMachine;
