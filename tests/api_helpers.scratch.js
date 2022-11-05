require('../db.js')
const {
  seedDB,
  getBlogs,
  removePathsAddedByMongoose,
  blogWithSameIdExists,
  getBlogWithId,
} = require('./api_helpers')
const mongoose = require('mongoose')
const superTest = require('supertest')
const app = require('../app.js')

const api = superTest(app)

async function deleteBlog() {
  let blogs = await getBlogs()
  const blogForDeletion = blogs[0]
  const blogNotToBeDeleted = blogs[1]

  await api.delete(`/api/blogs/${blogForDeletion.id}`)

  console.log(await blogWithSameIdExists(blogForDeletion))
  console.log(await blogWithSameIdExists(blogNotToBeDeleted))
}

// async function updateBlog() {
//   const blogs = await getBlogs()
//   const blog = blogs[0]
//   const id = blog.id
//   const update = { likes: 10000 }

//   const updatedBlog = { ...blog, ...update }

//   const response = await api.put(`/api/blogs/${id}`).send({
//     likes: 100000000,
//   })
//   console.log(updatedBlog)
//   console.log(response.body)
// }

async function MatchesDbRecord() {
  const blogs = await getBlogs()
  const blog = blogs[0]
  const id = blog.id
  const update = { likes: 10000 }

  const updatedBlog = { ...blog, ...update }

  await api.put(`/api/blogs/${id}`).send(update)

  const blogFromDb = await getBlogWithId(id)
  console.log(blogFromDb)
}

async function main() {
  await seedDB()
  //awatit deleteBlog()
  //await updateBlog()
  await MatchesDbRecord()

  await mongoose.connection.close()
}

main().catch((err) => console.error(err))
