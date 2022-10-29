const config = require("./utils/config.js");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");

logger.info("attempting to connect to the database....");
mongoose
  .connect(config.MONGODB_URI)
  .then((result) => {
    logger.info("...connected to the db");
  })
  .catch((err) => {
    logger.error("...there was an error connecting to the database");
  });

const blogsRouter = require("./controllers/blogs.js");

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);

module.exports = app;
