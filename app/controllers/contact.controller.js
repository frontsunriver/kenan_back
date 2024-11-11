const Model = require("../models/contact.model.js");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const model = new Model({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    content: req.body.content
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

exports.findById = (req, res) => {
  const id = req.body.id;

  Model.findById(id, (err, data) => {
    if (err)
      res.send({
        success: false,
        message: err.message || "Something went wrong",
      });
    else {
      if (data) {
        res.send({ success: true, data: data });
      } else {
        res.send({ success: true, message: {} });
      }
    }
  });
};

exports.remove = (req, res) => {
  const id = req.body.user_id;

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
