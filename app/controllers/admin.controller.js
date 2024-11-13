const Model = require("../models/admin.model.js");
const LogsModel = require("../models/logs.model.js");
const md5 = require("md5");

exports.signin = (req, res) => {
  const email = req.body.email;
  const password = md5(req.body.password);
  Model.signin(email, password, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving user.",
      });
    else {
      if (data.length > 0) {
        const logData = {
          object_type: 1,
          object_id: data.id,
          object_title: "Admin Login",
          action: "Login",
          details: req.headers['x-forwarded-for'] || req.ip,
        };
        LogsModel.create(logData, (err1, data1) => {});
        res.send({ success: true, users: data });
      } else {
        res.send({ success: false });
      }
    }
  });
};

exports.signup = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const admin = new Model({
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password),
    created_at: new Date(),
    is_valid: 1,
  });

  Model.create(admin, (err, data) => {
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
  const keyword = req.body.keyword;

  Model.getAll(keyword, (err, data) => {
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
  const id = req.body.id;

  Model.findById(id, (err, data) => {
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

exports.update = (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const email = req.body.email;
  const role = req.body.role;

  Model.update(id, name, email, role, (err, data) => {
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

exports.updatePassword = (req, res) => {
  const id = req.body.id;
  const password = md5(req.body.password);

  Model.updatePassword(id, password, (err, data) => {
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
