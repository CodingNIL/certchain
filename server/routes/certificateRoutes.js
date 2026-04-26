const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadCertificate } = require("../controllers/certificateController");

// 🔐 Protected + file upload
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadCertificate
);

module.exports = router;
