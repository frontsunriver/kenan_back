const sql = require("./db.js");

const VMImage = function (model) {
  this.title = model.title;
  this.password = model.password;
  this.description = model.description;
  this.is_valid = model.is_valid;
  this.created_at = model.created_at;
  this.download_url = model.download_url;
};

VMImage.create = (model, result) => {
  sql.query("INSERT INTO vm_images SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

VMImage.findById = (id, result) => {
  sql.query(`SELECT * FROM vm_images WHERE id = ${id}`, (err, res) => {
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

VMImage.findByUserId = (id, result) => {
  sql.query(`SELECT * FROM vm_images WHERE user_id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

VMImage.getAll = (keyword, flag, result) => {
  let query = "SELECT * from vm_images where 1=1 ";

  if (keyword) {
    // query += ` and (users.first_name LIKE '%${keyword}%' or users.last_name LIKE '%${keyword}%' or users.handle LIKE '%${keyword}%')`;
  }

  if (flag) {
    query += ` and vm_images.is_valid = ${flag}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

VMImage.update = (id, model, result) => {
  sql.query(
    "UPDATE vm_images SET title = ?, password = ?, description = ?, download_url = ?, is_valid = ? WHERE id = ?",
    [model.title, model.password, model.description, model.download_url, model.is_valid, id],
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
        "SELECT * FROM vm_images WHERE id = ?",
        [id],
        (err, userRes) => {
          if (err) {
            result(null, err);
            return;
          }

          if (userRes.length) {
            result(null, userRes[0]);
          } else {
            result({ kind: "not_found" }, null);
          }
        }
      );
    }
  );
};

VMImage.remove = (id, result) => {
  sql.query("DELETE FROM vm_images WHERE id = ?", id, (err, res) => {
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

VMImage.removeAll = (result) => {
  sql.query("DELETE FROM vm_images", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = VMImage;
