require('dotenv').config()
const mongoose = require('mongoose')
require('./customFunctions/userModel')
const User = mongoose.model('emails')

exports.handler = async (event, context) => {
  const array = event.body.split('email=')
  const email = decodeURIComponent(array[1])

  try {
    mongoose.connect(process.env.MONGODB_URI_DEPLOY_DESIGNER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })

    const existingUser = await User.findOne({ email: email })

    if (existingUser) {
    }

    if (!existingUser) {
      const user = await new User({
        email: email,
      }).save()
    }
    mongoose.disconnect()
    return {
      statusCode: 302,
      headers: {
        Location: '/early-access',
      },
      body: 'Success',
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: err,
    }
  }
}
