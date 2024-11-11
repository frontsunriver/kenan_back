const Category = require("../models/category.model.js");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const category = new Category({
    name: req.body.name,
    content: req.body.content,
    flag: req.body.type,
    image: req.body.image,
    reg_date: new Date(),
  });

  Category.create(category, (err, data) => {
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

  Category.findById(id, (err, data) => {
    if (err) {
      res.send({
        success: false,
        message: err.message || "Something went wrong",
      });
    } else {
      Category.addViewCnt(id, (err1, data1) => {});
      if (data) {
        res.send({ success: true, data: data });
      } else {
        res.send({ success: true, message: [] });
      }
    }
  });
};

exports.findAdminById = (req, res) => {
  const id = req.body.id;

  Category.findAdminById(id, (err, data) => {
    if (err) {
      res.send({
        success: false,
        message: err.message || "Something went wrong",
      });
    } else {
      if (data) {
        res.send({ success: true, data: data });
      } else {
        res.send({ success: true, message: [] });
      }
    }
  });
};

exports.getAll = (req, res) => {
  const flag = req.body.flag;
  const id = req.body.id;
  const order = req.body.order;

  Category.getAll(flag, id, order, (err, data) => {
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

exports.getTopCategory = (req, res) => {
  const flag = req.body.flag;

  Category.getTopCategory(flag, (err, data) => {
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

exports.update = (req, res) => {
  const id = req.body.id;

  const category = new Category({
    name: req.body.name,
    content: req.body.content,
    image: req.body.image,
    flag: req.body.type,
  });

  Category.updateById(id, category, (err, data) => {
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

  Category.remove(id, (err, data) => {
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
