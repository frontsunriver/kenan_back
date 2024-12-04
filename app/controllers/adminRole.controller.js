const Model = require("../models/adminRole.model.js");
const response = require("../utils/response.js");

exports.addRole = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const model = new Model({
    user_id: req.body.user_id,
    role_id: req.body.role_id,
    checked: req.body.checked,
    partialChecked: req.body.partialChecked,
  });

  Model.create(model, (err, data) => {
    if (err) {
      if (err.errno == 1062) {
        res.send({
          success: false,
          message: "User can't have same Role",
        });
      } else {
        res.send({
          success: false,
          message:
            err.message || "Some error occurred while creating the Tutorial.",
        });
      }
    } else res.send({ success: true, data: data });
  });
};

exports.findRoot = (req, res) => {
  try {
    Model.findRoot((err, data) => {
      if (err)
        return res.send({
          success: false,
          message: "Some error occurred.",
        });
      else {
        return res.send({
          success: true,
          data: data,
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

exports.childRole = (req, res) => {
  if (!req.body) {
    return res.send({
      success: false,
      message: "Bad request",
    });
  }
  const id = req.body.id;
  const parent = req.body.parent;
  try {
    Model.findByParentId(id, parent, (err, data) => {
      if (err)
        return res.send({ success: false, message: "Something went wrong." });
      else {
        res.send({ success: true, data: data });
      }
    });
  } catch (err) {
    res.send({
      success: false,
      message: "Wrong Parameter!",
    });
  }
};

exports.getList = (req, res) => {
  try {
    Model.getList((err, data) => {
      if (err) return response(res, {}, {}, 500, "Something went wrong.");
      else {
        return response(res, {
          data: data,
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
    return res.send({
      success: false,
      message: "Bad Request",
    });
  }
  const user_id = req.body.user_id;
  try {
    Model.findByUserId(user_id, (err, data) => {
      if (err)
        return res.send({ success: false, message: "Something went wrong" });
      else {
        return res.send({
          success: true,
          data: data,
        });
      }
    });
  } catch (err) {
    return res.send({ success: false, message: "Something went wrong" });
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
    role_id: req.body.role_id,
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

exports.removeRole = (req, res) => {
  const id = req.body.id;
  const role_id = req.body.role_id;
  Model.remove(id, role_id, (err, data) => {
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

exports.selectAll = (req, res) => {
  const id = req.body.id;
  Model.findAllRoles((err, data) => {
    if (err)
      res.send({
        success: false,
        message: err.message || "Something went wrong",
      });
    else {
      Model.batchUpdate(id, data, (allRoleError, allRole) => {
        if (allRoleError)
          res.send({
            success: false,
            message: allRoleError.message || "Something went wrong",
          });
        else {
          res.send({ success: true, data: allRole });
        }
      });
    }
  });
};

exports.deselectAll = (req, res) => {
  const id = req.body.id;
  Model.removeAll(id, (err, data) => {
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
