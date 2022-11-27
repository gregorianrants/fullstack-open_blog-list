const blogsRouter = require('express').Router()
const { response } = require('express')
const Blog = require('../models/blog.js')

//NOTE BADLY the get blogs route populates the blogs the others dont!

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.listBlogs()
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
  if (!blog) {
    return response.status(204).end()
  }
  if (blog.user.toString() !== userId.toString()) {
    return response
      .status(401)
      .json({ error: 'you are not authorised to delete this blog' })
  }
  await Blog.Model.deleteOne({ _id: id })
  response.status(204).end()
})

function updateDoc(doc, update) {
  update = { ...update }
  for (const [key, value] of Object.entries(update)) {
    doc[key] = value
  }
  return doc
}

blogsRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { likes } = req.body

  const update = likes
    ? {
      likes,
    }
    : {}

  const blog = await Blog.Model.findById(id)
  if (!blog) {
    return res.status(404).json({ error: 'resource not found' })
  }
  const updatedBlog = updateDoc(blog, update)
  const savedBlog = await updatedBlog.save()

  res.status(200).json(savedBlog)
})

module.exports = blogsRouter
