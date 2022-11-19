const blogsHelpers = require('./helpers/blogs.js')
const usersHelpers = require('./helpers/users.js')
const superTest = require('supertest')
const app = require('../app.js')
const { toIncludeSameMembers, toContainEntries } = require('jest-extended')
expect.extend({ toIncludeSameMembers, toContainEntries })

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

  test('blogs have an id property', async () => {
    const testUser = seedData.getTestUser()
    const signedInUser = await signInUser(testUser)
    const blogs = await getBlogs(signedInUser)
    blogs.body.forEach((blog) => {
      const id = blog?.id
      expect(id).toBeDefined()
    })
  }, 10000)

  test('get /api/blogs returns the correct blogs for user', async () => {
    const testUser = seedData.getTestUser()
    const signedInUser = await signInUser(testUser)
    const blogs = await getBlogs(signedInUser)
    //we remove user path becuase toIncludeSameMember - compares nested objects by ref (I think)
    const recieved = blogs.body.map(removePath('user'))
    let expected = await blogsHelpers.getUsersBlogs(testUser.username)
    expected = expected.map(removePath('user'))
    expect(expected).toIncludeSameMembers(recieved)
  }, 10000)

  describe('when creating a new blog post', () => {
    function createBlog(signedInUser, blog) {
      return api
        .post('/api/blogs')
        .set({ Authorization: `Bearer ${signedInUser.token}` })
        .send(blog)
    }

    test('response has 201 status code and correct content-type header', async () => {
      const testUser = seedData.getTestUser()
      const signedInUser = await signInUser(testUser)
      await createBlog(signedInUser, seedData.newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    }, 10000)

    test('there are the correct number of blogs in db afterwards', async () => {
      const testUser = seedData.getTestUser()
      const signedInUser = await signInUser(testUser)
      await createBlog(signedInUser, seedData.newBlog)

      const blogs = await blogsHelpers.getBlogs()

      expect(blogs.length).toEqual(seedData.blogs.length + 1)
    }, 10000)

    test('the created blog has the expected properties and values', async () => {
      const testUser = seedData.getTestUser()
      const signedInUser = await signInUser(testUser)
      const response = await createBlog(signedInUser, seedData.newBlog)
      const createdBlog = response.body
      const dbBlog = await blogsHelpers.getBlogWithId(createdBlog.id)

      expect(dbBlog).toContainEntries(Object.entries(seedData.newBlog))
    }, 10000)

    test('likes defaults to 0', async () => {
      let newBlog = { ...seedData.newBlog }
      delete newBlog.likes
      console.log(newBlog)
      const testUser = seedData.getTestUser()
      const signedInUser = await signInUser(testUser)
      const response = await createBlog(signedInUser, newBlog)
      const createdBlog = response.body
      const dbBlog = await blogsHelpers.getBlogWithId(createdBlog.id)
      expect(createdBlog.likes).toBe(0)
      expect(dbBlog.likes).toBe(0)
    }, 10000)

    test('returns status 400 if title not defined', async () => {
      const testUser = seedData.getTestUser()
      const signedInUser = await signInUser(testUser)

      const newBlog = { ...seedData.newBlog }
      const noTitle = removePath('title')(newBlog)
      console.log(noTitle)

      await createBlog(signedInUser, noTitle).expect(400)

      const noUrl = removePath('url')(newBlog)
      console.log(noUrl)
      await createBlog(signedInUser, noUrl).expect(400)
    }, 10000)
  })

  describe('when deleting a blog', () => {
    function deleteBlog(signedInUser, blogId) {
      return api
        .delete(`/api/blogs/${blogId}`)
        .set({ Authorization: `Bearer ${signedInUser.token}` })
    }
    test('get 204 status code', async () => {
      const testUser = seedData.getTestUser()
      const signedInUser = await signInUser(testUser)

      const blogs = await blogsHelpers.getUsersBlogs(testUser.username)
      const blogToDelete = blogs[0]
      console.log(blogToDelete)

      await deleteBlog(signedInUser, blogToDelete.id).expect(204)
    }, 10000)
  })
})
