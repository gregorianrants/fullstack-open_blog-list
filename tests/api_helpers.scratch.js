require("../db.js")
const {
  seedDB,
  getBlogs,
  removePathsAddedByMongoose,
} = require("./api_helpers")
const mongoose = require("mongoose")

async function main() {
  //await seedDB()
  let blogs = await getBlogs()
  blogs = blogs.map((blog) => removePathsAddedByMongoose(blog))
  console.log(blogs)
  await mongoose.connection.close()
}



main().catch((err) => console.error(err))
