const Blog = require('../models/blog.js')

const blogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
]

const blog = {
  title: 'Type wars',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2,
}

async function seedDB() {
  await Blog.deleteMany()
  const Blogs = blogs.map((blog) => new Blog(blog))
  await Promise.all(Blogs.map((el) => el.save()))
}

async function getBlogs() {
  const blogs = await Blog.find({})
  return JSON.parse(JSON.stringify(blogs))
}

function withoutId(blog) {
  let result = { ...blog }
  delete result.id
  return result
}

module.exports = {
  blog,
  blogs,
  seedDB,
  getBlogs,
  withoutId,
}
