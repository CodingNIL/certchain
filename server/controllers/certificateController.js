const Certificate = require("../models/Certificate");
const { generateHash } = require("../services/hashService");

// 🔼 UPLOAD CERTIFICATE
const uploadCertificate = async (req, res) => {
  try {
    const { studentName, course } = req.body;

    // ✅ prevent crash
    if (!req.file) {
      return res.status(400).json({ msg: "File not uploaded" });
    }

    const fileBuffer = req.file.buffer;

    const hash = generateHash(fileBuffer);

    const cert = await Certificate.create({
      userId: req.user.id, // 🔐 from middleware
      studentName,
      course,
      issueDate: new Date(),
      fileUrl: "temp-storage",
      hash
    });

    res.json(cert);

  } catch (error) {
    res.status(500).json({
      msg: "Error uploading certificate",
      error: error.message
    });
  }
};

// 🔍 VERIFY CERTIFICATE
const verifyCertificate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "File not uploaded" });
    }

    const fileBuffer = req.file.buffer;

    const hash = generateHash(fileBuffer);

    const cert = await Certificate.findOne({ hash });

    if (!cert) {
      return res.json({
        valid: false,
        msg: "Certificate is NOT valid ❌"
      });
    }

    res.json({
      valid: true,
      msg: "Certificate is VALID ✅",
      certificate: cert
    });

  } catch (error) {
    res.status(500).json({
      msg: "Error verifying certificate",
      error: error.message
    });
  }
};

module.exports = {
  uploadCertificate,
  verifyCertificate
};
