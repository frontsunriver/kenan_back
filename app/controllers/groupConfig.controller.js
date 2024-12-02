const Model = require("../models/groupConfig.model.js");
const response = require("../utils/response.js");
const { makeLogs } = require("../utils/utils.js");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const model = new Model({
    group_id: req.body.group_id,
    copy_file_to_vm: req.body.copy_file_to_vm,
    copy_file_from_vm: req.body.copy_file_from_vm,
    copy_text_to_vm: req.body.copy_text_to_vm,
    copy_text_from_vm: req.body.copy_text_from_vm,
    allow_screenshot: req.body.allow_screenshot,
    is_valid: req.body.is_valid,
  });

  Model.create(model, (err, data) => {
    if (err)
      res.send({
        success: false,
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    else res.send({ success: true, data: data });
  });
};

exports.getAll = (req, res) => {
  const flag = req.body.flag;
  const keyword = req.body.keyword;

  Model.getAll(keyword, flag, (err, data) => {
    if (err)
      res.send({
        success: false,
        message: err.message || "Something went wrong",
      });
    else {
      if (data) {
        res.send({ success: true, data: data });
      } else {
        res.send({ success: true, message: [] });
      }
    }
  });
};

exports.findById = (req, res) => {
  if (!req.body) {
    res.send({
      success: false,
      message: "Content can not be empty!",
    });
  }
  const id = req.body.id;
  try {
    Model.findById(id, (err, data) => {
      if (err)
        res.send({
          success: false,
          message: err.message || "Something went wrong",
        });
      else {
        return res.send({ success: true, data: data });
      }
    });
  } catch (err) {
    res.send({
      success: false,
      message: "Wrong Parameter!",
    });
  }
};

exports.findByGroupId = (req, res) => {
  if (!req.body) {
    res.send({
      success: false,
      message: "Content can not be empty!",
    });
  }
  const user_id = req.body.user_id;
  try {
    Model.findByGroupId(user_id, (err, data) => {
      if (err)
        res.send({
          success: false,
          message: "Something went wrong!",
        });
      else {
        return res.send({ success: true, data: data });
      }
    });
  } catch (err) {
    res.send({
      success: false,
      message: "Server error",
    });
  }
};

exports.checkConfig = (req, res) => {
  if (!req.body) {
    return response(res, {}, {}, 400, "Bad Request.");
  }

  const user_id = req.body.user_id;
  const group_id = req.body.group_id;
  const vm_image_id = req.body.vm_image_id;

  if (!user_id || !group_id || !vm_image_id) {
    return response(res, {}, {}, 400, "Bad Request.");
  }

  Model.checkConfig(user_id, group_id, (err, checkGroup) => {
    if (err) return response(res, {}, {}, 500, "Something went wrong.");
    if (checkGroup.length > 0) {
      Model.checkVMImage(group_id, vm_image_id, (vmErr, checkVM) => {
        if (vmErr) return response(res, {}, {}, 500, "Something went wrong.");
        if (checkVM.length > 0) {
          Model.getUserConfig(group_id, (error, data) => {
            if (error)
              return response(res, {}, {}, 500, "Something went wrong.");
            // Logs  oject_title: '' action: 'checkConfig', detail: ''
            makeLogs(0, user_id, "", "", "CheckConfig", "");
            return response(res, data);
          });
        } else {
          response(res, {}, {}, 500, "VM Image does not exist in this group.");
        }
      });
    } else {
      response(res, {}, {}, 500, "User does not exist in this group.");
    }
  });
};

exports.findByUserId = (req, res) => {
  if (!req.body) {
    return response(res, {}, {}, 400, "Bad Request.");
  }

  const user_id = req.body.user_id;
  try {
    Model.findByUserId(user_id, (err, data) => {
      if (err) return response(res, {}, {}, 500, "Something went wrong.");
      else {
        try {
          const groupedData = {};
          data.ports.forEach((port) => {
            const { group_id } = port;
            if (!groupedData[group_id]) {
              groupedData[group_id] = {
                id: group_id,
                name: port.name,
                vm_images: [],
                ports: [],
                config: {
                  copy_text_to_vm: 0,
                  copy_text_from_vm: 0,
                  copy_file_to_vm: 0,
                  copy_file_from_vm: 0,
                  allow_screenshot: 0,
                  enable_outbound: 0,
                },
              };
            }

            // Add port to the corresponding group
            groupedData[group_id].ports.push({
              title: port.title,
              listen_port: port.listen_port,
              target: port.target,
              target_port: port.target_port,
              is_https: port.is_https,
            });
          });

          data.vm.forEach((image) => {
            const { group_id } = image;

            if (groupedData[group_id]) {
              groupedData[group_id].vm_images.push({
                id: image.id,
                title: image.title,
                description: image.description,
                password: image.password,
                size: image.size,
              });
            }
          });

          data.config.forEach((config) => {
            const { group_id } = config;

            if (groupedData[group_id]) {
              groupedData[group_id].config = {
                copy_text_to_vm: config.copy_text_to_vm,
                copy_text_from_vm: config.copy_text_from_vm,
                copy_file_to_vm: config.copy_file_to_vm,
                copy_file_from_vm: config.copy_file_from_vm,
                allow_screenshot: config.allow_screenshot,
                enable_outbound: config.enable_outbound,
              };
            }
          });
          const result = {
            groups: Object.values(groupedData),
            session_expircy_time: data.global_config[0].session_expircy_time,
            agent_timeout: data.global_config[0].agent_timeout,
          };
          // Logs  oject_title: '' action: 'getConfig', detail: ''
          makeLogs(0, user_id, "", "", "GetConfig", "");
          return response(res, result);
        } catch (exp) {
          return response(res, {}, {}, 500, "User does not have any group.");
        }
      }
    });
  } catch (err) {
    return response(res, {}, {}, 500, "Server error.");
  }
};

exports.findByGroupId = (req, res) => {
  if (!req.body) {
    return response(res, {}, {}, 400, "Bad Request.");
  }
  const group_id = req.body.group_id;
  try {
    Model.findByGroupId(group_id, (err, data) => {
      if (err) return response(res, {}, {}, 500, "Something went wrong.");
      else {
        return response(res, {
          data: data,
        });
      }
    });
  } catch (err) {
    return response(res, {}, {}, 500, "Server error.");
  }
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const id = req.body.id;

  Model.findByGroupId(id, (err, data) => {
    if (err)
      return res.send({ success: false, message: "Something went wrong" });
    else {
      if (data.length > 0) {
        const model = new Model({
          group_id: id,
          copy_text_to_vm: req.body.copy_text_to_vm,
          copy_text_from_vm: req.body.copy_text_from_vm,
          copy_file_to_vm: req.body.copy_file_to_vm,
          copy_file_from_vm: req.body.copy_file_from_vm,
          allow_screenshot: req.body.allow_screenshot,
          enable_outbound: req.body.enable_outbound,
          is_valid: 1,
        });

        Model.updateByGroupId(id, model, (err1, data1) => {
          if (err1) {
            res.status(500).send({
              message:
                err1.message || "Some error occurred while retrieving user.",
            });
          } else {
            if (data1) {
              res.send({ success: true, data: data1 });
            } else {
              res.send({ success: false });
            }
          }
        });
      } else {
        const model = new Model({
          group_id: id,
          copy_text_to_vm: req.body.copy_text_to_vm,
          copy_text_from_vm: req.body.copy_text_from_vm,
          copy_file_to_vm: req.body.copy_file_to_vm,
          copy_file_from_vm: req.body.copy_file_from_vm,
          allow_screenshot: req.body.allow_screenshot,
          enable_outbound: req.body.enable_outbound,
          is_valid: 1,
        });
        Model.create(model, (err1, data1) => {
          if (err1)
            res.status(500).send({
              message:
                err1.message || "Some error occurred while retrieving user.",
            });
          else {
            if (data1) {
              res.send({ success: true, data: data1 });
            } else {
              res.send({ success: false });
            }
          }
        });
      }
    }
  });
};

exports.remove = (req, res) => {
  const id = req.body.id;

  Model.remove(id, (err, data) => {
    if (err)
      res.send({
        success: false,
        message: err.message || "Something went wrong",
      });
    else {
      res.send({ success: true, data: data });
    }
  });
};
