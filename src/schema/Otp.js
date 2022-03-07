
const mongoose = require("mongoose")
const schema = mongoose.Schema({
    contact:String,
    otp : { type: String},
    createdAt: Number
    
})
const otpModel = mongoose.model("otp",schema)
module.exports = otpModel
