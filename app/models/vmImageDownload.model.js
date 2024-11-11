const sql = require("./db.js");

const VMImageDownload = function (model) {
  this.user_id = model.user_id;
  this.vm_image_id = model.vm_image_id;
  this.download_at = model.download_at;
};

VMImageDownload.create = (model, result) => {
  sql.query("INSERT INTO vm_image_downloads SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

VMImageDownload.findById = (id, result) => {
  sql.query(
    `SELECT vm_image_downloads.*, vm_image.title, vm_image.description, vm_image.download_url, users.email, users.login_count FROM vm_image_downloads left join users on users.id = vm_image_downloads.user_id left join vm_images on vm_images.id = vm_images_download WHERE vm_image_downloads.id = ${id}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, res);
      return;
    }
  );
};

VMImageDownload.findByUserId = (id, result) => {
  sql.query(
    `SELECT vm_image_downloads.*, vm_image.title, vm_image.description, vm_image.download_url, users.email, users.login_count FROM vm_image_downloads left join users on users.id = vm_image_downloads.user_id left join vm_images on vm_images.id = vm_images_download WHERE vm_image_downloads.user_id = ${id}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, res);
      return;
    }
  );
};

VMImageDownload.getAll = (keyword, flag, result) => {
  let query = `SELECT vm_image_downloads.*, vm_image.title, vm_image.description, vm_image.download_url, users.email, users.login_count FROM vm_image_downloads left join users on users.id = vm_image_downloads.user_id left join vm_images on vm_images.id = vm_images_download WHERE 1 = 1 `;

  if (keyword) {
    // query += ` and (users.first_name LIKE '%${keyword}%' or users.last_name LIKE '%${keyword}%' or users.handle LIKE '%${keyword}%')`;
  }

  query += ` and vm_image_downloads.is_valid = 1`;
  if (flag) {
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

VMImageDownload.update = (id, model, result) => {
  sql.query(
    "UPDATE vm_image_downloads SET user_id = ?, vm_image_id = ? WHERE id = ?",
    [model.user_id, model.vm_image_id, id],
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
        "SELECT * FROM vm_image_downloads WHERE id = ?",
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

VMImageDownload.remove = (id, result) => {
  sql.query("DELETE FROM vm_image_downloads WHERE id = ?", id, (err, res) => {
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

VMImageDownload.removeAll = (result) => {
  sql.query("DELETE FROM vm_image_downloads", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = VMImageDownload;
