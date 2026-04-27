const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
  merkleRoot: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  previousHash: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Block", blockSchema);
