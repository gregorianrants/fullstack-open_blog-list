const { groupBy, mapValues, sortBy, last } = require('lodash')

const blogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 2,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 3,
    __v: 0,
  },
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 1,
    __v: 0,
  },
]

function countLikes(blogs) {
  return blogs.map((blog) => blog['likes']).reduce((a, b) => a + b)
}

function count(blogs) {
  return blogs.length
}

//takes array of blog posts
//groups by author then calculates statistic for each authour using statisticFunction
//returns array of objects with shape {author, statisticName: statisticValue}
function statistics(blogs, statisticName, statisticFunction) {
  const byAuthor = groupBy(blogs, (blog) => blog['author'])
  const statisticMap = mapValues(byAuthor, statisticFunction)
  const statisticArrayOfObjects = Object.entries(statisticMap).map(
    ([key, value]) => {
      let obj = {}
      obj['author'] = key
      obj[statisticName] = value
      return obj
    }
  )
  return statisticArrayOfObjects
}

function highestValueForProperty(objectsArray, property) {
  const sorted = sortBy(objectsArray, (obj) => obj[property])
  return last(sorted)
}

function authorWithMostBlogs(blogs) {
  const statisticsArray = statistics(blogs, 'blogs', count)
  return highestValueForProperty(statisticsArray, ['blogs'])
}

function authorWithMostLikes(blogs) {
  const statisticsArray = statistics(blogs, 'likes', countLikes)
  return highestValueForProperty(statisticsArray, ['likes'])
}

console.log(authorWithMostBlogs(blogs))
console.log(authorWithMostLikes(blogs))
