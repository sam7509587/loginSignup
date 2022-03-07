const joi = require("joi")
const userModel = require("../schema/userSchema")

exports.validateData = (req, res, next) => {
    const data = joi.object({
        name: joi.string().required().min(2),
        password: joi.string().min(8).required(),
        email: joi.string().required(),
        contact: joi.number().min(10).required()
    })
    const valid = data.validate(req.body)
    if (valid.error) {
        res.status(422).json({
            status:  422 ,
            message: valid.error.details[0].message,
            success: false
        })
    } else {
        next()
    }
}

exports.userPresent = async (req, res, next) => {
    const awailable = await userModel.findOne({ contact: req.body.contact })
    if (awailable) {
        if (req.body.password === awailable.password) {
            req.name = awailable.name
            next()
        }
        else {
            res.status(401).send({
                message: "Password invalid ",
                status: 401,
                success: false
            })
        }
    } else {
        res.status(401).send({
            message: "Contact not found ",
            status: 401,
            success: false
        })
    }
}
exports.checkContact = async (req, res, next) => {
    const awailable = await userModel.findOne({ contact: req.body.contact })
    if (awailable) {
        res.status(409).send({
            message: "Contact already present",
            status: 409,
            success: false
        })
    }else {
        contact = req.body.contact
        if (contact.length === 13 && contact.slice(0, 3) === "+91") {
            next()
    }else{
        res.status(401).send("Number must be in this format : +917509587122")
    }
    }
}

exports.checkContactPresent = async (req, res, next) => {
    const awailable = await userModel.findOne({ contact: req.body.contact })
    if (awailable) {
                    next()
        }
        else {
            res.status(401).send({
                message: "Contact not found  ",
                status: 401,
                success: false
            })
        }
}
exports.verifyTokenAndContact=async(req,res,next)=>{
    const user = await userModel.find({contact:req.body.contact})
    if (req.params != {}) {
        if (req.params.token === user.resetToken) {
            next()
            
        } else {
            res.status(401).send({
                message: " invalid token ",
                status: 401,
                success: false
            })
        }
    } else {
        res.status(401).send({
            message: "token not found",
            status: 401,
            success: false
        })
    }
}
