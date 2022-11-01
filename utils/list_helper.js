const { countBy, groupBy, mapValues, sortBy, last } = require('lodash')

function countLikes(blogs) {
    return blogs.map((blog) => blog['likes']).reduce((a, b) => a + b)
}

function highestValueForProperty(objectsArray, property) {
    const sorted = sortBy(objectsArray, (obj) => obj[property])
    return last(sorted)
}


const totalLikes = (blogs) => {
    return countLikes(blogs)
};

const favouriteBlog = (blogs) => {
    return highestValueForProperty(blogs, 'likes')
}



module.exports = {
    totalLikes,
    favouriteBlog,
};
