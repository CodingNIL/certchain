const Certificate = require("../models/Certificate");
const Block = require("../models/Block");
const { generateHash } = require("../services/hashService");

// 🔼 UPLOAD CERTIFICATE + BLOCKCHAIN
const uploadCertificate = async (req, res) => {
  try {
    const { studentName, course } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "File not uploaded" });
    }

    const hash = generateHash(req.file.buffer);

    // save certificate
    const cert = await Certificate.create({
      userId: req.user.id,
      studentName,
      course,
      issueDate: new Date(),
      fileUrl: "temp-storage",
      hash
    });

    // 🔥 BLOCKCHAIN

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

    await Block.create({
      data: blockData,
      hash: blockHash,
      previousHash
    });

    res.json({
      msg: "Certificate uploaded + block created 🔥",
      certificate: cert,
      blockHash
    });

  } catch (error) {
    res.status(500).json({
      msg: "Error uploading",
      error: error.message
    });
  }
};

// 🔍 VERIFY
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
        msg: "Invalid ❌"
      });
    }

    res.json({
      valid: true,
      msg: "Valid ✅",
      certificate: cert
    });

  } catch (error) {
    res.status(500).json({ msg: "Error verifying" });
  }
};

// 📦 GET BLOCKS
const getBlocks = async (req, res) => {
  try {
    const blocks = await Block.find().sort({ _id: 1 });
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching blocks" });
  }
};

module.exports = {
  uploadCertificate,
  verifyCertificate,
  getBlocks
};
