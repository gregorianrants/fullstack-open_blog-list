const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.listBlogs(request.user)
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = request.user
  const savedBlog = await Blog.create({ blogData: request.body, userDoc: user })
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  const userId = request.user._id
  const blog = await Blog.Model.findById(id)
  if (!blog) return response.status(204).end()
  if (blog.user.toString() !== userId.toString())
    response
      .status(401)
      .json({ error: 'you are not authorised to delete this blog' })
  response.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { body } = req
  const updatedBlog = await Blog.Model.findByIdAndUpdate(id, body, {
    new: true,
  })
  res.status(200).json(updatedBlog)
})

module.exports = blogsRouter
