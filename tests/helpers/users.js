const User = require('../../models/user.js')
const { randomElement } = require('../../library/library.js')

async function seedUsers(users) {
  await User.deleteMany({})
  const newUsers = users.map((user) => new User(user))
  const savedUsers = await Promise.all(newUsers.map((user) => user.save()))
  return savedUsers
}

async function getUsers() {
  const users = await User.find({})
  const result = users.map((user) => user.toJSON())
  return result
}

async function randomUser() {
  const users = await getUsers()
  return randomElement(users)
}

async function getRandomUsername() {
  const user = await randomUser()
  return user.username
}

async function getUser(username) {
  const user = await User.findOne({ username })
  return user
}



module.exports = {
  seedUsers,
  getUsers,
  getRandomUsername,
  getUser,
}
