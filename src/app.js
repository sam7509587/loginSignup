const { urlencoded } = require("express")
const express = require("express")
require("./db/connect")
require('dotenv').config()
const swaggerUi = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")

const app = express()

const router = require("./routes/router.js")
const swaggerDocument = require("./routes/swagger")
const port = process.env.PORT || 7000


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "OtpApi",
            version: "1.0.0",
            description: "a simple users api"
        },
        servers: [
            {
                url: `http://127.0.0.1:${port}`
            }
        ]
    },
    apis: ["*/routes/swagger.js"]
}
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use("/", router)
app.use("/swagger", swaggerDocument)
app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}/api-docs/swagger`)
})
