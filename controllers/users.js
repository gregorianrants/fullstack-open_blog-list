const usersRouter = require('express').Router()
const User = require('../models/user.js')

usersRouter.post('/', async (req, res) => {
  const { username, password, name } = req.body

  const newUser = new User({
    username,
    password,
    name
  })

  const savedUser = await newUser.save()

  res.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs')

  res.status(200).json(users)
})

module.exports = usersRouter
