const sql = require("./db.js");

// constructor
const User = function (user) {
  this.email = user.email;
  this.password = user.password;
  this.otp_secret = user.otp_secret;
  this.is_valid = user.is_valid;
  this.last_login_at = user.last_login_at;
  this.created_at = user.created_at;
  this.login_count = user.login_count;
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newUser });
  });
};

User.findById = (id, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
    return;
  });
};

User.getAll = (
  keyword,
  flag,
  loginStart,
  loginEnd,
  createdStart,
  createdEnd,
  result
) => {
  let query = "SELECT * from users where 1=1 ";

  if (keyword) {
    query += ` and email like '%${keyword}%'`;
  }

  if (flag) {
    query += ` and users.is_valid = ${flag}`;
  }

  if (loginStart && loginEnd) {
    query += ` and users.last_login_at >= '${loginStart}' and users.last_login_at <= '${loginEnd}'`;
  }

  if (createdStart && createdEnd) {
    query += ` and users.created_at >= '${createdStart}' and users.created_at <= '${createdEnd}'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

User.update = (id, user, result) => {
  sql.query(
    "UPDATE users SET email = ?, is_valid = ? WHERE id = ?",
    [user.email, user.is_valid, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      sql.query("SELECT * FROM users WHERE id = ?", [id], (err, userRes) => {
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

User.updateOtp = (id, otp, result) => {
  sql.query(
    "UPDATE users SET otp_secret = ? WHERE id = ?",
    [otp, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      return result(null, res);
    }
  );
};

User.updatePassword = (id, user, result) => {
  sql.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [user.password, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      sql.query("SELECT * FROM users WHERE id = ?", [id], (err, userRes) => {
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

User.updateLoginCount = (id, result) => {
  sql.query(
    `UPDATE users AS u
      JOIN (SELECT login_count FROM users WHERE id = ${id}) AS sub
      SET u.login_count = sub.login_count + 1, 
          u.last_login_at = ? 
      WHERE u.id = ${id}`,
    new Date(),
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      result(null, res);
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

User.removeAll = (result) => {
  sql.query("DELETE FROM users", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

User.signin = (email, password, result) => {
  let query = "SELECT * FROM users WHERE 1=1 ";

  if (email) {
    query += ` and email = '${email}' and password = '${password}'`;
  }

  query += " and is_valid = 1";

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

User.checkOTP = (email, password, otp, result) => {
  let query = "SELECT * FROM users WHERE 1=1 ";

  if (email) {
    query += ` and email = '${email}' and password = '${password}' and otp_secret = ${otp}`;
  }

  query += " and is_valid = 1";

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = User;
