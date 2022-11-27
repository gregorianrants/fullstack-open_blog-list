const seedData = require('./seedData.js')
const { toContainAllKeys } = require('jest-extended')
expect.extend({ toContainAllKeys })

describe('test seed data helpers', () => {
  test('correct blogs returned for user', () => {
    const result = seedData.getUsersBlogs('fleece')
    expect(result).toEqual([
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
    ])
  })

  test('get user other than test', () => {
    const otherUser = seedData.getUserOtherThanTest()
    const testUser = seedData.getTestUser()
    expect(testUser).not.toEqual(otherUser)
    expect(otherUser).toContainAllKeys(Object.keys(testUser))
  })

  test('numberOfBlogsForUser', () => {
    expect(seedData.numberOfBlogsForUser('fleece')).toBe(2)
    expect(seedData.numberOfBlogsForUser('jimmlad')).toBe(1)
  })
})
