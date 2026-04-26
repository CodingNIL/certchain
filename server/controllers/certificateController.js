const Certificate = require("../models/Certificate");
const { generateHash } = require("../services/hashService");

const uploadCertificate = async (req, res) => {
  try {
    const { studentName, course } = req.body;

    // check file
    if (!req.file) {
      return res.status(400).json({ msg: "File is required" });
    }

    const fileBuffer = req.file.buffer;

    // generate hash 🔥
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

module.exports = { uploadCertificate };
