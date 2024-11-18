const Model = require("../models/userVMImage.model.js");
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
    vm_image_id: req.body.vm_image_id,
    is_valid: req.body.is_valid,
    created_at: new Date(),
  });

  Model.create(model, (err, data) => {
    console.log(err);
    if (err) {
      if (err.errno == 1062) {
        res.send({
          success: false,
          message: "User can't have same vm image",
        });
      } else {
        res.send({
          success: false,
          message:
            err.message || "Some error occurred while creating the Tutorial.",
        });
      }
    } else res.send({ success: true, data: data });
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
    return response(res, {}, {}, 400, "Bad Request.");
  }

  const id = req.body.id;
  try {
    Model.findById(id, (err, data) => {
      if (err) return response(res, {}, {}, 500, "Something went wrong.");
      else {
        return response(res, {
          data: data.length > 0 ? data[0] : {},
        });
      }
    });
  } catch (err) {
    res.send({
      success: false,
      message: "Wrong Parameter!",
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
        response(res, { data: data });
      }
    });
  } catch (err) {
    return response(res, {}, {}, 400, "Something went wrong.");
  }
};

exports.updateStatus = (req, res) => {
  if (!req.body) {
    return response(res, {}, {}, 400, "Bad Request.");
  }

  const id = req.body.id;
  const action = req.body.action;

  if (action == "start") {
    const model = new Model({
      last_launch_at: new Date(),
    });

    Model.updateStatus(id, model, (err, data) => {
      if (err) return response(res, {}, {}, 500, "Something went wrong.");
      else {
        if (data) {
          response(res, {
            status: "1",
          });
        } else {
          return response(res, {}, {}, 500, "Something went wrong.");
        }
      }
    });
  } else {
    response(res, {
      message: "VM is turned off",
    });
  }
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const id = req.body.id;

  console.log(req.body.is_valid);

  const model = new Model({
    user_id: req.body.user_id,
    vm_image_id: req.body.vm_image_id,
    is_valid: req.body.is_valid,
  });

  Model.update(id, model, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving user.",
      });
    else {
      if (data) {
        res.send({ success: true, users: data });
      } else {
        res.send({ success: false });
      }
    }
  });
};

exports.batchUpdate = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const id = req.body.id;
  const modelData = req.body.data;

  Model.batchUpdate(id, modelData, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving user.",
      });
    } else {
      if (data) {
        res.send({ success: true, data: data });
      } else {
        res.send({ success: false });
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
