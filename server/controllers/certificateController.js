const Certificate = require("../models/Certificate");
const Block = require("../models/Block");
const { generateHash } = require("../services/hashService");
const { validateChain } = require("../services/blockchainValidator");
const {
  getMerkleRoot,
  getMerkleProof,
  verifyMerkleProof
} = require("../services/merkleService");
const QRCode = require("qrcode");

// 🔼 UPLOAD
const uploadCertificate = async (req, res) => {
  try {
    const { studentName, course } = req.body;

    if (!req.file) return res.status(400).json({ msg: "File not uploaded" });
    if (!req.user?.id) return res.status(401).json({ msg: "Unauthorized" });

    const hash = generateHash(req.file.buffer);

    const cert = await Certificate.create({
      userId: req.user.id,
      studentName,
      course,
      issueDate: new Date(),
      fileUrl: "temp-storage",
      hash
    });

    const lastBlock = await Block.findOne().sort({ timestamp: -1 });
    const previousHash = lastBlock ? lastBlock.hash : "GENESIS";

    const allCerts = await Certificate.find().select("hash");
    const hashes = allCerts.map(c => c.hash);

    const merkleRoot = getMerkleRoot(hashes);
    const blockHash = generateHash(merkleRoot + previousHash);

    const newBlock = await Block.create({
      merkleRoot,
      hash: blockHash,
      previousHash
    });

    const verifyUrl = `http://localhost:5000/api/cert/verify/${cert._id}`;
    const qrCode = await QRCode.toDataURL(verifyUrl);

    res.json({
      msg: "Certificate + Merkle Block + QR created 🔥",
      certificate: cert,
      block: newBlock,
      qrCode,
      verifyUrl
    });

  } catch (err) {
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
};

// 🔍 VERIFY FILE
const verifyCertificate = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "File not uploaded" });

    const hash = generateHash(req.file.buffer);
    const cert = await Certificate.findOne({ hash });

    if (!cert) return res.json({ valid: false, msg: "Invalid ❌" });

    res.json({ valid: true, msg: "Valid ✅", certificate: cert });

  } catch {
    res.status(500).json({ msg: "Verify error" });
  }
};

// 📱 VERIFY QR
const verifyById = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);

    if (!cert) {
      return res.status(404).json({
        valid: false,
        msg: "Certificate not found ❌"
      });
    }

    res.json({
      valid: true,
      msg: "Certificate is valid ✅",
      certificate: cert
    });

  } catch {
    res.status(500).json({ msg: "Error verifying" });
  }
};

// 📦 BLOCKS
const getBlocks = async (req, res) => {
  const blocks = await Block.find().sort({ timestamp: 1 });
  res.json(blocks);
};

// 🔐 VALIDATE
const validateBlockchain = async (req, res) => {
  const result = await validateChain();
  res.json(result);
};

// 🌳 GENERATE PROOF
const generateProof = async (req, res) => {
  const cert = await Certificate.findById(req.params.id);
  if (!cert) return res.status(404).json({ msg: "Not found" });

  const allCerts = await Certificate.find().select("hash");
  const hashes = allCerts.map(c => c.hash);

  const proof = getMerkleProof(hashes, cert.hash);
  const latestBlock = await Block.findOne().sort({ timestamp: -1 });

  res.json({
    certHash: cert.hash,
    proof,
    merkleRoot: latestBlock.merkleRoot
  });
};

// 🔐 VERIFY PROOF
const verifyProof = async (req, res) => {
  const { certHash, proof, merkleRoot } = req.body;

  const valid = verifyMerkleProof(certHash, proof, merkleRoot);

  res.json({
    valid,
    msg: valid ? "Proof valid ✅" : "Proof invalid ❌"
  });
};

module.exports = {
  uploadCertificate,
  verifyCertificate,
  verifyById,
  getBlocks,
  validateBlockchain,
  generateProof,
  verifyProof
};
