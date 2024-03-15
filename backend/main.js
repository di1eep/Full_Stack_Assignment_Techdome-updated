const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://pd9505424580:2pOoySPF9yTWac3B@cluster0.uvnlyys.mongodb.net/loanApp",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
const customerRouter = require("./routes/customerRoutes");
const lenderRouter = require("./routes/lenderRoutes");

app.use("/api/customer", customerRouter);
app.use("/api/lender", lenderRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
