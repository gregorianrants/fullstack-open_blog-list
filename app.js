const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
require('./db.js')
const middleware = require('./utils/middleware')
// const mongoose = require("mongoose")
// const logger = require("./utils/logger")

// logger.info("attempting to connect to the database....")
// mongoose
//   .connect(config.MONGODB_URI)
//   .then(() => {
//     logger.info("...connected to the db")
//   })
//   .catch(() => {
//     logger.error("...there was an error connecting to the database")
//   })

const blogsRouter = require('./controllers/blogs.js')

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
