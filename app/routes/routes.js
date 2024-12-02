module.exports = (app) => {
  const authentication = require("../controllers/authentication.controller.js");
  const vmImages = require("../controllers/vmImages.controller.js");
  const user = require("../controllers/users.controller.js");
  const group = require("../controllers/group.controller.js");
  const groupVmImage = require("../controllers/groupVmImage.controller.js");
  const groupPort = require("../controllers/groupPort.controller.js");
  const groupUser = require("../controllers/groupUser.controller.js");
  const vmImageDownload = require("../controllers/vmImageDownload.controller.js");
  const machine = require("../controllers/userMachine.controller.js");
  const admin = require("../controllers/admin.controller.js");
  const adminRole = require("../controllers/adminRole.controller.js");
  const port = require("../controllers/port.controller.js");
  const groupConfig = require("../controllers/groupConfig.controller.js");
  const userSession = require("../controllers/userSession.controller.js");
  const userConnection = require("../controllers/userConnection.controller.js");
  const logs = require("../controllers/log.controller.js");
  const session = require("../controllers/session.controller.js");
  const { authenticateToken } = require("../utils/utils.js");
  var router = require("express").Router();

  // User API ADMIN
  router.post("/user/create", user.create);
  router.post("/user/getAll", user.getAll);
  router.post("/user/findById", user.findById);
  router.post("/user/update", user.update);
  router.post("/user/resetPassword", user.resetPassword);
  router.post("/user/updateUserInfo", user.updateUserInfo);
  router.post("/user/remove", user.remove);

  // Group API ADMIN
  router.post("/group/create", group.create);
  router.post("/group/getAll", group.getAll);
  router.post("/group/findById", group.findById);
  router.post("/group/update", group.update);
  router.post("/group/remove", group.remove);

  // Group User API ADMIN
  router.post("/groupUser/create", groupUser.create);
  router.post("/groupUser/getAll", groupUser.getAll);
  router.post("/groupUser/findById", groupUser.findById);
  router.post("/groupUser/findByUserId", groupUser.findByUserId);
  router.post("/groupUser/batchUpdate", groupUser.batchUpdate);
  router.post("/groupUser/update", groupUser.update);
  router.post("/groupUser/remove", groupUser.remove);

  // VM Images API ADMIN
  router.post("/vmimage/create", vmImages.create);
  router.post("/vmimage/getAll", vmImages.getAll);
  router.post("/vmimage/findById", vmImages.findById);
  router.post("/vmimage/update", vmImages.update);
  router.post("/vmimage/remove", vmImages.remove);

  // Port API ADMIN
  router.post("/port/create", port.create);
  router.post("/port/getAll", port.getAll);
  router.post("/port/findById", port.findById);
  router.post("/port/update", port.update);
  router.post("/port/remove", port.remove);

  // User Machine API
  router.post("/usermachine/create", machine.create);
  router.post("/usermachine/getAll", machine.getAll);
  router.post("/usermachine/findById", machine.findById);
  router.post("/usermachine/update", machine.update);
  router.post("/usermachine/remove", machine.remove);

  // Group Port API
  router.post("/groupPort/create", groupPort.create);
  router.post("/groupPort/getAll", groupPort.getAll);
  router.post("/groupPort/findById", groupPort.findById);
  router.post("/groupPort/findByGroupId", groupPort.findByGroupId);
  router.post("/groupPort/batchUpdate", groupPort.batchUpdate);
  router.post("/groupPort/update", groupPort.update);
  router.post("/groupPort/remove", groupPort.remove);

  // Group VM API
  router.post("/groupvm/create", groupVmImage.create);
  router.post("/groupvm/getAll", groupVmImage.getAll);
  router.post("/groupvm/findById", groupVmImage.findById);
  router.post("/groupvm/findByGroupId", groupVmImage.findByGroupId);
  router.post("/groupvm/update", groupVmImage.update);
  router.post("/groupvm/batchUpdate", groupVmImage.batchUpdate);
  router.post("/groupvm/remove", groupVmImage.remove);

  // Group Config API
  router.post("/groupConfig/create", groupConfig.create);
  router.post("/groupConfig/getAll", groupConfig.getAll);
  router.post("/groupConfig/findById", groupConfig.findById);
  router.post("/groupConfig/findByGroupId", groupConfig.findByGroupId);
  router.post("/groupConfig/update", groupConfig.update);
  router.post("/groupConfig/remove", groupConfig.remove);

  // User Sessions API
  router.post("/userSession/create", userSession.create);
  router.post("/userSession/getAll", userSession.getAll);

  // User Connection API
  router.post("/userConnection/create", userConnection.create);
  router.post("/userConnection/getAll", userConnection.getAll);

  // Admin API
  router.post("/admin/signin", admin.signin);
  router.post("/admin/signup", admin.signup);
  router.post("/admin/create", admin.create);
  router.post("/admin/getAll", admin.getAll);
  router.post("/admin/findById", admin.findById);
  router.post("/admin/update", admin.update);
  router.post("/admin/updatePassword", admin.updatePassword);
  router.post("/admin/remove", admin.remove);

  // Admin Role API
  router.post("/adminRole/findById", adminRole.findById);
  router.post("/adminRole/findRoot", adminRole.findRoot);
  router.post("/adminRole/childRole", adminRole.childRole);
  router.post("/adminRole/addRole", adminRole.addRole);
  router.post("/adminRole/removeRole", adminRole.removeRole);
  router.post("/adminRole/update", adminRole.batchUpdate);

  // Logs API
  router.post("/logs/create", logs.create);
  router.post("/logs/getAll", logs.getAll);
  router.post("/logs/findById", logs.findById);
  router.post("/logs/findByUserId", logs.findByUserId);
  router.post("/logs/getLoginCount", logs.getLoginCount);
  router.post("/logs/update", logs.update);
  router.post("/logs/remove", logs.remove);

  // Session API
  router.post("/session/get", session.getAll);
  router.post("/session/update", session.update);

  // CLIENT
  router.post("/auth/login", authentication.login);
  router.post("/auth/logout", authenticateToken, authentication.logout);
  router.post("/auth/validate", authenticateToken, authentication.validate);
  router.post("/auth/checkOTP", authentication.checkOTP);
  // router.post("/user/config", authenticateToken, groupConfig.findByUserId);
  router.post("/user/config", groupConfig.findByUserId);
  router.post("/user/check_config", groupConfig.checkConfig);
  router.post("/vm-image/download", authenticateToken, vmImages.download);
  router.post("/vm-image/report-action", logs.updateStatus);
  router.post("/network/routing-rules", port.getAll);
  router.post("/network/backend-connect", userConnection.create);

  app.use("/api/", router);
};
