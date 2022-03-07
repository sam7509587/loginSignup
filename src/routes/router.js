const express = require("express")
const router  = express.Router();

const userControl = require("../controller/usercontrol")
const middleware =require("../middleware/validate")
const Valid = require("../middleware/number")

router.post("/createuser",middleware.validateData,middleware.checkContact,userControl.createUser)
router.post("/verifyuser/:token",userControl.verifyUser)
router.post("/generateOTP",Valid.verifiedUser,middleware.userPresent,userControl.generateOTP)
router.post("/login",Valid.verifiedUser,Valid.numberValid,userControl.loginUser)
router.post("/forgotpassword",userControl.forgotPassword)
router.post("/verifyemail",userControl.sendMail)
module.exports = router
