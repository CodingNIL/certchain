const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadCertificate,
  verifyCertificate,
  verifyById,
  getBlocks,
  validateBlockchain
} = require("../controllers/certificateController");

// 🔼 upload
router.post("/upload", authMiddleware, upload.single("file"), uploadCertificate);

// 🔍 verify via file
router.post("/verify", upload.single("file"), verifyCertificate);

// 📱 verify via QR
router.get("/verify/:id", verifyById);

// 📦 blockchain
router.get("/blocks", getBlocks);

// 🔐 validate chain
router.get("/validate-chain", validateBlockchain);

module.exports = router;
