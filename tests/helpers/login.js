const jwt = require('jsonwebtoken')

function configureSignInUser(api) {
  return async (user) => {
    const { username, name, password } = user
    const response = await api.post('/api/login').send({ username, password })

    if (response.status === 200) {
      const token = response.body.token
      const { id } = jwt.decode(token)
      return { username, password, token, id }
    }
  }
}

module.exports = { configureSignInUser }
