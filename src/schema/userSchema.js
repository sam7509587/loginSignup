
const mongoose = require("mongoose")
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name: {type:String,required:true},
    email:  {type:String,required:true},
    password:  {type:String,required:true},
    contact:  {type:String,required:true},
    resetToken:{resetToken:String},
    isVerified: {type: Boolean ,default: false},
    createdAt: Number
}) 
userSchema.pre("save",async function(req,res,next){
    this.resetToken =await crypto.createHash('sha256', process.env.SECRET_KEY).update(process.env.ENCODED_DATA).digest(process.env.EN_TYPE); 
    this.createdAt =  Date.now()
    next()
})

const userModel = mongoose.model("user",userSchema);
module.exports = userModel
