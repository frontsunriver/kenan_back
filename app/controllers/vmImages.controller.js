const Model = require("../models/vmImages.model.js");
const DownloadModel = require("../models/vmImageDownload.model.js");
const response = require("../utils/response.js");
const fs = require("fs");

exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const fileUrl = req.body.download_url;
  let fileSize = 0;
  await fs.stat(fileUrl, (err, stats) => {
    if (err) {
      console.log(err);
      fileSize = 0;
    }
    fileSize = stats.size;
    const model = new Model({
      title: req.body.title,
      password: req.body.password,
      description: req.body.description,
      download_url: req.body.download_url,
      is_valid: req.body.is_valid,
      size: fileSize,
      created_at: new Date(),
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
    res.send({
      success: false,
      message: "Content can not be empty!",
    });
  }
  const id = req.body.id;
  try {
    Model.findById(id, (err, data) => {
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

exports.findByUserId = (req, res) => {
  if (!req.body) {
    return response(res, {}, {}, 400, "Bad Request.");
  }

  const user_id = req.body.user_id;
  try {
    Model.findByUserId(user_id, (err, data) => {
      if (err) return response(res, {}, {}, 500, "Something went wrong.");
      else {
        return response(res, {
          data: data,
        });
      }
    });
  } catch (err) {
    return response(res, {}, {}, 400, "Something went wrong.");
  }
};

exports.update = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const id = req.body.id;
  const fileUrl = req.body.download_url;
  let fileSize = 0;
  fs.stat(fileUrl, (err, stats) => {
    if (err) {
      fileSize = 0;
    }
    fileSize = stats.size;
    const model = new Model({
      title: req.body.title,
      password: req.body.password,
      description: req.body.description,
      download_url: req.body.download_url,
      size: fileSize,
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

exports.download = (req, res) => {
  if (!req.body) {
    return response(res, {}, {}, 400, "Something went wrong.");
  }
  const id = req.body.id;
  const user_id = req.body.id;
  try {
    Model.findById(id, (err, data) => {
      if (err) return response(res, {}, {}, 400, "Something went wrong.");
      else {
        res.download(data[0].download_url, (err) => {
          if (err) {
            console.error("Error downloading file:", err);
            return response(res, {}, {}, 400, "Something went wrong.");
          } else {
            const model = new DownloadModel({
              user_id: user_id,
              vm_image_id: id,
              downloaded_at: new Date(),
            });
            DownloadModel.create(model, (err1, data1) => {});
            return response(res, { message: "Download successfully" });
          }
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
