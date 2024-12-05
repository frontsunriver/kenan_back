const User = require("../models/user.model.js");
const UserMachine = require("../models/userMachine.model.js");
const UserSession = require("../models/userSession.model.js");
const md5 = require("md5");
const {
  hashPassword,
  makeLogs,
  generateRandomOTP,
  sendMail,
  generateSessionId,
} = require("../utils/utils.js");
const response = require("../utils/response.js");
const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  JWT_EXPIRES_TIME,
  PRODUCT_MODE,
} = require("../config/constant.js");

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

exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const machine_id = req.body.machine_id;
  const os = req.body.os;

  if (!email || !password || !machine_id || !os)
    return response(res, {}, {}, 400, "Bad Request");
  User.signin(email, password, async (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving user.",
      });
    else {
      if (data.length > 0) {
        const user_id = data[0].id;
        UserMachine.findByUserIdAndMachine(
          user_id,
          machine_id,
          os,
          (machineError, machineResult) => {
            if (machineError) {
              response(res, {}, {}, 400, "Something went wrong.");
            }
            if (machineResult.length > 0) {
              const otpValue = generateRandomOTP();
              if (PRODUCT_MODE == 1) {
                User.updateOtp(data[0].id, otpValue, (otpErr, otpRes) => {
                  if (otpErr) {
                    response(res, {}, {}, 400, "Something went wrong.");
                  }
                  sendMail(otpValue, email);
                  makeLogs(
                    0,
                    data[0].id,
                    email,
                    email,
                    "Login",
                    req.headers["x-forwarded-for"] || req.ip
                  );
                  return response(res, {
                    user: data[0],
                    message: "User log in successfully",
                  });
                });
              } else {
                makeLogs(
                  0,
                  data[0].id,
                  email,
                  email,
                  "Login",
                  req.headers["x-forwarded-for"] || req.ip
                );
                return response(res, {
                  user: data[0],
                  message: "User log in successfully",
                });
              }
            } else {
              response(
                res,
                {},
                {},
                400,
                "Your machine is not registered, please contact your admin to approve it."
              );
            }
          }
        );
      } else {
        return response(
          res,
          {},
          {},
          400,
          "User email or password is not valid."
        );
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
  const machine_id = req.body.machine_id;
  const ip = req.body.ip;

  if (!user_id || !machine_id)
    return response(res, {}, {}, 400, "User is not valid.");

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
    UserSession.findByUserId(user_id, machine_id, (err1, data1) => {
      if (data1.length > 0) {
        const userSessionModel = new UserSession({
          user_id: user_id,
          machine_id: machine_id,
          ip: ip,
          updated_at: new Date(),
          session_token: newToken,
        });
        UserSession.update(
          user_id,
          machine_id,
          userSessionModel,
          (err2, data2) => {
            return response(res, {
              is_valid: 1,
              token: newToken,
              message: "Session is valid",
            });
          }
        );
      } else {
        const userSessionModel = new UserSession({
          user_id: user_id,
          machine_id: machine_id,
          updated_at: new Date(),
          created_at: new Date(),
          ip: ip,
          session_token: newToken,
        });
        UserSession.create(userSessionModel, (err2, data2) => {
          return response(res, {
            is_valid: 1,
            token: newToken,
            message: "Session is valid",
          });
        });
      }
    });
  });
};

exports.checkOTP = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const otp = req.body.otp;
  const machine_id = req.body.machine_id;
  const os = req.body.os;
  const ip = req.body.ip;

  if (!otp || !email || !password || !machine_id || !os)
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
            UserMachine.updateOsInfo(data1[0].id, os, (err2, data2) => {});
            User.updateLoginCount(user_id, (err3, data3) => {});
            const sessionId = generateSessionId(40);
            console.log("session_id-----------------------", sessionId);
            // Update user session
            const userSessionModel = new UserSession({
              user_id: user_id,
              machine_id: machine_id,
              session_id: sessionId,
              updated_at: new Date(),
              created_at: new Date(),
              ip: ip,
            });
            UserSession.create(userSessionModel, (err2, data2) => {
              console.log(err2, data2);
            });
            // UserSession.findByUserId(
            //   user_id,
            //   machine_id,
            //   (sessionError, sessionData) => {
            //     if (sessionData.length > 0) {
            //       const userSessionModel = new UserSession({
            //         user_id: user_id,
            //         machine_id: machine_id,
            //         ip: ip,
            //         updated_at: new Date(),
            //         created_at: new Date(),
            //       });
            //       UserSession.updateUserSessionInfo(
            //         user_id,
            //         machine_id,
            //         userSessionModel,
            //         (err2, data2) => {}
            //       );
            //     } else {
            //       const userSessionModel = new UserSession({
            //         user_id: user_id,
            //         machine_id: machine_id,
            //         updated_at: new Date(),
            //         created_at: new Date(),
            //         ip: ip,
            //       });
            //       UserSession.create(userSessionModel, (err2, data2) => {});
            //     }
            //   }
            // );
            // End user session

            makeLogs(
              0,
              user_id,
              data[0].email,
              data[0].email,
              "checkOTP",
              `Correct: ${otp}`
            );

            return response(res, {
              token: token,
              user: data[0],
              session_id: sessionId,
              message: "User log in successfully",
            });
          } else {
            response(res, {}, {}, 500, "User can't access with this device.");
          }
        });
      } else {
        // Logs  oject_title: 'user_email' action: checkOTP detail: incorrect: otp parameter
        return response(res, {}, {}, 400, "Code is not correct.");
      }
    }
  });
};
