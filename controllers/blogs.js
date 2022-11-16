const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')


blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = await User.findOne({})
  const userId = user._id
  const blog = new Blog({
    ...request.body,
    user: userId
  })

  const savedBlog = await blog.save()
  await User.findByIdAndUpdate(userId, { blogs: [...user.blogs, savedBlog._id] })
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params
  await Blog.deleteOne({ __id: id })
  response.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { body } = req
  const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true })
  res.status(200).json(updatedBlog)
})

module.exports = blogsRouter
