const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const route = require("./app/routes/routes.js");
const multer = require("multer");
const https = require("https");
const fs = require("fs");
const app = express();
// const multerS3 = require("multer-s3");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const db = require("./app/models/db.js");
// const { Server } = require("socket.io");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors("*"));

app.use(express.json());

// const s3Client = new S3Client({
//   region: S3_REGION,
//   credentials: {
//     accessKeyId: ACCESS_KEY,
//     secretAccessKey: SECRET_ACCESS_KEY,
//   },
// });

// Configure multer to use S3
// const storage = multerS3({
//   s3: s3Client,
//   bucket: BUCKET_NAME,
//   acl: "public-read",
//   key: function (req, file, cb) {
//     cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`);
//   },
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public"));
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`);
  },
});

const imageUpload = multer({ storage: storage });

// app.post(
//   "/api/user/updateCreatorProfile",
//   imageUpload.array("attach"),
//   (req, res) => {
//     let fileName = "";
//     if (req.files.length > 0) {
//       fileName = req.files[0].location;
//     } else {
//       fileName = req.body.attach;
//     }
//     req.body.attach = fileName;
//     user.updateCreatorProfile(req, res);
//   }
// );

// app.post(
//   "/api/user/addGalleries",
//   imageUpload.array("galleryFiles"),
//   (req, res) => {
//     let fileList = [];
//     let gallery = "";

//     // Handle uploaded files
//     if (req.files.length > 0) {
//       req.files.map((file) => {
//         fileList.push(file.location);
//       });
//     }

//     // Handle original files
//     if (req.body.originalFiles) {
//       // Convert the comma-separated string back to an array if needed
//       const originalFilesArray = req.body.originalFiles.split(",");
//       gallery = originalFilesArray.concat(fileList).join(",");
//     } else {
//       gallery = fileList.join(",");
//     }

//     req.body.gallery = gallery; // Add gallery to req.body
//     user.addGalleries(req, res);
//   }
// );

// app.post(
//   "/api/user/updateMemberProfile",
//   imageUpload.array("attach"),
//   (req, res) => {
//     let fileName = "";
//     if (req.files.length > 0) {
//       fileName = req.files[0].location;
//     } else {
//       fileName = req.body.attach;
//     }
//     req.body.attach = fileName;
//     user.updateMemberProfile(req, res);
//   }
// );

// app.post("/api/category/create", imageUpload.array("image"), (req, res) => {
//   let fileName = "";
//   if (req.files.length > 0) {
//     fileName = req.files[0].location;
//   } else {
//     fileName = req.body.image;
//   }
//   req.body.image = fileName;
//   category.create(req, res);
// });

// app.post("/api/category/update", imageUpload.array("image"), (req, res) => {
//   let fileName = "";
//   if (req.files.length > 0) {
//     fileName = req.files[0].location;
//   } else {
//     fileName = req.body.image;
//   }
//   req.body.image = fileName;
//   category.update(req, res);
// });

// app.post(
//   "/api/stream/create",
//   imageUpload.fields([
//     { name: "attach", maxCount: 1 },
//     { name: "medias", maxCount: 10 },
//   ]),
//   (req, res) => {
//     let fileName = "";
//     if (req.files.attach && req.files.attach.length > 0) {
//       fileName = req.files.attach[0].location;
//     }
//     let medias = [];
//     if (req.files.medias && req.files.medias.length > 0) {
//       medias = req.files.medias.map((file) => file.location);
//     }

//     req.body.banner = fileName;
//     req.body.gallery = medias.join(",");
//     stream.create(req, res);
//   }
// );

// app.post(
//   "/api/event/create",
//   imageUpload.fields([{ name: "attach", maxCount: 1 }]),
//   (req, res) => {
//     let fileName = "";
//     if (req.files.attach && req.files.attach.length > 0) {
//       fileName = req.files.attach[0].location;
//     }
//     req.body.banner = fileName;
//     event.create(req, res);
//   }
// );

// app.post(
//   "/api/post/create",
//   imageUpload.fields([{ name: "attach", maxCount: 1 }]),
//   (req, res) => {
//     let fileName = "";
//     if (req.files.attach && req.files.attach.length > 0) {
//       fileName = req.files.attach[0].location;
//     }
//     req.body.banner = fileName;
//     post.create(req, res);
//   }
// );

// app.post("/api/getLiveStreamToken", (req, res) => {
//   const userId = req.body.userId;
//   secret = LIVE_SECRET;
//   let token = jwt.sign({ user_id: userId }, secret, {
//     algorithm: "HS256",
//     expiresIn: "1h", // Set the expiration time as needed
//   });
//   res.send({ token: token, userId: userId });
// });

const options = {
  key: fs.readFileSync('/etc/nginx/ssl/kenan-web-api.key'), // Update with your key file path
  cert: fs.readFileSync('/etc/nginx/ssl/kenan-web-api.crt') // Update with your cert file path
};
app.get("/", (req, res, next)=> {
  res.send("Server is running");
});

route(app);


// app.use("/", (req, res, next) =>
//   // in deployment we send index.html for all additional paths not defined by our express routes
//   // react router pushes different paths to window url
//   res.sendFile(path.join(__dirname, "public", "index.html"))
// );

// set port, listen for requests

// const PORT = process.env.PORT || 8000;
// const server = app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

const PORT = process.env.PORT || 443;
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
