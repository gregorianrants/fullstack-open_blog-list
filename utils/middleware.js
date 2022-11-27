const logger = require('./logger.js')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  //console.log(error)
  logger.error(error.message)

  /*
  if we get an error validating data for mongoose it slighlty different if error is validation error or cast error
  if we get an error validating data it will be a ValidationError with an errors property pointing to an object
  the properties of the object are the path names for the errors
  each of these could be a CastError or a ValidatorError pay attention to difference between validation and validator
  if we get a cast error with the _id we get a simple CastError not a ValidationError with an errors property
  */

  if (error.name === 'CastError' && error.path === '_id') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'AppError') {
    return response.status(error.statusCode).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid json web token' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
}
