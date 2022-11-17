const blogsHelpers = require('./helpers/blogs.js')
const usersHelpers = require('./helpers/users.js')
const superTest = require('supertest')
const app = require('../app.js')

const { configureSignInUser } = require('./helpers/login.js')
const api = superTest(app)
const signInUser = configureSignInUser(api)

const { withoutId } = require('../library/library')

describe('with seed data in database', () => {
  beforeEach(async () => {
    await blogsHelpers.seedDB()
    await usersHelpers.seedUsers()
  })

  test('sign in with credentials from seed data returns 200 response code', async () => {
    const user = await usersHelpers.getTestUser()
    const { username, password } = user
    const response = await api
      .post('/api/login')
      .send({ username, password })
      .expect(200)

    const token = response.body.token
  }, 10000)
  //TODO test webtoken contains correct data
  describe('signing in user before operation', () => {
    test('this is a test', async () => {
      const signedInUser = await signInUser(usersHelpers.seedData[0])
      console.log(signedInUser)
      expect(true).toBe(true)
    })

    test('get /api/blogs returns the right number of blogs', async () => {
      console.log(user)
      const blogs = await api.get('/api/blogs').expect(200)

      expect(blogs.body.length).toBe(blogsHelpers.blogs.length)
    }, 10000)
  })
})
