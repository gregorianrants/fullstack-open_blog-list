const helpers = require('./api_helpers.js')
const superTest = require('supertest')
const app = require('../app.js')

const api = superTest(app)

beforeEach(async () => {
  await helpers.seedDB()
})

describe('when there are already some blogs in the database', () => {
  test('get /api/blogs returns the right number of blogs', async () => {
    const blogs = await api.get('/api/blogs').expect(200)

    expect(blogs.body.length).toBe(helpers.blogs.length)
  }, 10000)

  test('blogs have an idea property', async () => {
    const blogs = await api.get('/api/blogs').expect(200)
    blogs.body.forEach((blog) => {
      const id = blog?.id
      expect(id).toBeDefined()
    })
  }, 10000)
})

describe('when creating a new blog post', () => {
  test('there are the correct number of blogs in db afterwards', async () => {
    await api
      .post('/api/blogs')
      .send(helpers.blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helpers.getBlogs()

    expect(blogs.length).toEqual(helpers.blogs.length + 1)
  }, 10000)

  test('the created blog has the expected properties and values', async () => {
    await api
      .post('/api/blogs')
      .send(helpers.blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helpers.getBlogs()
    const blogsWithOutId = blogs.map(helpers.withoutId)

    expect(blogsWithOutId).toContainEqual(helpers.blog)
  }, 10000)

  test('likes defaults to 0', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    }
    const blog = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(blog.body.likes).toBe(0)
  }, 10000)

  test('returns status 400 if like or url not defined', async () => {
    const noTitle = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    }
    await api.post('/api/blogs').send(noTitle).expect(400)

    const noUrl = {
      title: 'Type wars',
      author: 'Robert C. Martin',
    }

    await api.post('/api/blogs').send(noUrl).expect(400)
  }, 10000)
})

describe('when deleting a blog', () => {
  test('get 204 status code', async () => {
    const blogs = await helpers.getBlogs()
    const id = blogs[0].id
    await api.delete(`/api/blogs/${id}`).expect(204)
  }, 10000)

  test('blog is no longer in db after deletion', async () => {
    const { blogWithSameIdExists, getBlogs } = helpers
    let blogs = await getBlogs()
    const blogForDeletion = blogs[0]
    const blogNotToBeDeleted = blogs[1]

    await api.delete(`/api/blogs/${blogForDeletion.id}`)

    expect(await blogWithSameIdExists(blogForDeletion)).toBe(false)
    expect(await blogWithSameIdExists(blogNotToBeDeleted)).toBe(true)
  }, 10000)

  test('there are one less blogs after a deletion', async () => {
    const blogs = await helpers.getBlogs()
    const numberOfBlogsBefore = await helpers.getBlogsLength()
    const id = blogs[0].id
    await api.delete(`/api/blogs/${id}`).expect(204)
    const numberOfBlogsAfter = await helpers.getBlogsLength()
    expect(numberOfBlogsAfter).toBe(numberOfBlogsBefore - 1)
  }, 10000)
})

describe('when updating a blog', () => {
  test('status code should be 200', async () => {
    const blogs = await helpers.getBlogs()
    const blog = blogs[0]
    const id = blog.id
    const update = { likes: 10000 }

    await api.put(`/api/blogs/${id}`).send(update).expect(200)
  })

  test('returned body has correct values', async () => {
    const blogs = await helpers.getBlogs()
    const blog = blogs[0]
    const id = blog.id
    const update = { likes: 10000 }

    const updatedBlog = { ...blog, ...update }

    const response = await api.put(`/api/blogs/${id}`).send(update).expect(200)

    expect(response.body).toEqual(updatedBlog)
  })

  test('db record has correct values', async () => {
    const blogs = await helpers.getBlogs()
    const blog = blogs[0]
    const id = blog.id
    const update = { likes: 10000 }

    const updatedBlog = { ...blog, ...update }

    await api.put(`/api/blogs/${id}`).send(update)

    const blogFromDb = await helpers.getBlogWithId(id)

    expect(blogFromDb).toEqual(updatedBlog)
  })
})
