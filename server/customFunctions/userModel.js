const mongoose = require('mongoose')
const { Schema } = mongoose

const emailSchema = new Schema({
  email: String,
})

mongoose.model('emails', emailSchema)
