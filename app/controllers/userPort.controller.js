const Model = require("../models/userPort.model.js");
const response = require("../utils/response.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const model = new Model({
    user_id: req.body.user_id,
    port_map_id: req.body.port_map_id,
    is_valid: req.body.is_valid,
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

exports.findByUserId = (req, res) => {
  if (!req.body) {
    return response(res, {}, {}, 400, "Bad Request.");
  }

  const id = req.body.user_id;
  try {
    Model.findByUserId(id, (err, data) => {
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

exports.getHttpsRules = (req, res) => {
  if (!req.body) {
    return response(res, {}, {}, 400, "Bad Request.");
  }

  const id = req.body.user_id;
  try {
    Model.getHttpsRules(id, (err, data) => {
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
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving user.",
      });
    } else {
      if (data) {
        res.send({ success: true, users: data });
      } else {
        res.send({ success: false });
      }
    }
  });
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
    port_map_id: req.body.port_map_id,
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
