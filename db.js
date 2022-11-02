const mongoose = require("mongoose")
const logger = require("./utils/logger")
const config = require("./utils/config.js")

logger.info("attempting to connect to the database....")
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("...connected to the db")
  })
  .catch(() => {
    logger.error("...there was an error connecting to the database")
  })
