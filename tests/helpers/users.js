const User = require('../../models/user.js')
const { randomElement } = require('../../library/library.js')

function toJSON(docOrArray) {
  function toJSON(doc) {
    return JSON.parse(JSON.stringify(doc))
  }
  if (Array.isArray(docOrArray)) {
    return docOrArray.map(toJSON)
  }
  return toJSON(docOrArray)
}

async function seedUsers(users) {
  await User.Model.deleteMany({})
  const newUsers = users.map((user) => new User.Model(user))
  const savedUsers = await Promise.all(newUsers.map((user) => user.save()))
  return savedUsers
}

async function getUsers() {
  let users = await User.list()
  users = toJSON(users)
  return users
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
  const user = await User.Model.findOne({ username })
  return user
}

module.exports = {
  seedUsers,
  getUsers,
  getRandomUsername,
  getUser,
}
