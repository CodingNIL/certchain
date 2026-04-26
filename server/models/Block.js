const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
  data: Object,
  hash: String,
  previousHash: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Block", blockSchema);
