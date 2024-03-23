const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const loanRoutes = require("./routes/loan.routes");
const app = express();

app.use(express.json());
app.use(cors())
app.use("/auth", authRoutes);
app.use("/loans", loanRoutes);

mongoose
  .connect(
    "mongodb+srv://pd9505424580:2pOoySPF9yTWac3B@cluster0.uvnlyys.mongodb.net/loanManagementDB"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("MongoDB connection error:", error));
