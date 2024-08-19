const mongoose = require("mongoose");
const express = require("express");
const userRoutes = require("./routes/user");
const companyRoutes = require("./routes/company");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
// To set the
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path);
  next();
});

app.use("/api/user", userRoutes);

app.use("/api/company", companyRoutes);
mongoose
  .connect(process.env.dbURI)
  .then(() => {
    console.log("Successfully Connected to Database!");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT || 5000, () => {
  console.log("Listening on port" + process.env.PORT);
});
