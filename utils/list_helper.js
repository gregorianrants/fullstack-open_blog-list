const { groupBy, mapValues, sortBy, last } = require('lodash')

function dummy() {
  return 1
}

function countLikes(blogs) {
  return blogs.map((blog) => blog['likes']).reduce((a, b) => a + b)
}

function count(blogs) {
  return blogs.length
}

function highestValueForProperty(objectsArray, property) {
  const sorted = sortBy(objectsArray, (obj) => obj[property])
  return last(sorted)
}

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

function totalLikes(blogs) {
  if (blogs.length === 0) return null
  return countLikes(blogs)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return highestValueForProperty(blogs, 'likes')
}

function mostBlogs(blogs) {
  if (blogs.length === 0) {
    return {
      author: null,
      blogs: null,
    }
  }
  const statisticsArray = statistics(blogs, 'blogs', count)
  return highestValueForProperty(statisticsArray, ['blogs'])
}

function mostLikes(blogs) {
  if (blogs.length === 0) {
    return {
      author: null,
      likes: null,
    }
  }
  const statisticsArray = statistics(blogs, 'likes', countLikes)
  return highestValueForProperty(statisticsArray, ['likes'])
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}
