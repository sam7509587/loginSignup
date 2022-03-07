const userModel = require("../schema/userSchema")
const twilio = require("twilio");
var nodemailer = require('nodemailer');
const otpModel = require("../schema/Otp");
const sId = process.env.TWILIO_SID;
const twilioToken = process.env.TWILIO_TOKEN
const jwt = require("jsonwebtoken");
exports.createUser = async (req, res) => {
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        contact: req.body.contact
    }
    const result = await userModel.create(newUser);
    const user = await userModel.findOne({ contact: req.body.contact })
    res.status(200).send({
        message: "User has been created and mail has been sent to verify account",
        token: user.resetToken,
        status: 200,
        success: true,
        data: result
    })
},

    exports.loginUser = async (req, res) => {
        try {
            const otp = req.body.otp;
            const contact = req.body.contact;
            const user = await otpModel.findOne({ contact })
            if (user.otp == otp) {
                if (user.createdAt > (Date.now() - 300000)) {
                    const refreshToken = jwt.sign({ contact: req.body.contact }, process.env.SECRET_KEY, { expiresIn: "1y" })
                    const accessToken = jwt.sign({ contact }, process.env.SECRET_KEY, { expiresIn: "1d" })
                    this.sendMail
                    res.status(200).send({
                        message: "log in successfull",
                        refreshToken,
                        accessToken,
                        status: 200,
                        success: true
                    });
                } else {
                    res.status(401).send("Otp expired")

                }
            } else {
                res.send("invalid otp")
            }
        } catch (err) {
            console.log(err)
        }
    }
exports.generateOTP = async (req, res) => {
    try {
        const client = new twilio(sId, twilioToken)
        let Otp = Math.floor((Math.random() * 1000000) + 1);

        await client.messages.create({
            body: `hello ${req.name} your verification code is : ${Otp} and will expires in 5 min`,
            to: req.body.contact,
            from: process.env.PHONE

        });
        const otpUser = await otpModel.findOne({ contact: req.body.contact })
        if (otpUser === null) {
            await otpModel.create({ contact: req.body.contact, otp: Otp, createdAt: Date.now() })
            res.status(200).json({
                message: "Otp has been sent and will expire in 5 min ",
                status: 200,
                success: true
            })
        }
        else {
            await otpModel.findOneAndReplace({ contact: req.body.contact }, { contact: req.body.contact, otp: Otp, createdAt: Date.now() })
            res.status(200).json({
                message: "Otp has been sent and will expire in 5 min ",
                status: 200,
                success: true
            })
        }
    }
    catch (err) {
        res.send(err)
        console.log(err)
    }

}
exports.verifyUser = async (req, res) => {
    const user = await userModel.findOne({ email: req.body.email })
    if (user.isVerified === false) {
        if (req.params != {}) {
            if (req.params.token === user.resetToken) {
                verifyUserToken = await userModel.updateOne({ email: req.body.email }, { isVerified: true })
                res.status(200).send({
                    message: " user verified",
                    status: 200,
                    success: true
                })
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
    } else {
        res.status(409).send({
            message: "already verified User",
            status: 409,
            success: false
        })
    }
}
exports.forgotPassword = async (req, res) => {
    contact = req.body.contact
    const user = await userModel.findOne({ contact })
    const result = user.createdAt
    console.log((Date.now() - result) / 600000)
}
exports.sendMail = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER_MAIL,
                pass: process.env.USER_PASSWORD
            }
        });
        console.log({
            user: process.env.USER_MAIL,
            pass: process.env.USER_PASSWORD
        })
        const mailOptions = {
            from: process.env.USER_MAIL,
            to: req.body.email,
            subject: 'Verify your mail',
            text: `Hey ${user.name} , it's our link to veriy the account and will going to expire in 10 mins  `,
            html: `<br><a href="http://127.0.0.1:${process.env.PORT}/${user.token}/">Click Here to Verify </a> `
        };
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    } catch (err) {
        res.send(err)
    }
}
