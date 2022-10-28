const router = require("express").Router();
const { error } = require("console");
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuidv4 } = require("uuid");

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
let upload = multer({
  storage,
  limit: { fileSize: 1000000 * 100 },
}).single("myfile");
router.post("/", (req, res) => {
  // Store File
  upload(req, res, async (err) => {
    // Validate request
    if (!req.file) {
      return res.json({ error: "All fileds are required" });
    }
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    // Store into Database
    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
    /*{
    "file": "http://localhost:3000/files/1e7d5665-d7b7-4d34-98de-a261deae026e"
}*/
  });
});
router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  // Validate Request
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "all fields are required" });
  }
  // Get data from database
  const file = await File.findOne({ uuid: uuid });
  if (file.sender) {
    return res.status(422).send({ error: "Email already sent." });
  }
  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await file.save();

  // Send Email
  const sendMail = require('../services/emailService');
  sendMail({
    from:emailFrom,
    to:emailTo,
    subject:'inShare file sharing',
    text: `${emailFrom} shared file with you.`,
    html:require('../services/emailTemplate')({
      emailFrom:emailFrom,
      downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size:parseInt(file.size/1000)+ 'KB',
      expires:'24 hours'
    })
  })
});
module.exports = router;
