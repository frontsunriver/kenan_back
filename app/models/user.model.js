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

User.getAll = (keyword, flag, result) => {
  let query = "SELECT * from users where 1=1 ";

  if (keyword) {
    // query += ` and (users.first_name LIKE '%${keyword}%' or users.last_name LIKE '%${keyword}%' or users.handle LIKE '%${keyword}%')`;
  }

  if (flag) {
    query += ` and users.is_valid = ${flag}`;
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
    "UPDATE users SET name = ?, email = ?, is_valid = ? WHERE id = ?",
    [user.name, user.email, user.is_valid, id],
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
    `update users set login_count = (select login_count from users where id = ${id}) + 1, last_login_at = ? where id = ${id}`,
    [new Date()],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
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
  let query = "SELECT * FROM users";

  if (email) {
    query += ` WHERE email = '${email}' and password = '${password}'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

User.checkOTP = (email, password, otp, result) => {
  let query = "SELECT * FROM users";

  if (email) {
    query += ` WHERE email = '${email}' and password = '${password}' and otp_secret = ${otp}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = User;
