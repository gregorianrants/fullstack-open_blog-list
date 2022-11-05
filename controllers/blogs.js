const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()

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
