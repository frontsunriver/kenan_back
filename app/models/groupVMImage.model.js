const sql = require("./db.js");

const GroupVMImage = function (model) {
  this.group_id = model.group_id;
  this.vm_image_id = model.vm_image_id;
  this.launch_count = model.launch_count;
  this.last_launch_at = model.last_launch_at;
  this.is_valid = model.is_valid;
};

GroupVMImage.create = (model, result) => {
  sql.query("INSERT INTO group_vm_images SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

GroupVMImage.findById = (id, result) => {
  sql.query(
    `SELECT group_vm_images.*, vm_images.title, vm_images.password, vm_images.size, vm_images.description, vm_images.download_url, groups.name FROM group_vm_images left join groups on groups.id = group_vm_images.group_id left join vm_images on vm_images.id = group_vm_images.vm_image_id WHERE group_vm_images.id = ${id}`,
    (err, res) => {
      if (err) {
        console.log(err);
        result(err, null);
        return;
      }

      result(null, res);
      return;
    }
  );
};

GroupVMImage.findByGroupId = (id, result) => {
  sql.query(
    `SELECT group_vm_images.*, vm_images.title, vm_images.password, vm_images.size, vm_images.description, vm_images.download_url, groups.name FROM group_vm_images left join groups on groups.id = group_vm_images.group_id left join vm_images on vm_images.id = group_vm_images.vm_image_id WHERE group_vm_images.group_id = ${id}`,
    (err, res) => {
      if (err) {
        console.log(err);
        result(err, null);
        return;
      }
      result(null, res);
      return;
    }
  );
};

GroupVMImage.getAll = (keyword, flag, result) => {
  let query =
    "SELECT group_vm_images.*, vm_images.title, vm_images.password, vm_images.size, vm_images.description, vm_images.download_url, users.email, users.login_count FROM group_vm_images left join groups on groups.id = group_vm_images.group_id left join vm_images on vm_images.id = group_vm_images.vm_image_id where 1=1 ";

  if (keyword) {
    query += ` and (groups.name LIKE '%${keyword}%' or vm_images.title LIKE '%${keyword}%' or vm_images.description LIKE '%${keyword}%' or vm_images.download_url LIKE '%${keyword}%')`;
  }

  if (flag) {
    query += ` and group_vm_images.is_valid = ${flag}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

GroupVMImage.update = (id, model, result) => {
  sql.query(
    "UPDATE group_vm_images SET group_id = ?, vm_image_id = ?, is_valid = ? WHERE id = ?",
    [model.group_id, model.vm_image_id, model.is_valid, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      return result(null, res);
    }
  );
};

GroupVMImage.batchUpdate = (id, models, result) => {
  sql.query(
    "DELETE FROM group_vm_images WHERE group_id = ?",
    [id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (models.length > 0) {
        const values = models.map((model) => [id, model.id, 0, new Date(), 1]);
        const query = `
      INSERT INTO group_vm_images (group_id, vm_image_id, launch_count, last_launch_at, is_valid)
      VALUES ?`;

        sql.query(query, [values], (err, res) => {
          if (err) {
            result(err, null);
            return;
          }

          result(null, { affectedRows: res.affectedRows });
        });
      } else {
        return result(null, res);
      }
    }
  );
};

GroupVMImage.updateStatus = (id, model, result) => {
  sql.query(
    "UPDATE group_vm_images last_launch_at = ? WHERE id = ?",
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
        "SELECT * FROM group_vm_images WHERE id = ?",
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

GroupVMImage.remove = (id, result) => {
  sql.query("DELETE FROM group_vm_images WHERE id = ?", id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

GroupVMImage.removeAll = (result) => {
  sql.query("DELETE FROM group_vm_images", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = GroupVMImage;
