const Certificate = require("../models/Certificate");
const Block = require("../models/Block");
const { generateHash } = require("../services/hashService");

// 🔼 UPLOAD + BLOCKCHAIN
const uploadCertificate = async (req, res) => {
  try {
    console.log("UPLOAD HIT");

    const { studentName, course } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "File not uploaded" });
    }

    const hash = generateHash(req.file.buffer);

    // save certificate
    const cert = await Certificate.create({
      userId: req.user?.id,
      studentName,
      course,
      issueDate: new Date(),
      fileUrl: "temp-storage",
      hash
    });

    console.log("CERT SAVED");

    // 🔥 FIND LAST BLOCK
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

    // 🔥 SAVE BLOCK (IMPORTANT FIX)
    const newBlock = await Block.create({
      data: blockData,
      hash: blockHash,
      previousHash
    });

    console.log("BLOCK CREATED:", newBlock);

    res.json({
      msg: "Certificate + Block created 🔥",
      certificate: cert,
      block: newBlock
    });

  } catch (error) {
    console.log("ERROR:", error.message);

    res.status(500).json({
      msg: "Upload failed",
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
    res.status(500).json({ msg: "Verify error" });
  }
};

// 📦 GET BLOCKS
const getBlocks = async (req, res) => {
  try {
    const blocks = await Block.find().sort({ _id: 1 });

    console.log("BLOCKS FETCHED:", blocks.length);

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
