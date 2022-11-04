const helpers = require('./api_helpers.js')
const superTest = require('supertest')
const app = require('../app.js')

const api = superTest(app)

beforeEach(async () => {
  await helpers.seedDB()
})

test('fetch blogs', async () => {
  console.log()
  const blogs = await api.get('/api/blogs').expect(200)

  expect(blogs.body.length).toBe(helpers.blogs.length)
}, 10000)

test('check blog has an id property ', async () => {
  const blogs = await api.get('/api/blogs').expect(200)

  const id = blogs.body[0]?.id

  expect(id).toBeDefined()
}, 10000)

test('create new blog post', async () => {
  await api
    .post('/api/blogs')
    .send(helpers.blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await helpers.getBlogs()

  expect(blogs.length).toEqual(helpers.blogs.length + 1)

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

test('title and url are required', async () => {
  const noTitle = {
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  }
  await api.post('/api/blogs').send(noTitle).expect(400)

  const noUrl = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  }

  await api.post('/api/blogs').send(noUrl).expect(400)
}, 10000)
