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
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadCertificate,
  verifyCertificate
} = require("../controllers/certificateController");

// 🔐 Upload (protected)
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadCertificate
);

// 🔍 Verify (public)
router.post(
  "/verify",
  upload.single("file"),
  verifyCertificate
);

module.exports = router;
