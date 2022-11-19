const blogsHelpers = require('./helpers/blogs.js')
const usersHelpers = require('./helpers/users.js')
const superTest = require('supertest')
const app = require('../app.js')
const { toIncludeSameMembers } = require('jest-extended')
expect.extend({ toIncludeSameMembers })

const { configureSignInUser } = require('./helpers/login.js')
const api = superTest(app)
const signInUser = configureSignInUser(api)

const { removePath } = require('../library/library')
const seedData = require('./helpers/seedData.js')

describe('test seed data helpers', () => {
  test('correct blogs returned for user', () => {
    const result = seedData.getUsersBlogs('fleece')
    expect(result).toEqual([
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
      },
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
      },
    ])
  })
})

describe('check jest-extended matcher to make sure i understand how it works', () => {
  test('toIncludeSameMembers', () => {
    expect([{ foo: 'bar' }, { baz: 'qux' }]).toIncludeSameMembers([
      { foo: 'bar' },
      { baz: 'qux' },
    ])
    expect([{ foo: 'bar' }, { baz: 'qux' }]).not.toIncludeSameMembers([
      { foo: 'bar' },
    ])
  })
})

describe('with seed data in database', () => {
  beforeEach(async () => {
    await usersHelpers.seedUsers(seedData.users)
    await blogsHelpers.seedDB()
  })

  describe('check db matches seed data', () => {
    test('check blogs for user', async () => {
      async function testUser(user) {
        let fromDb = await blogsHelpers.getUsersBlogs(user)
        fromDb = fromDb.map(removePath('id'))
        fromDb = fromDb.map(removePath('user'))
        let fromSeed = seedData.getUsersBlogs(user)
        // expect(fromDb).toEqual(expect.arrayContaining(fromSeed))
        // expect(fromSeed).toEqual(expect.arrayContaining(fromDb))
        expect(fromDb).toIncludeSameMembers(fromSeed)
      }
      await testUser('fleece')
      await testUser('jimmlad')
    })
  }, 10000)

  test('sign in with credentials from seed data returns 200 response code', async () => {
    const testUser = seedData.getTestUser()
    const { username, password } = testUser
    await api.post('/api/login').send({ username, password }).expect(200)
  }, 10000)
  //TODO test webtoken contains correct data

  function getBlogs(signedInUser) {
    const promise = api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${signedInUser.token}` })

    return promise
  }

  test('get /api/blogs for valid user returns 200 status code', async () => {
    const testUser = seedData.getTestUser()
    const signedInUser = await signInUser(testUser)
    await getBlogs(signedInUser).expect(200)
  }, 10000)

  test('get /api/blogs for unauthorised user returns 401 status code', async () => {
    const testUser = seedData.unauthourisedUser
    const signedInUser = await signInUser(testUser)
    await getBlogs(signedInUser).expect(401)
  }, 10000)

  test('get /api/blogs returns the right number of blogs for user', async () => {
    const testUser = seedData.getTestUser()
    const signedInUser = await signInUser(testUser)
    const blogs = await getBlogs(signedInUser)
    expect(blogs.body.length).toBe(
      seedData.getUsersBlogs(testUser.username).length
    )
  }, 10000)

  test('blogs have an idea property', async () => {
    const testUser = seedData.getTestUser()
    const signedInUser = await signInUser(testUser)
    const blogs =  await getBlogs(signedInUser)
    blogs.body.forEach((blog) => {
      const id = blog?.id
      expect(id).toBeDefined()
    })
  }, 10000)

  test('get /api/blogs returns the correct blogs for user', async () => {
    const testUser = seedData.getTestUser()
    const signedInUser = await signInUser(testUser)
    const blogs =  await getBlogs(signedInUser)
    //we remove user path becuase toIncludeSameMember - compares nested objects by ref (I think)
    const recieved = blogs.body.map(removePath('user'))
    let expected = await blogsHelpers.getUsersBlogs(testUser.username)
    expected = expected.map(removePath('user'))
    expect(expected).toIncludeSameMembers(recieved)
  }, 10000)
})
