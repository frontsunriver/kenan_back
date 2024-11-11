const User = require("../models/user.model.js");
const UserMachine = require("../models/userMachine.model.js");
const md5 = require("md5");
const { hashPassword } = require("../utils/utils.js");
const response = require("../utils/response.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_TIME } = require("../config/constant.js");

exports.register = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const user = new User({
    handle: req.body.handle,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: hashPassword(req.body.password),
    status: 1,
    role: 0,
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

exports.becomeCreator = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const id = req.body.id;

  const user = new User({
    handle: req.body.handle,
    email: req.body.email,
    status: 1,
    role: 1,
  });

  User.becomeCreator(id, user, (err, data) => {
    if (err)
      res.send({
        success: false,
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    else res.send({ success: true, users: data });
  });
};

exports.googleRegister = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    handle: req.body.handle,
    status: 1,
    role: 0,
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

exports.registerCreator = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const user = new User({
    handle: req.body.handle,
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: md5(req.body.password),
    status: 1,
    role: 1,
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

exports.googleCreatorRegister = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    handle: req.body.handle,
    status: 1,
    role: 1,
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

exports.login = (req, res) => {
  const email = req.body.email;
  // const password = md5(req.body.password);
  const password = req.body.password;

  if (!email || !password)
    return response(res, {}, {}, 400, "Please fill all the required fields.");

  User.signin(email, password, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving user.",
      });
    else {
      if (data[0]) {
        return response(res, {
          user: data[0],
          message: "User log in successfully",
        });
      } else {
        return response(res, {}, {}, 400, "User doesn't exist.");
      }
    }
  });
};

exports.logout = (req, res) => {
  return response(res, {
    message: "User logout",
  });
};

exports.validate = (req, res) => {
  const user_id = req.body.user_id;

  if (!user_id) return response(res, {}, {}, 400, "User is not valid.");

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token)
    response(res, {
      is_valid: 0,
      message: "Session is invalid",
    });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return response(res, {
        is_valid: 0,
        token: token,
        message: "Session is invalid",
      });
    const newToken = jwt.sign({ id: user_id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_TIME,
    });

    // check bear token here..........

    return response(res, {
      is_valid: 1,
      token: newToken,
      message: "Session is valid",
    });
  });
};

exports.checkOTP = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const otp = req.body.otp;
  const machine_id = req.body.machine_id;

  if (!otp || !email || !password || !machine_id)
    return response(res, {}, {}, 400, "Please fill all the required fields.");

  User.checkOTP(email, password, otp, (err, data) => {
    if (err) response(res, {}, {}, 500, "Something went wrong.");
    else {
      if (data[0]) {
        const user_id = data[0].id;
        UserMachine.checkValidMachine(user_id, machine_id, (err1, data1) => {
          if (err1) {
            response(res, {}, {}, 500, "Something went wrong.");
          }
          if (data1 && data1.length > 0) {
            const token = jwt.sign({ id: user_id }, JWT_SECRET, {
              expiresIn: JWT_EXPIRES_TIME,
            });
            return response(res, {
              token: token,
              user: data[0],
              message: "User log in successfully",
            });
          } else {
            response(res, {}, {}, 500, "User can't access with this device.");
          }
        });
      } else {
        return response(res, {}, {}, 400, "Code is not correct.");
      }
    }
  });
};
