const User = require("../models/user.model.js");
const md5 = require("md5");
const { hashPassword } = require("../utils/utils.js");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const user = new User({
    email: req.body.email,
    password: hashPassword(req.body.password),
    is_valid: req.body.is_valid,
    otp_secret: "123456",
    login_count: 0,
    created_at: new Date(),
  });

  User.create(user, (err, data) => {
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
  const loginStart = req.body.loginStart
  const loginEnd = req.body.loginEnd;
  const createdStart = req.body.createdStart;
  const createdEnd = req.body.createdEnd;

  User.getAll(keyword, flag, loginStart, loginEnd, createdStart, createdEnd, (err, data) => {
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
    User.findById(id, (err, data) => {
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

  const user = new User({
    email: req.body.email,
    is_valid: req.body.is_valid,
  });

  User.update(id, user, (err, data) => {
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

exports.resetPassword = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const id = req.body.id;

  const user = new User({
    password: hashPassword("123456"),
  });

  User.updatePassword(id, user, (err, data) => {
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

exports.updateUserInfo = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const id = req.body.id;

  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    handle: req.body.handle,
  });

  User.updateUserInfo(id, user, (err, data) => {
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

exports.updatePassword = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const id = req.body.id;
  const user = new User({
    password: md5(req.body.password),
  });

  User.updatePassword(id, user, (err, data) => {
    if (err)
      res.send({
        success: false,
        message: err.message || "Updating avatar is failed.",
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

  User.remove(id, (err, data) => {
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
