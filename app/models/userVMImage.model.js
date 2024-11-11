const sql = require("./db.js");

const UserVMImage = function (model) {
  this.user_id = model.user_id;
  this.vm_image_id = model.vm_image_id;
  this.launch_count = model.launch_count;
  this.last_launch_at = model.last_launch_at;
  this.is_valid = model.is_valid;
};

UserVMImage.create = (model, result) => {
  sql.query("INSERT INTO user_vm_images SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

UserVMImage.findById = (id, result) => {
  sql.query(
    `SELECT user_vm_images.*, vm_image.title, vm_image.description, vm_image.download_url, users.email, users.login_count FROM user_vm_images left join users on users.id = user_vm_images.user_id left join vm_images on vm_images.id = user_vm_images.vm_image_id WHERE user_vm_images.id = ${id}`,
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

UserVMImage.findByUserId = (id, result) => {
  sql.query(
    `SELECT user_vm_images.*, vm_images.title, vm_images.description, vm_images.download_url, users.email, users.login_count FROM user_vm_images left join users on users.id = user_vm_images.user_id left join vm_images on vm_images.id = user_vm_images.vm_image_id WHERE user_vm_images.user_id = ${id}`,
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

UserVMImage.getAll = (keyword, flag, result) => {
  let query =
    "SELECT user_vm_images.*, vm_images.title, vm_images.description, vm_images.download_url, users.email, users.login_count FROM user_vm_images left join users on users.id = user_vm_images.user_id left join vm_images on vm_images.id = user_vm_images.vm_image_id where 1=1 ";

  if (keyword) {
    // query += ` and (users.first_name LIKE '%${keyword}%' or users.last_name LIKE '%${keyword}%' or users.handle LIKE '%${keyword}%')`;
  }

  if (flag) {
    query += ` and user_vm_images.is_valid = ${flag}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

UserVMImage.update = (id, model, result) => {
  sql.query(
    "UPDATE user_vm_images SET user_id = ?, vm_image_id = ?, is_valid = ? WHERE id = ?",
    [model.user_id, model.vm_image_id, model.is_valid, id],
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
        "SELECT * FROM user_vm_images WHERE id = ?",
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

UserVMImage.batchUpdate = (id, models, result) => {
  sql.query(
    "DELETE FROM user_vm_images WHERE user_id = ?",
    [id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      const values = models.map((model) => [id, model.id, 0, new Date(), 1]);
      const query = `
    INSERT INTO user_vm_images (user_id, vm_image_id, launch_count, last_launch_at, is_valid)
    VALUES ?`;

      sql.query(query, [values], (err, res) => {
        if (err) {
          result(err, null);
          return;
        }

        result(null, { affectedRows: res.affectedRows });
      });
    }
  );
};

UserVMImage.updateStatus = (id, model, result) => {
  sql.query(
    "UPDATE user_vm_images last_launch_at = ? WHERE id = ?",
    [model.last_launch_at, id],
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
        "SELECT * FROM user_vm_images WHERE id = ?",
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

UserVMImage.remove = (id, result) => {
  sql.query("DELETE FROM user_vm_images WHERE id = ?", id, (err, res) => {
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

UserVMImage.removeAll = (result) => {
  sql.query("DELETE FROM user_vm_images", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = UserVMImage;
