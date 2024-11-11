const Model = require("../models/port.model.js");
const response = require("../utils/response.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const model = new Model({
    title: req.body.title,
    listen_port: req.body.listen_port,
    target_port: req.body.target_port,
    target: req.body.target_ip,
    is_https: req.body.is_https,
    is_active: req.body.is_active,
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
    if (err) return response(res, {}, {}, 500, "Something went wrong.");
    else {
      return response(res, { data: data });
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
          data: data,
        });
      }
    });
  } catch (err) {
    return response(res, {}, {}, 500, "Something went wrong.");
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
    title: req.body.title,
    target: req.body.target,
    listen_port: req.body.listen_port,
    target_port: req.body.target_port,
    is_https: req.body.is_https,
    is_active: req.body.is_active,
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
