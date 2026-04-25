const Certificate = require("../models/Certificate");
const { generateHash } = require("../services/hashService");

exports.uploadCertificate = async (req, res) => {
  const { studentName, course } = req.body;

  const fileBuffer = req.file.buffer;

  // Generate hash from file
  const hash = generateHash(fileBuffer);

  const cert = await Certificate.create({
    studentName,
    course,
    issueDate: new Date(),
    fileUrl: "temp-storage", // IPFS later
    hash
  });

  res.json(cert);
};
