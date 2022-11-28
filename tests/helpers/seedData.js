const { removePath } = require('../../library/library')

const ARAGON = 'aragon'
const GANDALF = 'gandalf'

const blogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: ARAGON,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: GANDALF,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 8,
    user: GANDALF,
  },
]

const users = [
  {
    username: GANDALF,
    name: 'gandalf mithras',
    password: 'speakfriendandenter',
  },
  {
    username: ARAGON,
    name: 'strider ranger',
    password: 'swordthatwasbroken',
  },
]

function numberOfBlogsWithUsername(username) {
  return blogs.filter((blog) => blog.user === username).length
}

const unauthourisedUser = {
  username: 'asdfsdfsadfsadf',
  name: 'asdfsaregtwesd',
  password: 'asdfsadfsdfsdf',
}

const newBlog = {
  title: 'new blog on the block',
  author: 'donnie walberg',
  url: 'https://images.dog.ceo/breeds/rottweiler/n02106550_4339.jpg',
  likes: 10000,
}

//gives the index of user each blog should be associated with

function getBlogs() {
  return blogs
}

function getUser(username) {
  return users.find((user) => user.username === username)
}

function populateBlogs(blogs) {
  return blogs.map((blog) => {
    let user = { ...getUser(blog.user) }
    user = removePath('password')(user)
    blog = { ...blog }
    blog.user = user
    return blog
  })
}

function populateUsers(users) {
  return users.map((user) => {
    user = { ...user }
    user = removePath('password')(user)
    let blogs = [...getUsersBlogs(user.username)]
    blogs = blogs.map(removePath('user'))
    user.blogs = blogs
    return user
  })
}

function getUsersBlogs(username) {
  return blogs.filter((blog) => blog.user === username)
}

function getBlogNotBelongingTo(username) {
  return blogs.filter((blog) => blog.user !== username)
}

function getTestUser() {
  return users[0]
}

function getUserOtherThanTest() {
  const testUser = getTestUser()
  return users.filter((user) => user.username !== testUser.username)[0]
}

module.exports = {
  GANDALF,
  ARAGON,
  blogs,
  users,
  unauthourisedUser,
  newBlog,
  getBlogs, //todo remove this and replace usages
  getUser,
  getUsersBlogs,
  getBlogNotBelongingTo,
  getTestUser,
  getUserOtherThanTest,
  populateBlogs,
  populateUsers,
  numberOfBlogsWithUsername,
}
