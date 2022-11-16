const mongoose = require('mongoose')
const { doc } = require('prettier')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  name: String,
  blogs: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.set('toJSON', {
  transform: (recieved, returned) => {
    returned.id = recieved._id.toString()
    delete returned._id
    delete returned.__v
    delete returned.password
  }
})

userSchema.pre('validate', async function() {
  const user = await this.constructor.find({
    username: this.username
  })
  if (this.username.length <= 3) {
    this.invalidate(
      'username',
      'username must be longer than 3 characters',
      this.username
    )
  }
  if (user.length > 0) {
    this.invalidate('username', 'username must be unique', this.username)
  }
})

userSchema.pre('validate', async function() {
  if (this.password.length <= 3) {
    this.invalidate(
      'password',
      'password must be longer than 3 characters',
      '*' * this.password.length
    )
  }
})

userSchema.pre('save', async function() {
  const saltRounds = 10
  const hash = await bcrypt.hash(this.password, saltRounds)

  this.password = hash
})

const User = mongoose.model('User', userSchema)

module.exports = User
