const sql = require("./db.js");

// constructor
const Admin = function (user) {
  this.name = user.name;
  this.email = user.email;
  this.password = user.password;
  this.last_login_at = user.last_login_at;
  this.login_count = user.login_count;
  this.created_at = user.created_at;
  this.is_valid = user.is_valid;
};

Admin.create = (newUser, result) => {
  sql.query("INSERT INTO admins SET ?", newUser, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newUser });
  });
};

Admin.findById = (id, result) => {
  sql.query(`SELECT * FROM admins WHERE id = ${id}`, (err, res) => {
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

Admin.signin = (email, password, result) => {
  let query = "SELECT * FROM admins";

  if (email) {
    query += ` WHERE email = '${email}' and password = '${password}' and is_valid = 1`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

Admin.getAll = (keyword, result) => {
  let query = "SELECT * from admins where 1=1 ";

  if (keyword) {
    query += ` where name LIKE '%${keyword}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

Admin.update = (id, name, email, role, result) => {
  sql.query(
    "UPDATE admins SET name = ?, email = ?, role = ? WHERE id = ?",
    [name, email, role, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      result(null, userRes[0]);
    }
  );
};

Admin.remove = (id, result) => {
  sql.query("DELETE FROM admins WHERE id = ?", id, (err, res) => {
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

module.exports = Admin;
