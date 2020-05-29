const express = require("express")
const app = express()
const mongoose = require("mongoose")
PORT = process.env.PORT || 5000
// const {MONGOURI} = require('./config/keys')
//gwsDV8Z3xpwGrcGA
const url = "mongodb://localhost:27017/instareact";

mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected',()=>{
    console.log("connected yeaah");
})

mongoose.connection.on("error",(err)=>{
    console.log("error connection",err)
})


require('./models/user')
require('./models/post')


app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log("Server Started at PORT",PORT)
})