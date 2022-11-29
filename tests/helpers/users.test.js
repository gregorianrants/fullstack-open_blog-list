const blogsHelpers = require('./blogs.js')
const usersHelpers = require('./users.js')
const superTest = require('supertest')
const app = require('../../app.js')
const {
  toIncludeSameMembers,
  toContainEntries,
  toContainAllKeys,
} = require('jest-extended')
expect.extend({ toIncludeSameMembers, toContainEntries, toContainAllKeys })

const { cloneDeep } = require('lodash')

superTest(app)

const { removePath } = require('../../library/library')
const seedData = require('./seedData.js')


describe('with seed data in database', () => {
  beforeEach(async () => {
    await usersHelpers.seedUsers(seedData.users)
    await blogsHelpers.seedDB()
  })

  describe('check db matches seed data', () => {
    test('check db users matches seed users', async () => {
      const seedUsers = [...seedData.users]
      let populatedSeedUsers = seedData.populateUsers(seedUsers)
      let dbUsers = await usersHelpers.getUsers()
      dbUsers = dbUsers.map(removePath('id'))
      dbUsers = dbUsers.map((user) => {
        user = cloneDeep(user)
        user.blogs = user.blogs.map(removePath('id'))
        return user
      })
      dbUsers.forEach((dbUser) => {
        const populatedUser = populatedSeedUsers.find(
          (seedUser) => seedUser.username === dbUser.username
        )
        expect(populatedUser.blogs).toIncludeSameMembers(dbUser.blogs)
      })
      expect(dbUsers.map(removePath('blogs'))).toIncludeSameMembers(
        populatedSeedUsers.map(removePath('blogs'))
      )
    }, 30000)
  })
})
