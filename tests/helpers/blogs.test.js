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

superTest(app)

const { removePath } = require('../../library/library')
const seedData = require('./seedData.js')

describe('with seed data in database', () => {
  beforeEach(async () => {
    await usersHelpers.seedUsers(seedData.users)
    await blogsHelpers.seedDB()
  })

  describe('check db matches seed data', () => {
    test('check blogs for user', async () => {
      async function testUser(userName) {
        const dbUser = await usersHelpers.getUser(userName)
        let fromDb = await blogsHelpers.getUsersBlogs(dbUser._id.toString())
        fromDb = fromDb.map(removePath('id'))
        fromDb = fromDb.map(removePath('user.id'))

        let fromSeed = seedData.populateBlogs(seedData.getUsersBlogs(userName))
        expect(fromDb.length).toEqual(
          seedData.numberOfBlogsWithUsername(userName)
        )

        expect(fromDb).toIncludeSameMembers(fromSeed)
      }
      await testUser(seedData.GANDALF)
      await testUser(seedData.ARAGON)
    })
  }, 10000)

  describe('test blogHelpers', () => {
    test('getRandomBlogForUser', async () => {
      const testUser = seedData.getTestUser()
      const user = await usersHelpers.getUser(testUser.username)
      const blog = await blogsHelpers.getRandomBlogForUser(user)
      expect(blog.user.toString()).toEqual(user._id.toString())
    }, 10000)

    test('getUsersBlogs', async () => {
      const { id: userId } = await usersHelpers.getUser(seedData.GANDALF)
      const blogs = await blogsHelpers.getUsersBlogs(userId)
      const usernames = blogs.map((blog) => blog.user.username)
      expect(usernames).not.toContain(seedData.ARAGON)
      expect(usernames).toContain(seedData.GANDALF)
    }, 10000)

    test('getBlogsNotBelongingTo', async () => {
      const blogs = await blogsHelpers.getBlogsNotBelongingTo(seedData.GANDALF)
      const usernames = blogs.map((blog) => blog.user.username)
      expect(usernames).not.toContainEqual(seedData.GANDALF)
      expect(usernames).toContainEqual(seedData.ARAGON)
    })

    test('toJSON', async () => {
      //quick check not 100% test
      //makes sure returned object has same values but not the same object
      //could result if false positive if function was just clonging the object instead of stringifying then parsing.
      const obj = { name: 'gregor' }
      let json = blogsHelpers.toJSON(obj)
      expect(json).toEqual(obj)
      expect(json).not.toBe(obj)
      const arr = [{ name: 'gregor' }, { name: 'john' }]
      json = blogsHelpers.toJSON(arr)
      expect(json).toEqual(arr)
      expect(json).not.toBe(arr)
    }, 10000)

    test('getBlogIdNotInDb', async () => {
      const blogs = await blogsHelpers.getBlogs()
      const blogsIds = blogs.map((blog) => blog.id)
      const blogIdNotInDb = blogsHelpers.getBlogIdNotInDb()

      blogsIds.forEach((id) => {
        expect(String(id)).toBe(id)
        expect(id.length).toBe(blogIdNotInDb.length)
      })

      expect(blogs.map((blog) => blog.id)).not.toContain(blogIdNotInDb)
    })
  })
})
