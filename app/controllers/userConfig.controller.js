const Model = require("../models/userConfig.model.js");
const response = require("../utils/response.js");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const model = new Model({
    user_id: req.body.user_id,
    copy_to_vm: req.body.copy_to_vm,
    enable_outbound: req.body.enable_outbound,
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

exports.findByUserId1 = (req, res) => {
  if (!req.body) {
    res.send({
      success: false,
      message: "Content can not be empty!",
    });
  }
  const user_id = req.body.user_id;
  try {
    Model.findByUserId(user_id, (err, data) => {
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

exports.findByUserId = (req, res) => {
  if (!req.body) {
    return response(res, {}, {}, 400, "Bad Request.");
  }
  const user_id = req.body.user_id;
  try {
    Model.findByUserId(user_id, (err, data) => {
      if (err) return response(res, {}, {}, 500, "Something went wrong.");
      else {
        return response(res, {
          data: data.length > 0 ? data[0] : {},
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

  Model.findByUserId(id, (err, data) => {
    if (err)
      return res.send({ success: false, message: "Something went wrong" });
    else {
      if (data.length > 0) {
        const model = new Model({
          user_id: id,
          copy_text_to_vm: req.body.copy_text_to_vm,
          copy_text_from_vm: req.body.copy_text_from_vm,
          copy_file_to_vm: req.body.copy_file_to_vm,
          copy_file_from_vm: req.body.copy_file_from_vm,
          allow_screenshot: req.body.allow_screenshot,
          enable_outbound: req.body.enable_outbound,
          is_valid: 1,
        });

        Model.updateByUserId(id, model, (err1, data1) => {
          if (err1) {
            console.log(err1);
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
          user_id: id,
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
