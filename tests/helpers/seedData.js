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

const users = [
  {
    username: 'fleece',
    name: 'json argonaught',
    password: 'golden',
  },
  {
    username: 'jimmlad',
    name: 'jim hawkins',
    password: 'piecesofeight',
  },
]

const unauthourisedUser = {
  username: 'asdfsdfsadfsadf',
    name: 'asdfsaregtwesd',
    password: 'asdfsadfsdfsdf',
}

//gives the index of user each blog should be associated with
const blogUserMapping = ['jimmlad', 'fleece', 'fleece']

function getUsersBlogs(username) {
  return blogs.filter((blog, i) => {
    if (blogUserMapping[i] === username) return true
  })
}

function getTestUser() {
  return users[0]
}

module.exports = {
  blogs,
  users,
  blogUserMapping,
  unauthourisedUser,
  getUsersBlogs,
  getTestUser,
}
