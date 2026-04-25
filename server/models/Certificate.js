const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  studentName: String,
  course: String,
  issueDate: Date,
  fileUrl: String,
  hash: String
});

module.exports = mongoose.model("Certificate", certificateSchema);
