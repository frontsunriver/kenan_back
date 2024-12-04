const sql = require("./db.js");

const AdminRole = function (model) {
  this.user_id = model.user_id;
  this.role_id = model.role_id;
  this.checked = model.checked;
  this.partialChecked = model.partialChecked;
};

AdminRole.create = (model, result) => {
  sql.query("INSERT INTO admin_roles SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

AdminRole.getList = (result) => {
  sql.query(`Select * from url_lists order by parent`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
    return;
  });
};

AdminRole.findRoot = (result) => {
  sql.query(`Select * from url_lists where parent = 0`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
    return;
  });
};

AdminRole.findByParentId = (id, parentId, result) => {
  sql.query(
    `Select url_lists.*, a.user_id, a.role_id from url_lists left join (select * from admin_roles where user_id = ${id}) a on a.role_id = url_lists.id where url_lists.parent = ${parentId}`,
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

AdminRole.findById = (id, result) => {
  sql.query(`Select * from url_lists where parent = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
    return;
  });
};

AdminRole.getAdminRoles = (id, result) => {
  sql.query(
    `select admin_roles.id, admin_roles.user_id, admin_roles.role_id, url_lists.name, url_lists.url from admin_roles left join url_lists on url_lists.id = admin_roles.role_id where admin_roles.user_id = ${id}`,
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

AdminRole.findByUserId = (id, result) => {
  sql.query(
    `select * from admin_roles where admin_roles.user_id = ${id}`,
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

AdminRole.update = (id, model, result) => {
  sql.query(
    "UPDATE admin_roles SET user_id = ?, role_id = ? WHERE id = ?",
    [model.user_id, model.role_id, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      return result(null, res);
    }
  );
};

AdminRole.batchUpdate = (id, models, result) => {
  sql.query("DELETE FROM admin_roles WHERE user_id = ?", [id], (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (models.length > 0) {
      const values = models.map((model) => [id, model.role_id, model.checked, model.partialChecked]);
      const query = `
      INSERT INTO admin_roles (user_id, role_id, checked, partialChecked)
      VALUES ?`;

      sql.query(query, [values], (err, res) => {
        if (err) {
          result(err, null);
          return;
        }

        result(null, { affectedRows: res.affectedRows });
      });
    } else {
      result(null, res);
      return;
    }
  });
};

AdminRole.remove = (id, role_id, result) => {
  sql.query(
    "DELETE FROM admin_roles WHERE user_id = ? and role_id = ?",
    [id, role_id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      result(null, res);
    }
  );
};

AdminRole.removeAll = (id, result) => {
  sql.query(`DELETE FROM admin_roles where user_id = ${id}`, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

AdminRole.findAllRoles = (result) => {
  sql.query(`Select * from url_lists where parent != 0`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
    return;
  });
};

module.exports = AdminRole;
