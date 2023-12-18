const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,  
    serverSelectionTimeoutMS: 30000, // Increase the timeout value
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const authRoutes = require("./routes/auth");
const urlRoutes = require("./routes/url");
const indexRoutes = require("./routes/index");

app.use("", indexRoutes);
app.use("/", authRoutes);
app.use("/url", urlRoutes);

app.use((req, res) => {
  res.status(404).render("404");
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
