const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadCertificate,
  verifyCertificate,
  getBlocks
} = require("../controllers/certificateController");

// 🔼 upload certificate
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadCertificate
);

// 🔍 verify certificate
router.post(
  "/verify",
  upload.single("file"),
  verifyCertificate
);

// 📦 blockchain
router.get("/blocks", getBlocks);

module.exports = router;
