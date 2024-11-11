module.exports = (app) => {
  const authentication = require("../controllers/authentication.controller.js");
  const vmImages = require("../controllers/vmImages.controller.js");
  const vmImageDownload = require("../controllers/vmImageDownload.controller.js");
  const machine = require("../controllers/userMachine.controller.js");
  const admin = require("../controllers/admin.controller.js");
  const port = require("../controllers/port.controller.js");
  const userPort = require("../controllers/userPort.controller.js");
  const user = require("../controllers/users.controller.js");
  const userConfig = require("../controllers/userConfig.controller.js");
  const userVMImage = require("../controllers/userVmImageController.js");
  const logs = require("../controllers/log.controller.js");
  var router = require("express").Router();

  router.post("/auth/login", authentication.login);
  router.post("/auth/logout", authentication.logout);
  router.post("/auth/validate", authentication.validate);
  router.post("/auth/checkOTP", authentication.checkOTP);

  // User API ADMIN
  router.post("/user/create", user.create);
  router.post("/user/getAll", user.getAll);
  router.post("/user/findById", user.findById);
  router.post("/user/update", user.update);
  router.post("/user/updateUserInfo", user.updateUserInfo);
  router.post("/user/remove", user.remove);

  // CLIENT
  router.post("/user/config", userConfig.findByUserId);

  // VM Images API ADMIN
  router.post("/vmimage/create", vmImages.create);
  router.post("/vmimage/getAll", vmImages.getAll);
  router.post("/vmimage/findById", vmImages.findById);
  router.post("/vmimage/update", vmImages.update);
  router.post("/vmimage/remove", vmImages.remove);

  // CLIENT
  router.post("/vm-image/list", userVMImage.findByUserId);
  router.post("/vm-image/download", vmImageDownload.findById);
  router.post("/vm-image/report-action", userVMImage.updateStatus);

  // Port API ADMIN
  router.post("/port/create", port.create);
  router.post("/port/getAll", port.getAll);
  router.post("/port/findById", port.findById);
  router.post("/port/update", port.update);
  router.post("/port/remove", port.remove);

  // CLIENT
  router.post("/network/user-rules", userPort.findByUserId);
  router.post("/network/https-rules", userPort.getHttpsRules);
  router.post("/network/routing-rules", port.getAll);

  // User Machine API
  router.post("/usermachine/create", machine.create);
  router.post("/usermachine/getAll", machine.getAll);
  router.post("/usermachine/findById", machine.findById);
  router.post("/usermachine/update", machine.update);
  router.post("/usermachine/remove", machine.remove);

  // User Port API
  router.post("/userPort/create", userPort.create);
  router.post("/userPort/getAll", userPort.getAll);
  router.post("/userPort/findById", userPort.findById);
  router.post("/userPort/update", userPort.update);
  router.post("/userPort/remove", userPort.remove);

  // Admin API
  router.post("/admin/signin", admin.signin);
  router.post("/admin/signup", admin.signup);
  router.post("/admin/getAll", admin.getAll);
  router.post("/admin/findById", admin.findById);
  router.post("/admin/update", admin.update);
  router.post("/admin/remove", admin.remove);

  // Logs API
  router.post("/logs/create", logs.create);
  router.post("/logs/getAll", logs.getAll);
  router.post("/logs/findById", logs.findById);
  router.post("/logs/update", logs.update);
  router.post("/logs/remove", logs.remove);

  app.use("/api/", router);
};
