const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requireLogin')


router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
        .populate("postedBy","_id name pic")
        .populate("comments.postedBy","_id name")
        .sort("-createdAt")
        .then(posts =>{
            res.json({posts})
        })
        .catch(err => {
            console.log(err);
            
        })
})

router.get('/allSubscribePost',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
        .populate("postedBy","_id name pic")
        .populate("comments.postedBy","_id name")
        .sort("-createdAt")
        .then(posts =>{
            res.json({posts})
        })
        .catch(err => {
            console.log(err);
            
        })
})

router.post('/createPost',requireLogin,(req,res)=>{
    const {title,body,pic} = req.body
    if(!title || !body || !pic){
        return res.status(422).json({error:"Please add all fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save()
        .then(result =>{
            res.json({post:result})
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
        .populate("postedBy","_id name")
        .then(mypost =>{
            res.json({mypost})
        })
        .catch(err=>{
            console.log(err);
            
        })
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment  = {
        text:req.body.text,
        postedBy:req.user._id,
        createdAt:Date.now()
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .sort("-createdAt")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            console.log("comment",result)
            res.json(result)
        }
    })
})

router.delete('/deletePost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
        .populate("postedBy","_id")
        .exec((err,post)=>{
            if(err || !post){
                return res.status(422).json({error:err})
            }
            //toString is used becz we are comparing two Objects(type of postedVy is RbjectId)
            if(post.postedBy._id.toString() === req.user._id.toString()){
                post.remove()
                .then(result => {
                    res.json(result)
                })
                .catch(err => {
                    console.log(err)
                })
            }
        })
})

// router.delete('/deleteComment/:postId/:commentId',requireLogin,(req,res)=>{
//     Post.findOne({_id:req.params.postId,"comments._id":req.params.commentId})
//     .exec((err,result)=>{
//         if(err){
//             return res.status(422).json({error:err})
//         }
//         else{
//             console.log("comment", result.comments)
//             // res.json(result)
            
            
//         }
//     })
// })


router.delete('/deleteComment/:postId/:commentId',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate({_id:req.params.postId},
        {$pull:{"comments":{_id:req.params.commentId}}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .exec((err,result) => {
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

module.exports = router