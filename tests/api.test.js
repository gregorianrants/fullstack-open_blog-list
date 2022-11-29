const blogsHelpers = require('./helpers/blogs.js')
const usersHelpers = require('./helpers/users.js')
const superTest = require('supertest')
const app = require('../app.js')
const {
  toIncludeSameMembers,
  toContainEntries,
  toContainAllKeys,
} = require('jest-extended')
expect.extend({ toIncludeSameMembers, toContainEntries, toContainAllKeys })
const mongoose = require('mongoose')

const { configureSignInUser } = require('./helpers/login.js')
const api = superTest(app)
const signInUser = configureSignInUser(api)

const { removePath } = require('../library/library')
const seedData = require('./helpers/seedData.js')

//todo check you have adequate tests for content type and status codes
//TODO test for invalid id
describe('with seed data in database', () => {
  beforeEach(async () => {
    await usersHelpers.seedUsers(seedData.users)
    await blogsHelpers.seedDB()
  })

  describe('test login endpoint', () => {
    test('sign in with credentials from seed data returns 200 response code', async () => {
      const testUser = seedData.getTestUser()
      const { username, password } = testUser
      await api.post('/api/login').send({ username, password }).expect(200)
    }, 10000)

    //TODO test webtoken contains correct data
  })

  describe('test users endpoint', () => {
    describe('when creating user with valid data', () => {
      const createValidUser = () =>
        api.post('/api/users').send({
          username: 'longjohn',
          name: 'john silver',
          password: 'yohoho',
        })

      test('returns 201 status code and correct content type header', async () => {
        await createValidUser()
          .expect(201)
          .expect('Content-Type', /application\/json/)
      }, 10000)

      test('the database has the right number of users afterwards', async () => {
        const usersBefore = await usersHelpers.getUsers()
        await createValidUser()
        const usersAfter = await usersHelpers.getUsers()
        expect(usersAfter.length).toBe(usersBefore.length + 1)
      }, 10000)
    })

    describe('when creating user with duplicate username', () => {
      test('return 400 status, correct content header and error message', async () => {
        const username = await usersHelpers.getRandomUsername()
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
        const usersBefore = await usersHelpers.getUsers()
        const username = await usersHelpers.getRandomUsername()
        await api.post('/api/users').send({
          username: username,
          name: 'anything',
          password: 'anything',
        })
        const usersAfter = await usersHelpers.getUsers()
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
        const usersBefore = await usersHelpers.getUsers()
        await api
          .post('/api/users')
          .send({
            username: 'oh',
            name: 'anything',
            password: 'anything',
          })
          .expect(400)
          .expect('Content-Type', /application\/json/)
        const usersAfter = await usersHelpers.getUsers()
        expect(usersAfter.length).toBe(usersBefore.length)
      }, 10000)
    })

    describe('when creating a user with invalid password', () => {
      test('return 400 status, content header and error message', async () => {
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
        const usersBefore = await usersHelpers.getUsers()
        await api
          .post('/api/users')
          .send({
            username: 'averyuniqueusername',
            name: 'anything',
            password: 'ah',
          })
          .expect(400)
          .expect('Content-Type', /application\/json/)
        const usersAfter = await usersHelpers.getUsers()
        expect(usersAfter.length).toBe(usersBefore.length)
      }, 10000)
    })

    describe('get users', () => {
      test('returns correct status code', async () => {
        await api
          .get('/api/users')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      }, 10000)

      test('same number of users in api response and seed data', async () => {
        const response = await api
          .get('/api/users')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const recieved = response.body

        expect(recieved.length).toEqual(seedData.users.length)
      }, 10000)

      test('fetched users data is same as data in db', async () => {
        const response = await api
          .get('/api/users')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const recieved = response.body
        const fromDb = await usersHelpers.getUsers()
        expect(recieved).toIncludeSameMembers(fromDb)
      }, 10000)
    })
  })

  describe('test blogs endpoint', () => {
    describe('get blogs', () => {
      function getBlogs(signedInUser) {
        const promise = api
          .get('/api/blogs')
          .set({ Authorization: `Bearer ${signedInUser.token}` })

        return promise
      }

      test('get /api/blogs for valid user returns 200 status code and content type', async () => {
        const testUser = seedData.getTestUser()
        const signedInUser = await signInUser(testUser)
        await getBlogs(signedInUser)
          .expect(200)
          .expect('Content-Type', /application\/json/)
      }, 10000)

      test('get /api/blogs for unauthorised user returns 401 status code', async () => {
        api
          .get('/api/blogs')
          .set({ Authorization: 'Bearer invalidnonsense' })
          .expect(401)
      }, 10000)

      test('get /api/blogs returns the right number of blogs', async () => {
        const testUser = seedData.getTestUser()
        const signedInUser = await signInUser(testUser)
        const blogs = await getBlogs(signedInUser)
        expect(blogs.body.length).toBe(seedData.blogs.length)
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
        const recieved = blogs.body
        let expected = await blogsHelpers.getBlogs()
        expect(recieved).toIncludeSameMembers(expected)
      }, 10000)

      test('populated user has the right fields', async () => {
        const testUser = seedData.getTestUser()
        const signedInUser = await signInUser(testUser)
        const blogs = await getBlogs(signedInUser)

        const recieved = blogs.body

        expect(recieved[0].user).toContainAllKeys(['username', 'name', 'id'])
      })
    })

    describe('when creating a new blog post', () => {
      function createBlog(signedInUser, blog) {
        return api
          .post('/api/blogs')
          .set({ Authorization: `Bearer ${signedInUser.token}` })
          .send(blog)
      }

      test('blog fails with the proper status code 401 Unauthorized if a token is not provided.', () => {
        return api.post('/api/blogs').send(seedData.newBlog).expect(401)
      })

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

        let expected = { ...seedData.newBlog }
        expected.user = signedInUser.id
        expected.user = signedInUser.id

        const dbBlog = await blogsHelpers.getBlogWithId(createdBlog.id)
        console.log('seedBlog', seedData.newBlog)
        console.log('dbBlog', dbBlog)

        expect(dbBlog).toContainEntries(Object.entries(expected))
      }, 10000)

      test('the response has a blog with correct properties and values in its body', async () => {
        const testUser = seedData.getTestUser()
        const signedInUser = await signInUser(testUser)
        const response = await createBlog(signedInUser, seedData.newBlog)
        const createdBlog = response.body

        let expected = { ...seedData.newBlog }
        expected.user = signedInUser.id
        expected.user = signedInUser.id

        expect(createdBlog).toContainEntries(Object.entries(expected))
        expect(mongoose.isValidObjectId(createdBlog.id)).toBe(true)
      }, 10000)

      test('likes defaults to 0', async () => {
        let newBlog = { ...seedData.newBlog }
        delete newBlog.likes

        const testUser = seedData.getTestUser()
        const signedInUser = await signInUser(testUser)
        const response = await createBlog(signedInUser, newBlog)
        const createdBlog = response.body
        const dbBlog = await blogsHelpers.getBlogWithId(createdBlog.id)
        expect(createdBlog.likes).toBe(0)
        expect(dbBlog.likes).toBe(0)
      }, 10000)

      test('returns status 400 if title or url not defined', async () => {
        const testUser = seedData.getTestUser()
        const signedInUser = await signInUser(testUser)

        const newBlog = { ...seedData.newBlog }
        const noTitle = removePath('title')(newBlog)

        await createBlog(signedInUser, noTitle).expect(400)

        const noUrl = removePath('url')(newBlog)

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
        const { id: userId } = await usersHelpers.getUser(testUser.username)
        const blogs = await blogsHelpers.getUsersBlogs(userId)
        const blogToDelete = { ...blogs[0] }

        await deleteBlog(signedInUser, blogToDelete.id).expect(204)
      }, 10000)

      test('blog is no longer in db after deletion', async () => {
        const testUser = seedData.getTestUser()
        const signedInUser = await signInUser(testUser)
        const { id: userId } = await usersHelpers.getUser(testUser.username)
        const blogs = await blogsHelpers.getUsersBlogs(userId)
        const blogToDelete = { ...blogs[0] }

        await deleteBlog(signedInUser, blogToDelete.id).expect(204)

        expect(await blogsHelpers.blogWithSameIdExists(blogToDelete.id)).toBe(
          false
        )
      }, 10000)

      test('there are one less blogs after a deletion', async () => {
        const testUser = seedData.getTestUser()

        const signedInUser = await signInUser(testUser)
        const { id: userId } = await usersHelpers.getUser(testUser.username)
        const blogsBefore = await blogsHelpers.getUsersBlogs(userId)
        const blogToDelete = { ...blogsBefore[0] }
        await deleteBlog(signedInUser, blogToDelete.id).expect(204)
        const blogsAfter = await blogsHelpers.getUsersBlogs(userId)
        expect(blogsAfter.length).toBe(blogsBefore.length - 1)
      }, 10000)

      test('get 204 status code when deleteing a nonexistant blog', async () => {
        const testUser = seedData.getTestUser()
        const signedInUser = await signInUser(testUser)
        const blogId = blogsHelpers.getBlogIdNotInDb()

        await deleteBlog(signedInUser, blogId).expect(204)
      })

      test('atempt to delete another users blog returns 401 unauthorised', async () => {
        const testUser = seedData.getTestUser()
        const signedInUser = await signInUser(testUser)
        const otherUser = seedData.getUserOtherThanTest()
        const { id: userId } = await usersHelpers.getUser(otherUser.username)
        const blogs = await blogsHelpers.getUsersBlogs(userId)
        const blogToDelete = { ...blogs[0] }

        await deleteBlog(signedInUser, blogToDelete.id).expect(401)
      }, 10000)

      test('same number of blogs in db after attempting to delete another users blog', async () => {
        const testUser = seedData.getTestUser()
        const signedInUser = await signInUser(testUser)
        const otherUser = seedData.getUserOtherThanTest()
        const blogsBefore = await blogsHelpers.getBlogs()
        const { id: userId } = await usersHelpers.getUser(otherUser.username)
        const blogs = await blogsHelpers.getUsersBlogs(userId)
        const blogToDelete = { ...blogs[0] }

        await deleteBlog(signedInUser, blogToDelete.id).expect(401)

        const blogsAfter = await blogsHelpers.getBlogs()

        expect(blogsAfter).toEqual(blogsBefore)
      })
    }, 10000)

    describe('when updating a blog', () => {
      const updateBlog = (updateData, blogId, signedInUser) => {
        return api
          .put(`/api/blogs/${blogId}`)
          .set({ Authorization: `Bearer ${signedInUser.token}` })
          .send(updateData)
      }

      test('status code should be 200 and content type application/json', async () => {
        const testUser = seedData.getTestUser()
        const signedInUser = await signInUser(testUser)
        const { id: userId } = await usersHelpers.getUser(testUser.username)
        const blogs = await blogsHelpers.getUsersBlogs(userId)
        const blogToUpdate = blogs[0]

        await updateBlog({ likes: 1000 }, blogToUpdate.id, signedInUser)
          .expect(200)
          .expect('Content-Type', /application\/json/)
      }, 10000)

      test('returned body has correct values', async () => {
        const testUser = seedData.getTestUser()
        const testUserDb = await usersHelpers.getUser(testUser.username)
        const signedInUser = await signInUser(testUser)
        const blogToUpdate = await blogsHelpers.getRandomBlogForUser(
          testUserDb._id
        )

        const updateData = { likes: 1000 }

        const response = await updateBlog(
          updateData,
          blogToUpdate.id,
          signedInUser
        ).expect(200)

        expect(response.body).toEqual({ ...blogToUpdate, ...updateData })
      }, 10000)

      test('db record has correct values', async () => {
        const testUser = seedData.getTestUser()
        const testUserDb = await usersHelpers.getUser(testUser.username)
        const signedInUser = await signInUser(testUser)
        const blogToUpdate = await blogsHelpers.getRandomBlogForUser(
          testUserDb._id
        )

        const updateData = { likes: 1000 }

        const response = await updateBlog(
          updateData,
          blogToUpdate.id,
          signedInUser
        ).expect(200)
        const blogId = response.body.id

        let dbBlog = await blogsHelpers.getBlogWithId(blogId)
        expect(dbBlog).toEqual({ ...blogToUpdate, ...updateData })
      })

      test('only likes path should be updated', async () => {
        const testUser = seedData.getTestUser()
        const testUserDb = await usersHelpers.getUser(testUser.username)
        const signedInUser = await signInUser(testUser)
        const blogToUpdate = await blogsHelpers.getRandomBlogForUser(
          testUserDb._id
        )

        const likesData = { likes: 1000 }
        const otherData = {
          title: 'asdffghbfe',
          author: 'wregytyudswfe',
          url: 'sfdaretghghrthegwresd',
          user: blogsHelpers.getBlogIdNotInDb(),
        }

        const updateData = { ...likesData, ...otherData }

        const response = await updateBlog(
          updateData,
          blogToUpdate.id,
          signedInUser
        ).expect(200)
        const blogId = response.body.id

        const expected = { ...blogToUpdate, ...likesData }

        let dbBlog = await blogsHelpers.getBlogWithId(blogId)
        expect(dbBlog).toEqual(expected)
      }, 10000)

      test('should be able to update another users likes', async () => {
        const otherUser = seedData.getUserOtherThanTest()
        const signedInUser = await signInUser(otherUser)

        const testUser = seedData.getTestUser()

        const testUserDb = await usersHelpers.getUser(testUser.username)
        const blogToUpdate = await blogsHelpers.getRandomBlogForUser(
          testUserDb._id
        )

        const likesData = { likes: 1000 }
        const otherData = {
          title: 'asdffghbfe',
          author: 'wregytyudswfe',
          url: 'sfdaretghghrthegwresd',
          user: blogsHelpers.getBlogIdNotInDb(),
        }

        const updateData = { ...likesData, ...otherData }

        const response = await updateBlog(
          updateData,
          blogToUpdate.id,
          signedInUser
        ).expect(200)
        const blogId = response.body.id

        const expected = { ...blogToUpdate, ...likesData }

        let dbBlog = await blogsHelpers.getBlogWithId(blogId)
        expect(dbBlog).toEqual(expected)
      })

      //consider putting in test for update with no data and with likes as null

      test('attempting to update a non existant blog returns 404 status and correct content type', async () => {
        const testUser = seedData.getTestUser()
        const signedInUser = await signInUser(testUser)

        const nonexistantBlogId = await blogsHelpers.getBlogIdNotInDb()

        const updateData = { likes: 1000 }

        const response = await updateBlog(
          updateData,
          nonexistantBlogId,
          signedInUser
        )
          .expect(404)
          .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({ error: 'resource not found' })
      })

      //todo attempting to set likes with invalid data type i.e. String

      test('cast error for likes path returns 400 status and appropriate error message', async () => {
        const testUser = seedData.getTestUser()
        const signedInUser = await signInUser(testUser)
        const { id: userId } = await usersHelpers.getUser(testUser.username)
        const blogs = await blogsHelpers.getUsersBlogs(userId)
        const blogToUpdate = blogs[0]

        await updateBlog(
          { likes: 'not a number' },
          blogToUpdate.id,
          signedInUser
        )
          .expect(400)
          .expect('Content-Type', /application\/json/)
      }, 10000)

      test('invalid id returns 400 status code and an appropriate error message', async () => {
        const testUser = seedData.getTestUser()
        const signedInUser = await signInUser(testUser)
        const userId = 1

        const response = await updateBlog({ likes: 1000 }, userId, signedInUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        expect(response.body.error).toBe('malformatted id')
      }, 10000)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
