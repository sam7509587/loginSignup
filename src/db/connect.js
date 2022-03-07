require('dotenv').config()
const mongoose =require("mongoose")
mongoose.connect(process.env.db)
.then(()=>{
    console.log("Db connnected....")
}).catch((err)=>{
    console.log("not connnected because : ",err)
})
