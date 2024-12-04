const sql = require("./db.js");

const GroupConfig = function (model) {
  this.group_id = model.group_id;
  this.copy_file_to_vm = model.copy_file_to_vm;
  this.copy_file_from_vm = model.copy_file_from_vm;
  this.copy_text_to_vm = model.copy_text_to_vm;
  this.copy_text_from_vm = model.copy_text_from_vm;
  this.allow_screenshot = model.allow_screenshot;
  this.enable_outbound = model.enable_outbound;
  this.is_valid = model.is_valid;
};

GroupConfig.create = (model, result) => {
  sql.query("INSERT INTO group_configs SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

GroupConfig.findById = (id, result) => {
  sql.query(`SELECT * FROM group_configs WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    return result(null, res);
  });
};

GroupConfig.getUserConfig = (group_id, result) => {
  const data = {};
  sql.query(
    `Select port_map.* from group_ports left join port_map on port_map.id = group_ports.port_map_id where group_ports.is_valid = 1 and port_map.is_active = 1 and group_ports.group_id = ${group_id}`,
    (portError, portData) => {
      if (portError) {
        result(portError, null);
        return;
      }
      data["ports"] = portData;
      data["config"] = {
        copy_text_to_vm: 0,
        copy_text_from_vm: 0,
        copy_file_to_vm: 0,
        copy_file_from_vm: 0,
        allow_screenshot: 0,
        enable_outbound: 0,
      };
      sql.query(
        `Select group_configs.* from group_configs where group_id = ${group_id}`,
        (configError, configRes) => {
          if (configError) {
            result(configError, null);
            return;
          } else {
            if (configRes.length > 0) {
              data["config"] = {
                copy_text_to_vm: configRes[0].copy_text_to_vm,
                copy_text_from_vm: configRes[0].copy_text_from_vm,
                copy_file_to_vm: configRes[0].copy_file_to_vm,
                copy_file_from_vm: configRes[0].copy_file_from_vm,
                allow_screenshot: configRes[0].allow_screenshot,
                enable_outbound: configRes[0].enable_outbound,
              };
            }
            return result(null, data);
          }
        }
      );
    }
  );
};

GroupConfig.findByUserId = (id, result) => {
  sql.query(
    `select group_users.group_id, groups_db.name, port_map.* from group_users left join groups_db on groups_db.id = group_users.group_id left join group_ports on group_ports.group_id = group_users.group_id left join port_map on group_ports.port_map_id = port_map.id where groups_db.is_valid = 1 and group_ports.is_valid = 1 and port_map.is_active = 1 and group_users.is_valid = 1 and group_users.user_id = ${id}`,
    (err, portRes) => {
      if (err) {
        result(err, null);
        return;
      }
      const data = {};
      data["ports"] = portRes;
      sql.query(
        `SELECT
              group_users.group_id,
              groups_db.NAME,
              vm_images.* 
            FROM
              group_users
              LEFT JOIN groups_db ON groups_db.id = group_users.group_id
              LEFT JOIN group_vm_images ON group_vm_images.group_id = group_users.group_id
              LEFT JOIN vm_images ON group_vm_images.vm_image_id = vm_images.id 
            WHERE
              groups_db.is_valid = 1 and group_vm_images.is_valid = 1 and vm_images.is_valid = 1 and group_users.is_valid = 1 and 
              group_users.user_id = ${id}`,
        (vmError, vmRes) => {
          if (vmError) {
            result(vmError, null);
            return;
          }
          data["vm"] = vmRes;
          sql.query(
            `Select group_configs.* from group_users left join group_configs on group_configs.group_id = group_users.group_id where group_users.is_valid = 1 and user_id = ${id}`,
            (configError, configRes) => {
              if (configError) {
                result(configError, null);
                return;
              } else {
                data["config"] = configRes;
                sql.query(`Select * from global_configs `, (gError, gRes) => {
                  if (gError) {
                    result(gError, null);
                    return;
                  } else {
                    data["global_config"] = gRes;
                    return result(null, data);
                  }
                });
              }
            }
          );
        }
      );
    }
  );
};

GroupConfig.checkConfig = (user_id, group_id, result) => {
  sql.query(
    `Select * from group_users where user_id = ${user_id} and group_id = ${group_id} and is_valid = 1 `,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      return result(null, res);
    }
  );
};

GroupConfig.checkVMImage = (group_id, vm_image_id, result) => {
  sql.query(
    `Select * from group_vm_images where group_id = ${group_id} and vm_image_id = ${vm_image_id} and is_valid = 1 `,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      return result(null, res);
    }
  );
};

GroupConfig.findByGroupId = (id, result) => {
  sql.query(
    `SELECT * FROM group_configs WHERE group_id = ${id}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      return result(null, res);
    }
  );
};

GroupConfig.getAll = (keyword, flag, result) => {
  let query = "SELECT * from group_configs where 1=1 ";

  if (keyword) {
    // query += ` and (users.first_name LIKE '%${keyword}%' or users.last_name LIKE '%${keyword}%' or users.handle LIKE '%${keyword}%')`;
  }

  if (flag) {
    query += ` and group_configs.is_valid = ${flag}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

GroupConfig.updateByGroupId = (id, model, result) => {
  sql.query(
    "UPDATE group_configs SET group_id = ?, copy_text_to_vm = ?, copy_text_from_vm = ?, copy_file_to_vm = ?, copy_file_from_vm = ?, allow_screenshot = ?, enable_outbound = ? WHERE group_id = ?",
    [
      model.group_id,
      model.copy_text_to_vm,
      model.copy_text_from_vm,
      model.copy_file_to_vm,
      model.copy_file_from_vm,
      model.allow_screenshot,
      model.enable_outbound,
      id,
    ],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      result(null, res);
      return;
    }
  );
};

GroupConfig.remove = (id, result) => {
  sql.query("DELETE FROM group_configs WHERE id = ?", id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    return result(null, res);
  });
};

GroupConfig.removeAll = (result) => {
  sql.query("DELETE FROM group_configs", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = GroupConfig;
