const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadCertificate,
  verifyCertificate,
  getBlocks
} = require("../controllers/certificateController");

// upload
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadCertificate
);

// verify
router.post(
  "/verify",
  upload.single("file"),
  verifyCertificate
);

// get blockchain
router.get("/blocks", getBlocks);

module.exports = router;
