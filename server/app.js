require("dotenv").config();

const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// middleware
app.use(express.json());

// DB connection
const connectDB = require("./config/db");
connectDB();

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cert", require("./routes/certificateRoutes"));

// test route
app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

// start server (ALWAYS LAST)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

console.log("ENV TEST:", process.env.MONGO_URI);

const authMiddleware = require("./middleware/authMiddleware");

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    msg: "Access granted 🔐",
    user: req.user
  });
});
