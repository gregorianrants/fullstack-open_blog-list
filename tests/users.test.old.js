const {
  seedUsers,
  getUsers,
  usersSeedData,
  getRandomUsername,
} = require('./usersHelpers')

const superTest = require('supertest')
const app = require('../app.js')
const { withoutId, removePath } = require('../library/library')

const api = superTest(app)

describe('when there are already some users in the database', () => {
  beforeEach(async () => {
    await seedUsers()
  })
  test('database records matches the seed data', async () => {
    let usersFromDb = await getUsers()
    usersFromDb = usersFromDb.map(withoutId)

    const seedDataWithoutPassword = usersSeedData.map(removePath('password'))

    seedDataWithoutPassword.forEach((user) => {
      expect(usersFromDb).toContainEqual(user)
    })

    usersFromDb.forEach((user) => {
      expect(seedDataWithoutPassword).toContainEqual(user)
    })
  }, 10000)

  describe('when creating user with valid data', () => {
    const createValidUser = () =>
      api.post('/api/users').send({
        username: 'longjohn',
        name: 'john silver',
        password: 'yohoho',
      })

    test('returns 201 status code', async () => {
      await createValidUser()
        .expect(201)
        .expect('Content-Type', /application\/json/)
    }, 10000)

    test('the database has the right number of users afterwards', async () => {
      const usersBefore = await getUsers()
      await createValidUser()
      const usersAfter = await getUsers()
      expect(usersAfter.length).toBe(usersBefore.length + 1)
    }, 10000)
  })

  describe('when creating user with duplicate username', () => {
    test('return 400 status and error message', async () => {
      const username = await getRandomUsername()
      const result = await api
        .post('/api/users')
        .send({
          username: username,
          name: 'anything',
          password: 'anything',
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toBe(
        'User validation failed: username: username must be unique'
      )
    })

    test('same number of users in database afterwards', async () => {
      const usersBefore = await getUsers()
      const username = await getRandomUsername()
      await api.post('/api/users').send({
        username: username,
        name: 'anything',
        password: 'anything',
      })
      const usersAfter = await getUsers()
      expect(usersAfter.length).toBe(usersBefore.length)
    }, 10000)
  })

  describe('when creating a user with invalid username', () => {
    test('return 400 status and error message', async () => {
      const result = await api
        .post('/api/users')
        .send({
          username: 'oh',
          name: 'anything',
          password: 'anything',
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toBe(
        'User validation failed: username: username must be longer than 3 characters'
      )
    })

    test('same number of users in database afterwards', async () => {
      const usersBefore = await getUsers()
      await api
        .post('/api/users')
        .send({
          username: 'oh',
          name: 'anything',
          password: 'anything',
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAfter = await getUsers()
      expect(usersAfter.length).toBe(usersBefore.length)
    }, 10000)
  })

  describe('when creating a user with invalid password', () => {
    test('return 400 status and error message', async () => {
      const result = await api
        .post('/api/users')
        .send({
          username: 'averyuniqueusername',
          name: 'anything',
          password: 'ah',
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toBe(
        'User validation failed: password: password must be longer than 3 characters'
      )
    })

    test('same number of users in database afterwards', async () => {
      const usersBefore = await getUsers()
      await api
        .post('/api/users')
        .send({
          username: 'averyuniqueusername',
          name: 'anything',
          password: 'ah',
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAfter = await getUsers()
      expect(usersAfter.length).toBe(usersBefore.length)
    }, 10000)
  })
})
