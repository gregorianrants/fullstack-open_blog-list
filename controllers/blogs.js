const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.listBlogs()
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = request.user

  // const userId = user._id
  // const blog = new Blog.Model({
  //   ...request.body,
  //   user: userId,
  // })

  // const savedBlog = await blog.save()
  // await User.findByIdAndUpdate(userId, {
  //   blogs: [...user.blogs, savedBlog._id],
  // })
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
