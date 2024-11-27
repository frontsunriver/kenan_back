const { PRODUCT_MODE } = require("./constant");

// module.exports = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "",
//   DB: "kenan_db"
// };

module.exports = {
  HOST: PRODUCT_MODE == 1 ? "localhost" : "localhost",
  USER: PRODUCT_MODE == 1 ? "kenandatabase" : "root",
  PASSWORD: PRODUCT_MODE == 1 ? "Kenan@12345" : "",
  DB: "kenan_db",
};
