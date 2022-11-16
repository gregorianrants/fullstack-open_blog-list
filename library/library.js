function withoutId(blog) {
  let result = { ...blog }
  delete result.id
  return result
}

function removePath(pathname) {
  return function (obj) {
    let result = { ...obj }
    delete result[pathname]
    return result
  }
}

function randomInt(max) {
  return Math.floor(Math.random() * (max + 1))
}

function randomElement(arr) {
  const maxIndex = arr.length - 1
  const randomIndex = randomInt(maxIndex)
  return arr[randomIndex]
}

module.exports = {
  withoutId,
  removePath,
  randomInt,
  randomElement,
}
