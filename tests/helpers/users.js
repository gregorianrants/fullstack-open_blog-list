const User = require('../../models/user.js')
const { randomElement } = require('../../library/library.js')

const users = [
  {
    username: 'jimmlad',
    name: 'jim hawkins',
    password: 'piecesofeight',
  },
  {
    username: 'fleece',
    name: 'json argonaught',
    password: 'golden',
  },
]

async function seedUsers() {
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

async function getTestUser() {
  return users[0]
}

module.exports = {
  seedUsers,
  getUsers,
  seedData: users,
  getTestUser,
  getRandomUsername,
}
