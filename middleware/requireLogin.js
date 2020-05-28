const jwt = require("jsonwebtoken")
const {JWT_SECRETS} = require("../config/keys")
const mongoose = require("mongoose")
const User = mongoose.model("User")

module.exports = (req,res,next) =>{
    const { authorization } = req.headers
    //authorization == "Beware anki"
    if(!authorization){
        return res.status(401).json({error:"You must logged in"})
    }
    const token = authorization.replace("Beware ","")
    jwt.verify(token,JWT_SECRETS,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"You must logged in"})
        }
        const {_id} = payload
        User.findById(_id)
            .then(userData =>{
                req.user = userData
                next()
            })   
    })
}