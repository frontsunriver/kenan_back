const sql = require("./db.js");

// constructor
const Contact = function (model) {
  this.name = model.user_id;
  this.phone = model.phone;
  this.email = model.email;
  this.content = model.content;
  this.reg_date = model.reg_date;
};

Contact.create = (data, result) => {
  sql.query("INSERT INTO contacts SET ?", data, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...data });
  });
};

Contact.findById = (id, result) => {
  sql.query(
    `SELECT * from contacts where id = ${id} `,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        return result(null, res);
      }

      return result({ kind: "not_found" }, null);
    }
  );
};

Contact.remove = (id, result) => {
  sql.query("DELETE FROM contacts WHERE id = ?", id, (err, res) => {
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

Contact.removeAll = (result) => {
  sql.query("DELETE FROM contacts", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = Contact;
