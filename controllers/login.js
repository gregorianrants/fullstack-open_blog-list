const loginRouter = require('express').Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body
  //look up users
  const user = await User.findOne({ username })

  const match = user ? await bcrypt.compare(password, user.password) : false

  if (!match) return res.status(401).json('username or password are invalid')

  //generate json web token

  const userDetails = {
    username,
    id: user._id,
  }
  const token = await jwt.sign(userDetails, process.env.SECRET)

  //send web token to client

  res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
