require("dotenv").config();

const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

const connectDB = require("./config/db");
connectDB();

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/cert", require("./routes/certificateRoutes"));

console.log("ENV TEST:", process.env.MONGO_URI);
