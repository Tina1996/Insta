const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema.Types
// const url = "mongodb://localhost:27017/FlightBooking_DB"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
        type:String,
        default:"https://res.cloudinary.com/ankita1960/image/upload/v1590236835/noimage_tf1vcd.jpg"
    },
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    following:[{
        type:ObjectId,
        ref:"User"
    }]
})


mongoose.model("User",userSchema)