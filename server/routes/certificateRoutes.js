const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadCertificate,
  verifyCertificate,
  verifyById,
  getBlocks,
  validateBlockchain,
  generateProof,
  verifyProof
} = require("../controllers/certificateController");

router.post("/upload", authMiddleware, upload.single("file"), uploadCertificate);
router.post("/verify", upload.single("file"), verifyCertificate);
router.get("/verify/:id", verifyById);
router.get("/blocks", getBlocks);
router.get("/validate-chain", validateBlockchain);

// 🌳 NEW
router.get("/merkle-proof/:id", generateProof);
router.post("/verify-proof", verifyProof);

module.exports = router;
