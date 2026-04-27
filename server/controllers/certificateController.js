const Certificate = require("../models/Certificate");
const Block = require("../models/Block");
const { generateHash } = require("../services/hashService");
const { validateChain } = require("../services/blockchainValidator");
const QRCode = require("qrcode"); // ✅ NEW

// 🔼 UPLOAD + BLOCKCHAIN + QR
const uploadCertificate = async (req, res) => {
  try {
    console.log("UPLOAD HIT");

    const { studentName, course } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "File not uploaded" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const hash = generateHash(req.file.buffer);

    const cert = await Certificate.create({
      userId: req.user.id,
      studentName,
      course,
      issueDate: new Date(),
      fileUrl: "temp-storage",
      hash
    });

    console.log("CERT SAVED ✔");

    // 🔗 BLOCKCHAIN
    const lastBlock = await Block.findOne().sort({ timestamp: -1 });
    const previousHash = lastBlock ? lastBlock.hash : "GENESIS";

    const blockData = {
      studentName,
      course,
      certHash: hash,
      certId: cert._id
    };

    const blockHash = generateHash(
      JSON.stringify(blockData) + previousHash
    );

    const newBlock = await Block.create({
      data: blockData,
      hash: blockHash,
      previousHash
    });

    console.log("BLOCK SAVED ✔");

    // 📱 QR GENERATION (NEW 🔥)
    const verifyUrl = `http://localhost:5000/api/cert/verify/${cert._id}`;

    const qrCode = await QRCode.toDataURL(verifyUrl);

    console.log("QR GENERATED ✔");

    return res.json({
      msg: "Certificate + Block + QR created 🔥",
      certificate: cert,
      block: newBlock,
      qrCode: qrCode,
      verifyUrl: verifyUrl
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    return res.status(500).json({
      msg: "Upload failed",
      error: error.message
    });
  }
};

// 🔍 VERIFY BY FILE
const verifyCertificate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "File not uploaded" });
    }

    const hash = generateHash(req.file.buffer);

    const cert = await Certificate.findOne({ hash });

    if (!cert) {
      return res.json({ valid: false, msg: "Invalid ❌" });
    }

    return res.json({
      valid: true,
      msg: "Valid ✅",
      certificate: cert
    });

  } catch (error) {
    return res.status(500).json({ msg: "Verify error" });
  }
};

// 📱 VERIFY BY ID (QR USES THIS)
const verifyById = async (req, res) => {
  try {
    const { id } = req.params;

    const cert = await Certificate.findById(id);

    if (!cert) {
      return res.status(404).json({
        valid: false,
        msg: "Certificate not found ❌"
      });
    }

    return res.json({
      valid: true,
      msg: "Certificate is valid ✅",
      certificate: cert
    });

  } catch (error) {
    return res.status(500).json({ msg: "Error verifying certificate" });
  }
};

// 📦 GET BLOCKS
const getBlocks = async (req, res) => {
  try {
    const blocks = await Block.find().sort({ timestamp: 1 });
    return res.json(blocks);
  } catch (error) {
    return res.status(500).json({ msg: "Error fetching blocks" });
  }
};

// 🔐 BLOCKCHAIN VALIDATION
const validateBlockchain = async (req, res) => {
  try {
    const result = await validateChain();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      valid: false,
      message: "Validation failed",
      error: error.message
    });
  }
};

module.exports = {
  uploadCertificate,
  verifyCertificate,
  verifyById, // ✅ NEW
  getBlocks,
  validateBlockchain
};
