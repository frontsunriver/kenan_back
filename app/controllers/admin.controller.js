const Model = require("../models/admin.model.js");
const LogsModel = require("../models/logs.model.js");
const AdminRolesModel = require("../models/adminRole.model.js");
const md5 = require("md5");

exports.create = (req, res) => {
  const email = req.body.email;
  const password = md5(req.body.password);
  const is_valid = req.body.is_valid;

  const model = new Model({
    email: email,
    password: password,
    is_valid: is_valid,
  });

  Model.create(model, (err, data) => {
    if (err) {
      if (err.errno == 1062) {
        res.send({
          success: false,
          message: "User email already exists",
        });
      } else {
        res.send({
          success: false,
          message: err.message || "Some error occurred while retrieving user.",
        });
      }
    } else {
      return res.send({ success: true, data: data });
    }
  });
};

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
        Model.addLoginCount(data[0].id, (error, loginData) => {});
        const logData = {
          user_type: 1,
          user_id: data[0].id,
          user_email: data[0].email,
          object_title: "Admin Login",
          action: "Login",
          time: new Date(),
          details: req.headers["x-forwarded-for"] || req.ip,
        };
        LogsModel.create(logData, (err1, data1) => {});
        AdminRolesModel.getAdminRoles(data[0].id, (error, result) => {
          if (error) {
            console.log(error);
            return res.send({
              success: false,
              message: "Something went wrong",
            });
          }
          data[0]["roles"] = result;
          res.send({ success: true, users: data });
        });
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
  const flag = req.body.flag;
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
