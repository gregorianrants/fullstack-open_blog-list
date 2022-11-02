const info = (...params) => {
  if (!process.env.node_env === "test") console.log(...params)
}

const error = (...params) => {
  if (!process.env.node_env === "test") console.error(...params)
}

module.exports = {
  info,
  error,
}
