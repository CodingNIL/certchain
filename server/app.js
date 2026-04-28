require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// DATABASE
connectDB();

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173"
  ],
  credentials: true
}));

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cert", require("./routes/certificateRoutes"));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("CertChain Backend Running 🚀");
});

// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
