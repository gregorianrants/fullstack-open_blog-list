const blogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    username: 'fleece',
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: 'fleece',
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    username: 'jimmlad',
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

function populateBlogs(blogs, users) {
  blogs.map(
    (blog) =>
      (blog.username = users.find((user) => user.username === blog.username))
  )
}

function populateUsers(users,blogs){

}


class Ref{
  init(collection){
    this.collection = collection
  }
}