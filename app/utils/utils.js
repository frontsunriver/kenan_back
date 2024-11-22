const crypto = require("crypto");
const { JWT_SECRET } = require("../config/constant");
const jwt = require("jsonwebtoken");
const LogModel = require("../models/logs.model");
const { EmailClient } = require("@azure/communication-email");

const connectionString =
  "endpoint=https://kenansmtpotp.unitedstates.communication.azure.com/;accesskey=10L23VGYrs0zHMDXl6iaqZVAGYxA90wJKk98p83ifAWgmicGtrKlJQQJ99AKACULyCpLBOdKAAAAAZCSHqEX";
const client = new EmailClient(connectionString);

exports.hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token)
    return res
      .status(401)
      .send({ message: "invalid user and invalid request" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};

exports.makeLogs = (
  userType,
  user_id,
  user_email,
  object_title,
  action,
  details
) => {
  const model = new LogModel({
    user_type: userType,
    user_id: user_id,
    user_email: user_email,
    object_title: object_title,
    action: action,
    details: details,
    time: new Date(),
  });

  LogModel.create(model, (err, data) => {
    // console.log(err, data);
  });
};

exports.sendMail = async (otp, address) => {
  const emailMessage = {
    senderAddress:
      "DoNotReply@368f71c7-9972-4c9a-8d52-b2c897ebfebe.azurecomm.net",
    content: {
      subject: "Kenan Login",
      plainText: `This is Kenan Login OTP value. ${otp}`,
      html: `
        <html>
          <body>
            <h1>This is Kenan Login OTP value. ${otp}</h1>
          </body>
        </html>`,
    },
    recipients: {
      to: [{ address: address }],
    },
  };

  const poller = await client.beginSend(emailMessage);
  const result = await poller.pollUntilDone();
};

exports.generateRandomOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
