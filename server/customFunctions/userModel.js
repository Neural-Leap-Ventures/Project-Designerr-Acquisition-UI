const mongoose = require('mongoose')
const { Schema } = mongoose

const emailSchema = new Schema({
    userId: String,
    email: String,
    referralId: String,
    numberOfReferrals: Number,
    referrals: [{ idOfReferral: String }],
})

mongoose.model('emails', emailSchema)
