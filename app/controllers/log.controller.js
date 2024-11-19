const Model = require("../models/logs.model.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const model = new Model({
    object_type: req.body.object_type,
    object_id: req.body.object_id,
    object_title: req.body.object_title,
    action: req.body.action,
    details: req.body.details,
    time: new Date(),
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

exports.findByUserId = (req, res) => {
  if (!req.body) {
    res.send({
      success: false,
      message: "Content can not be empty!",
    });
  }
  const id = req.body.user_id;
  const user_type = req.body.user_type;
  try {
    Model.findByUserId(id, user_type, (err, data) => {
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

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const id = req.body.id;

  const model = new Model({
    object_type: req.body.object_type,
    object_id: req.body.object_id,
    object_title: req.body.object_title,
    action: req.body.action,
    details: req.body.details,
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
