function configureSignInUser(api) {
  return async (user) => {
    const { username, name, password } = user
    const response = await api.post('/api/login').send({ username, password })

    const token = response.body.token
    return { username, password, token }
  }
}

module.exports = { configureSignInUser }
