const Model = require("../models/groupVMImage.model.js");
const response = require("../utils/response.js");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const model = new Model({
    group_id: req.body.group_id,
    vm_image_id: req.body.vm_image_id,
    is_valid: req.body.is_valid,
    created_at: new Date(),
  });

  Model.create(model, (err, data) => {
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

exports.findByGroupId = (req, res) => {
  if (!req.body) {
    return response(res, {}, {}, 400, "Bad Request.");
  }
  const group_id = req.body.group_id;
  try {
    Model.findByGroupId(group_id, (err, data) => {
      if (err) return response(res, {}, {}, 500, "Something went wrong.");
      else {
        response(res, { data: data });
      }
    });
  } catch (err) {
    return response(res, {}, {}, 400, "Something went wrong.");
  }
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const id = req.body.id;

  const model = new Model({
    group_id: req.body.group_id,
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
        res.send({ success: true, data: data });
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
