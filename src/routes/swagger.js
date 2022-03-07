const express = require("express")
const router  = express.Router();

const userControl = require("../controller/usercontrol")
const middleware =require("../middleware/validate")
const Valid = require("../middleware/number")

/**
 * @swagger
 * components:
 *  schemas:
 *      users:
 *          type: object
 *          required : 
 *              - name
 *              - email
 *              - password
 *              - contact
 *          properties:
 *              name: 
 *                  type: string
 *              email:
 *                  type: string
 *              contact:
 *                  type: string
 *              password:
 *                  type: string
 *          example:
 *              name: sameer
 *              email: sameer@gmail.com
 *              contact: "+917509587122"
 *              password: "12345678"
 * 
 *      login:
 *          type: object
 *          required: 
 *              - contact
 *              - otp
 *          properties:
 *              contact:
 *                  type: string
 *              otp:
 *                  type: string
 *          example: 
 *              contact: "+917509587122"
 *              password: "12345678"
 */

/**
 * @swagger
 * tags:
 *  - name: UserApis
 *    description: the apis are for signup and login of user
 */

/**
 * @swagger
 * /swagger/createuser:
 *    post:
 *      summary : SIGN UP
 *      tags: [UserApis]
 *      requestBody:
 *          required: 
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/users"
 *      responses:
 *              200:
 *                  description: The user data has been saved in database
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/users'
 *              409:
 *                  description: email or contact already present
 *              500:
 *                  description: server Error 
 *              422 :
 *                  description: Unprocessable Entity status
 */
 
router.post("/createuser",middleware.validateData,middleware.checkContact,userControl.createUser)


/**
 * @swagger
 * /swagger/verifyuser/{token}:
 *  post:
 *      summary: verify User
 *      tags: [UserApis]
 *      parameters:
 *          - in : path
 *            name: token
 *            schema:
 *              type: string
 *            required: true     
 *            description: token to verify
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: 
 *                          - email
 *                          - contact    
 *                          - password
 *                      properties:
 *                          email:
 *                              type: string
 *                          contact: 
 *                              type: string
 *                          password:
 *                              type: string
 *                      example: 
 *                          email : sameer@gmail.com
 *                          contact: "+917509587122"
 *                          password: 12345678
 *      responses:
 *          200:
 *              description: the book description
 *          404:
 *              description : book doesnt found   
 */

 router.post("/verifyuser/:token",userControl.verifyUser)


/**
 * @swagger
 * /swagger/generateOTP:
 *  post:
 *      summary: LogIn 
 *      tags: [UserApis]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/login'
 *      responses:
 *          200:
 *              description: You logged in 
 *          403:
 *              description: email or pasword is wrong
 *          401:
 *              description:  unauthorized
 *          500:
 *              description: server error
 */ 
 router.post("/generateOTP",middleware.userPresent,userControl.generateOTP)

/**
 * @swagger
 * /swagger/login:
 *   post:
 *      summary: Verify Otp
 *      tags: [UserApis]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: 
 *                          - contact
 *                          - otp
 *                      properties:
 *                          contact:
 *                              type: string
 *                          otp:
 *                              type: string
 *                      example:
 *                          contact: "+917509587122"  
 *                          otp: "985553"                          
 *      responses:
 *         200:
 *           description: successfull
 *         401:
 *           description:  unauthorized
 *           
 */
 router.post("/login",Valid.verifiedUser,Valid.numberValid,userControl.loginUser)


/**
 * @swagger
 * /swagger/forgotpassword:
 *  post:
 *      summary: write your contact number to reset password
 *      tags: [UserApis]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: 
 *                          - contact    
 *                      properties:
 *                          contact: 
 *                              type: string
 *                      example: 
 *                          contact: "+917509587122"
 *      responses:
 *          200:
 *              description: the book description
 *          404:
 *              description : book doesnt found   
 */
 router.post("/forgotpassword",userControl.forgotPassword)


/**
 * @swagger
 * /swagger/verifyemail:
 *  post:
 *      summary: verify through email
 *      tags: [UserApis]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: 
 *                          - email    
 *                      properties:
 *                          email: 
 *                              type: string
 *                      example: 
 *                          email: "sam750958@gmail.com"
 *      responses:
 *          200:
 *              description: the book description
 *          404:
 *              description : book doesnt found   
 */
 

router.post("/verifyemail",userControl.sendMail)
module.exports = router
