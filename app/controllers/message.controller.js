const Model = require("../models/message.model.js");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const model = new Model({
    email: req.body.email,
    name: req.body.name,
    reg_date: new Date(),
    msg: req.body.msg,
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

exports.findByUserId = (req, res) => {
  const user_id = req.body.user_id;
  const category_id = req.body.category_id;
  const order = req.body.order;

  Model.findByUserId(user_id, category_id, order, (err, data) => {
    if (err)
      res.send({
        success: false,
        message: err.message || "Something went wrong",
      });
    else {
      if (data) {
        res.send({ success: true, data: data });
      } else {
        res.send({ success: true, data: [] });
      }
    }
  });
};

exports.followingCount = (req, res) => {
  const creator_id = req.body.creator_id;

  Model.followingCount(creator_id, (err, data) => {
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

exports.remove = (req, res) => {
  const user_id = req.body.user_id;
  const creator_id = req.body.creator_id;

  Model.remove(user_id, creator_id, (err, data) => {
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

exports.catRemove = (req, res) => {
  const user_id = req.body.user_id;
  const category_id = req.body.category_id;

  CatModel.remove(user_id, category_id, (err, data) => {
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
