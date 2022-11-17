const AppError = require('./AppError')
const jwt = require('jsonwebtoken')
const User = require('../models/user.js')

const getBearerToken = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const tokenDecoder = (req) => {
  const token = getBearerToken(req)
  if (!token) throw new AppError('token missing or invalid', 401)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken?.id) throw new AppError('token missing or invalid', 401)
  return decodedToken
}

const userExtractor = async (req, res, next) => {
  const decodedToken = tokenDecoder(req)
  const user = await User.findById(decodedToken.id)
  req.user = user
  next()
}

module.exports = userExtractor
