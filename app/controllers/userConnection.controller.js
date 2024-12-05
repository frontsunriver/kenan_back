const Model = require("../models/userConnection.model.js");
const UserSession = require("../models/userSession.model.js");
const response = require("../utils/response.js");

exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    response(res, {}, {}, 400, "Bad Request.");
  }
  const model = new Model({
    user_id: req.body.user_id,
    machine_id: req.body.machine_id,
    listen_port: req.body.listen_port,
    status: req.body.status,
    ip: req.body.ip,
    updated_at: new Date(),
  });

  await UserSession.updateTime(
    req.body.user_id,
    req.body.machine_id,
    req.body.session_id,
    (err, data) => {
      if (err) {
        response(res, {}, {}, 500, "Some error occurred.");
      }
    }
  );

  await Model.findByUserAndMachinePort(model, (modelError, modelResult) => {
    if (modelError) {
      response(res, {}, {}, 500, "Some error occurred.");
    }

    if (modelResult.length > 0) {
      console.log(
        req.body.traffic_bytes + modelResult[0].traffic_bytes,
        req.body.traffic_bytes,
        modelResult[0].traffic_bytes
      );
      const traffic_bytes =
        req.body.status == 1
          ? 0
          : req.body.traffic_bytes +
            (modelResult[0].traffic_bytes == null
              ? 0
              : modelResult[0].traffic_bytes);

      const updateModel = new Model({
        user_id: req.body.user_id,
        machine_id: req.body.machine_id,
        listen_port: req.body.listen_port,
        status: req.body.status,
        ip: req.body.ip,
        traffic_bytes: traffic_bytes,
        updated_at: new Date(),
        started_at: new Date(),
      });
      Model.update(updateModel, (updateError, updateData) => {
        if (updateError) {
          response(res, {}, {}, 500, "Some error occurred.");
        } else {
          response(res, { data: updateData, result: "OK" });
        }
      });
    } else {
      const traffic_bytes = req.body.status == 1 ? 0 : req.body.traffic_bytes;
      const createModel = new Model({
        user_id: req.body.user_id,
        machine_id: req.body.machine_id,
        listen_port: req.body.listen_port,
        status: req.body.status,
        traffic_bytes: traffic_bytes,
        ip: req.body.ip,
        updated_at: new Date(),
      });
      if (req.body.status == 1) {
        createModel.started_at = new Date();
      }
      Model.create(createModel, (err, data) => {
        if (err) {
          if (err.errno == 1062) {
            response(res, {}, {}, 500, "Some error occurred.");
          } else {
            response(res, {}, {}, 500, "Some error occurred.");
          }
        } else {
          response(res, { data: data, result: "OK" });
        }
      });
    }
  });
};

exports.getAll = (req, res) => {
  const flag = req.body.flag;
  const keyword = req.body.keyword;
  const portName = req.body.portName;
  const listenPort = req.body.listenPort;
  const target = req.body.target;
  const targetPort = req.body.targetPort;

  Model.getAll(
    keyword,
    portName,
    listenPort,
    target,
    targetPort,
    flag,
    (err, data) => {
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
    }
  );
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

exports.findByUserId = (req, res) => {
  if (!req.body) {
    return response(res, {}, {}, 400, "Bad Request.");
  }
  const user_id = req.body.user_id;
  try {
    Model.findByUserId(user_id, (err, data) => {
      if (err) return response(res, {}, {}, 500, "Something went wrong.");
      else {
        response(res, { data: data });
      }
    });
  } catch (err) {
    return response(res, {}, {}, 400, "Something went wrong.");
  }
};

exports.updateStatus = (req, res) => {
  if (!req.body) {
    return response(res, {}, {}, 400, "Bad Request.");
  }

  const id = req.body.id;
  const action = req.body.action;

  if (action == "start") {
    const model = new Model({
      last_launch_at: new Date(),
    });

    Model.updateStatus(id, model, (err, data) => {
      if (err) return response(res, {}, {}, 500, "Something went wrong.");
      else {
        if (data) {
          response(res, {
            status: "1",
          });
        } else {
          return response(res, {}, {}, 500, "Something went wrong.");
        }
      }
    });
  } else {
    response(res, {
      message: "VM is turned off",
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
    user_id: req.body.user_id,
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
        res.send({ success: true, users: data });
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
