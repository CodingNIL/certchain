const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadCertificate } = require("../controllers/certificateController");

router.post("/upload", upload.single("file"), uploadCertificate);

module.exports = router;
