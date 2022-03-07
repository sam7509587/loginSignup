const userModel = require("../schema/userSchema")
exports.numberValid = async(req,res,next)=>{
    contact = req.body.contact
    if (contact.length === 13 && contact.slice(0, 3) === "+91") {
        console.log("correct")
        next()
}else{
    res.status(401).send("Number must be in this format : +917509587122")
}
}

exports.verifiedUser = async(req,res,next)=>{
    try{
        const user = await userModel.findOne({contact:req.body.contact})
        console.log(user)
        if(user.isVerified===false){
            res.send("unverified User , verifiy yourself first")
        }else{
            next()
        }

    }catch(err){
        res.send(err)
    }
}

