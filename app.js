const config = require("./utils/config.js");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.connect(config.MONGODB_URI);

const blogsRouter = require("./controllers/blogs.js");

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);

module.exports = app;
