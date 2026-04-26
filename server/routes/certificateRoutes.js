const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadCertificate,
  verifyCertificate,
  getBlocks,
  validateBlockchain
} = require("../controllers/certificateController");

// upload
router.post("/upload", authMiddleware, upload.single("file"), uploadCertificate);

// verify
router.post("/verify", upload.single("file"), verifyCertificate);

// blocks
router.get("/blocks", getBlocks);

// 🔥 blockchain validation engine
router.get("/validate-chain", validateBlockchain);

module.exports = router;
