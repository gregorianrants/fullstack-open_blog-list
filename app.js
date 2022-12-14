const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
require('./db.js')
const middleware = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users.js')
const loginRouter = require('./controllers/login.js')

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
