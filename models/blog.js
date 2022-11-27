const mongoose = require('mongoose')
const User = require('../models/user.js')

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  url: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: { type: Number, default: 0 },
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

function populateUsers(query) {
  return query.populate('user', {
    username: 1,
    name: 1,
  })
}

async function listBlogs() {
  const blogs = await populateUsers(Blog.find())
  return blogs
}

async function create({ blogData, userDoc }) {
  const userId = userDoc._id
  const blogDoc = new Blog({
    ...blogData,
    user: userId,
  })

  const savedBlog = await blogDoc.save()
  await User.findByIdAndUpdate(userId, {
    blogs: [...userDoc.blogs, savedBlog._id],
  })

  return savedBlog
}

const Blog = mongoose.model('Blog', blogSchema)

module.exports = { Model: Blog, listBlogs, create, populateUsers }
