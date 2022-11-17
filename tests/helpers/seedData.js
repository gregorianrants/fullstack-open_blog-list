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
    username: 'jimmlad',
    name: 'jim hawkins',
    password: 'piecesofeight',
  },
  {
    username: 'fleece',
    name: 'json argonaught',
    password: 'golden',
  },
]

function construct(blogs, users) {
  users = [...users]
  users[0].blogs = [blogs[0], blogs[1]]
  users[1].blogs = [blogs[2]]
}
