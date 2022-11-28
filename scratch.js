const { normalize, schema } = require('normalizr')

const data = [
  {
    id: 1,
    username: 'fleece',
    name: 'json argonaught',
    password: 'golden',
    blogs: [
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
    ],
  },
  {
    id: 2,
    username: 'jimmlad',
    name: 'jim hawkins',
    password: 'piecesofeight',
    blogs: [
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      },
    ],
  },
]

const blog = new schema.Entity('blogs', {}, { idAttribute: 'username' })

const users = new schema.Entity('users', {
  blogs: [blog],
})

const normalizedData = normalize(data, users)

console.log(normalizedData)
