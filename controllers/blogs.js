const blogsRouter = require("express").Router();

console.log("hello");

blogsRouter.get("/", (request, response) => {
  console.log("hello");
  //   Blog.find({}).then((blogs) => {
  //     response.json(blogs);
  //   });
  response.json({ works: "yes" });
});

blogsRouter.post("/", (request, response) => {
  //   const blog = new Blog(request.body);
  //   blog.save().then((result) => {
  //     response.status(201).json(result);
  //   });
});

module.exports = blogsRouter;
