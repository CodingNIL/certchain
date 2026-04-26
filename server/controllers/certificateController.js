const Certificate = require("../models/Certificate");
const Block = require("../models/Block");
const { generateHash } = require("../services/hashService");

// 🔼 UPLOAD CERTIFICATE + ADD TO BLOCKCHAIN
const uploadCertificate = async (req, res) => {
  try {
    const { studentName, course } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "File not uploaded" });
    }

    const fileBuffer = req.file.buffer;

    // 🔥 Certificate hash
    const hash = generateHash(fileBuffer);

    // ✅ Save certificate
    const cert = await Certificate.create({
      userId: req.user.id,
      studentName,
      course,
      issueDate: new Date(),
      fileUrl: "temp-storage",
      hash
    });

    // 🔥 BLOCKCHAIN LOGIC STARTS

    // find last block
    const lastBlock = await Block.findOne().sort({ _id: -1 });

    const previousHash = lastBlock ? lastBlock.hash : "GENESIS";

    const blockData = {
      studentName,
      course,
      certHash: hash
    };

    const blockHash = generateHash(
      JSON.stringify(blockData) + previousHash
    );

    // save block
    await Block.create({
      data: blockData,
      hash: blockHash,
      previousHash
    });

    res.json({
      msg: "Certificate uploaded & added to blockchain 🔥",
      certificate: cert,
      blockHash
    });

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

    const hash = generateHash(req.file.buffer);

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
