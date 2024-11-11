const Model = require("../models/comment.model.js");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const model = new Model({
    post_id: req.body.post_id,
    user_id: req.body.user_id,
    comment: req.body.comment,
    reg_date: new Date(),
  });

  Model.create(model, (err, data) => {
    if (err)
      res.send({
        success: false,
        message: err.message || "Something went wrong",
      });
    else res.send({ success: true, data: data });
  });
};

exports.findById = (req, res) => {
  const id = req.body.id;

  Model.findById(id, (err, data) => {
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

exports.getAll = (req, res) => {
  Model.getAll((err, data) => {
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

exports.update = (req, res) => {
  const id = req.body.id;

  const model = new Model({
    content: req.body.content,
    user_id: req.body.user_id,
    event_id: req.body.event_id,
  });

  Model.updateById(id, model, (err, data) => {
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
