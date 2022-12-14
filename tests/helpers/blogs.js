const Blog = require('../../models/blog.js')
const seedData = require('./seedData')
const User = require('../../models/user.js')
const library = require('../../library/library.js')

const blogs = seedData.blogs

// const blog = {
//   title: 'Type wars',
//   author: 'Robert C. Martin',
//   url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
//   likes: 2,
// }

async function seedDB() {
  await Blog.Model.deleteMany()
  const savedBlogs = seedData.blogs.map(async (blog) => {
    const userDoc = await User.Model.findOne({ username: blog.user })
    const blogData = { ...blog }
    delete blogData.user
    return await Blog.create({ blogData, userDoc })
  })
  await Promise.all(savedBlogs)
}

function toJSON(docOrArray) {
  function toJSON(doc) {
    return JSON.parse(JSON.stringify(doc))
  }
  if (Array.isArray(docOrArray)) {
    return docOrArray.map(toJSON)
  }
  return toJSON(docOrArray)
}

async function getBlogs() {
  const blogs = await Blog.populateUsers(Blog.Model.find({}))
  return toJSON(blogs)
}

async function getUsersBlogs(userId) {
  return await Blog.populateUsers(Blog.Model.find({ user: userId })).then(
    toJSON
  )
}

async function getBlogsNotBelongingTo(username) {
  const blogs = await getBlogs()
  return blogs.filter((blog) => blog.user.username !== username)
}

async function blogWithSameIdExists(blog) {
  const blogs = await getBlogs()
  const result = blogs.find((dbBlog) => dbBlog.id === blog.id)
  return Boolean(result)
}

async function getBlogWithId(id) {
  const blog = await Blog.Model.findById(id)
  return toJSON(blog)
}

async function getRandomBlogForUser(userId) {
  const blog = await Blog.Model.find({ user: userId })
  return library.randomElement(toJSON(blog))
}

function getBlogIdNotInDb() {
  const newBlog = new Blog.Model({ ...seedData.newBlog })
  return newBlog.id.toString()
}

module.exports = {
  blogs,
  seedDB,
  getUsersBlogs,
  getBlogs,
  getBlogsNotBelongingTo,
  blogWithSameIdExists,
  getBlogWithId,
  getRandomBlogForUser,
  toJSON,
  getBlogIdNotInDb,
}
