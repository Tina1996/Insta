import React,{useState,useEffect,useContext } from 'react'
import { UserContext} from '../../App'
import { Link } from 'react-router-dom'

const Home = () => {
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)

    useEffect(()=>{
        fetch("/allSubscribePost",{
            headers:{
                Authorization:"Beware "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log("result",result);
            
            setData(result.posts)
        })
    },[])

    const likePost = (id) => {
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Beware "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res => res.json())
        .then(result => {
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const unlikePost = (id) => {
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Beware "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text,postId) => {
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Beware "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:postId,
                text:text
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log(err)
        })
    }

    const deletePost = (postId) => {
        fetch(`/deletePost/${postId}`,{
            method:"delete",
            headers:{
                Authorization:"Beware "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            // console.log("Delete",result)
            const newData = data.filter(item =>{
                return item._id != result._id
            })
            setData(newData)
        })
    }

    const deleteComment = (postId,commentId) => {
        fetch(`/deleteComment/${postId}/${commentId}`,{
            method:"delete",
            headers:{
                Authorization:"Beware "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            const newData1 = data.map(item=>{
                if(item._id==result._id){
                    // console.log("res",result)
                    return result
                }else{
                    return item
                }
            })
            setData(newData1)
        }).catch(err => {
            console.log(err)
        })
    }

    return(
        <div className="home">
            {
                data.map(item => {
                    return(
                        <div className="card home-card" key={item._id}>
                            <h5><img src={item.postedBy.pic}  className="profile"/><Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}><span style={{margin:"auto",verticalAlign:"50%"}}> {item.postedBy.name}</span></Link>
                            {item.postedBy._id == state._id && <i className="material-icons" 
                                style={{float:"right"}} 
                                onClick={()=>{deletePost(item._id)}}>
                                delete</i>
                            }
                            
                            </h5>
                            <div className="card-image">
                                <img src={item.photo}/>
                            </div>
                            <br></br>
                            <div className="card-contain">
                                <i className="material-icons" style={{color:"red"}}>favorite</i>
                                {
                                    item.likes.includes(state._id) 
                                        ? 
                                        <i className="material-icons"
                                        onClick={()=>{unlikePost(item._id)}}>
                                            thumb_down</i> 
                                        : 
                                        <i className="material-icons" 
                                        onClick={()=>{likePost(item._id)}}>
                                            thumb_up</i>
                                } 
                               <h6>{item.likes.length} likes</h6>
                               <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        // console.log("comment",record)
                                        return(
                                        <h6 key={record._id}><span style={{fontWeight:"600"}}>{record.postedBy.name} </span>{record.text} {record.postedBy._id === state._id && <i className="tiny material-icons" onClick={()=>{deleteComment(item._id,record._id)}} >delete</i>} </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    console.log("item",item)
                                    makeComment(e.target[0].value,item._id)
                                }}>
                                    <input type="text" placeholder="Add a commont"/>
                                </form>
                            </div>
                        </div>           
                    )
                })
            }

            
        </div>
    )
}

export default Home