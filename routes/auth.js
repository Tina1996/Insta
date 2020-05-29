const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const crypto = require("crypto")
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {JWT_SECRETS} = require("../config/keys")
const requireLogin = require("../middleware/requireLogin")

const nodemailer = require("nodemailer")
const sendgridTransport = require("nodemailer-sendgrid-transport")
const {SENDGRID_API,EMAIL} = require('../config/keys')

//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

// router.get('/protected',requireLogin,(req,res)=>{
//     res.send("hello user")
// })

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))

router.post('/signup',(req,res)=>{
    const { name,email,password,pic } = req.body
    if(!email || !password || !name){
        return res.status(422).json({error:"Please add all fields"})
    }
    User.findOne({email:email})
        .then(savedUser => {
            if(savedUser){
                return res.status(422).json({error:"User already exists"})
            }
            bcrypt.hash(password,12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password:hashedPassword,
                        name,
                        pic:pic               
                    })
                    user.save()
                        .then(user => {
                            transporter.sendMail({
                                to:user.email,
                                from:"ankichandekar@gmail.com",
                                subject:"Signup success",
                                html:"<h1>Welcome</h1>"
                            })
                            res.json("Saved Successfully")
                        })
                        .catch(err =>{
                            console.log(err)
                        })
                }) 
        })
        .catch(err=>{
            console.log(err)
        })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"Please add email or Password"})
    }
    User.findOne({email:email})
        .then(savedUser=>{
            if(!savedUser){
                return res.status(422).json({error:"Invalid email or password"})
            }
            bcrypt.compare(password,savedUser.password)
                .then(doMatch => {
                    if(doMatch){
                        //res.json({message:"Successfully, Signed in"})
                        const token = jwt.sign({_id:savedUser._id},JWT_SECRETS)
                        const {_id,name,email,followers,following,pic} = savedUser
                        res.json({token:token,
                        user:{email,_id,name,followers,following,pic}})
                    }
                    else{
                        return res.status(422).json({error:"Invalid email or password"})
                    }
                })
                .catch(err => {
                    console.log(err);
                    
                })
        })
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                res.status(422).json({error:"User not exist"})
            }
            user.resetToken = token,
            user.expireToken = Date.now() + 3600000 //valid for 1 hour
            user.save().then(result=>{
                transporter.sendMail({
                    to:user.email,
                    from:"ankichandekar@gmail.com",
                    subject:"Password Reset",
                    html:`
                    <p>Yor are requested password reset</p>
                    <h5>Click on this <a href="${EMAIL}/reset/${token}">link</a>  to reset</h5>
                    `
                })
                res.json({message:"Check email"})
            })
        })
    })
})

router.post('/new-password',(req,res)=>{
    const newpassword = req.body.password
    const senttoken = req.body.token
    User.findOne({resetToken:senttoken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Session expired...Try again"})
        }
        bcrypt.hash(newpassword,12).then(hashedPassword=>{
            user.password=hashedPassword
            user.resetToken=undefined
            user.expireToken=undefined
            user.save().then(saveduser=>{
                res.json({message:"Password updated"})
            })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router