const seedData = require('./seedData.js')
const { removePath } = require('../../library/library.js')
const {
  toContainAllKeys,
  toSatisfyAll,
  toIncludeAllMembers,
  toIncludeAllPartialMembers,
} = require('jest-extended')
const { get } = require('lodash')
expect.extend({
  toContainAllKeys,
  toSatisfyAll,
  toIncludeAllMembers,
  toIncludeAllPartialMembers,
})

describe('test seed data helpers', () => {
  test('numberOfBlogsWithUserName', () => {
    const gandalf = seedData.numberOfBlogsWithUsername(seedData.GANDALF)
    const aragon = seedData.numberOfBlogsWithUsername(seedData.ARAGON)
    expect(gandalf).toBe(2)
    expect(aragon).toBe(1)
  })

  test('getUser', () => {
    expect(seedData.getUser(seedData.GANDALF).username).toBe(seedData.GANDALF)
    expect(seedData.getUser(seedData.GANDALF)).toContainAllKeys([
      'username',
      'name',
      'password',
    ])
  })

  describe('populateBlogs', () => {
    test('result has correct length', () => {
      let populated = seedData.populateBlogs(seedData.blogs)
      expect(populated.length).toBe(3)
    })

    test('all the blogs from seed data are in the result', () => {
      let populated = seedData.populateBlogs(seedData.blogs)
      expect(seedData.blogs).toIncludeAllPartialMembers(
        populated.map(removePath('user'))
      )
    })

    test('the user on each blog matches username for the blog', () => {
      let populated = seedData.populateBlogs(seedData.blogs)
      populated.forEach((blog, i) => {
        expect(blog.user.username).toEqual(seedData.blogs[i].user)
        expect(seedData.users.map((user) => user.username)).toContainEqual(
          seedData.blogs[i].user
        )
      })
    })

    test('all the usernames in the result are in seed data users', () => {
      let populated = seedData.populateBlogs(seedData.blogs)
      populated.forEach((blog, i) => {
        const usernames = seedData.users.map((user) => user.username)
        const blogUserName = seedData.blogs[i].user
        expect(usernames).toContainEqual(blogUserName)
      })
    })

    //todo: check if works for subset of blogs
  })

  describe('populateUsers', () => {
    test('each populated user has the correct blogs', () => {
      let populated = seedData.populateUsers(seedData.users)

      populated.forEach((user) => {
        let seedBlogsForUser = seedData.getUsersBlogs(user.username)
        let populatedBlogsForUser = user.blogs

        expect(seedBlogsForUser).toIncludeAllPartialMembers(
          populatedBlogsForUser
        )
      })

      //todo: need more checks here
    })

    test('there are the correct number of populated users', () => {
      let populated = seedData.populateUsers(seedData.users)
      expect(populated.length).toBe(2)
    })

    test('all the users in the seed data are in the result', () => {
      let populated = seedData.populateUsers(seedData.users)
      let populateWithoutBlogsPath = populated.map(removePath('blogs'))
      expect(populateWithoutBlogsPath).toIncludeAllMembers(
        seedData.users.map(removePath('password'))
      )
    })
  })

  test('getUsersBlogs', () => {
    const result = seedData.getUsersBlogs(seedData.GANDALF)

    expect(result.map((blog) => blog.user)).toSatisfyAll(
      (username) => username === seedData.GANDALF
    )
    expect(result.length).toEqual(
      seedData.numberOfBlogsWithUsername(seedData.GANDALF)
    )
  })

  test('getBlogNotBelongingTo', () => {
    const blogs = seedData.getBlogNotBelongingTo(seedData.ARAGON)

    expect(seedData.blogs).toIncludeAllMembers(blogs)
    const usernames = blogs.map((blog) => blog.user)

    expect(usernames).toSatisfyAll((username) => username === seedData.GANDALF)
    expect(blogs.length).toEqual(
      seedData.numberOfBlogsWithUsername(seedData.GANDALF)
    )
  })

  test('getTestUser', () => {
    const user = seedData.getTestUser()

    expect(seedData.users).toContainEqual(user)
  })

  test('getUserOtherThanTest', () => {
    const otherUser = seedData.getUserOtherThanTest()
    const testUser = seedData.getTestUser()
    expect(testUser).not.toEqual(otherUser)
    expect(otherUser).toContainAllKeys(['username', 'name', 'password'])
  })
})
