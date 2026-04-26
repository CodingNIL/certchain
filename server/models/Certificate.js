const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  studentName: String,
  course: String,
  issueDate: Date,
  fileUrl: String,
  hash: String
}, { timestamps: true });

module.exports = mongoose.model("Certificate", certificateSchema);
