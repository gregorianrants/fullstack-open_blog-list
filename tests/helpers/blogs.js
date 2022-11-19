const Blog = require('../../models/blog.js')
const seedData = require('./seedData')
const User = require('../../models/user.js')

const blogs = seedData.blogs

const blog = {
  title: 'Type wars',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2,
}

async function seedDB() {
  await Blog.Model.deleteMany()
  const savedBlogs = seedData.blogUserMapping.map(async (username, i) => {
    const userDoc = await User.findOne({ username })
    const blogData = seedData.blogs[i]
    return await Blog.create({ blogData, userDoc })
  })
  await Promise.all(savedBlogs)
}

async function getUsersBlogs(username) {
  const user = await User.findOne({ username })
  const blogs = await Blog.listBlogs(user)
  return blogs.map((blog) => blog.toJSON())
}

async function getBlogs() {
  const blogs = await Blog.Model.find({})
  return JSON.parse(JSON.stringify(blogs))
}

async function getBlogNotBelongingTo(username) {
  const blogs = await getBlogs()
  return blogs.filter((blog) => blog.user.username !== username)
}

async function blogWithSameIdExists(blog) {
  const blogs = await getBlogs()
  const result = blogs.find((dbBlog) => dbBlog.id === blog.id)
  return Boolean(result)
}

async function getBlogsLength() {
  const blogs = await getBlogs()
  return blogs.length
}

async function getBlogWithId(id) {
  const blog = await Blog.Model.findById(id)
  return blog.toJSON()
}

module.exports = {
  blog,
  blogs,
  seedDB,
  getUsersBlogs,
  getBlogs,
  getBlogNotBelongingTo,
  blogWithSameIdExists,
  getBlogsLength,
  getBlogWithId,
}
