import React,{ useEffect,useState,useContext } from "react"
import { UserContext } from '../../App'
import {useParams} from 'react-router-dom'

const Profile = () => {

    const [userProfile,setProfile] = useState(null)
    
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setShowfollow] = useState(state?!state.following.includes(userid):true)
    // console.log("id",userid)

    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Beware "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            setProfile(result)
        })
     },[])

    const followUser = () => {
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Beware "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        })
        .then(res=>res.json())
        .then(data => {
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowfollow(false)
        })
    }

    const unfollowUser = () => {
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Beware "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        })
        .then(res=>res.json())
        .then(data => {
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item!= data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowfollow(true)
        })
    }

    return(
        <React.Fragment>
        {userProfile ? 
            <div style={{maxWidth:"750px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style={{"height":"160px","width":"160px","borderRadius":"80px"}}
                        src={userProfile.user.pic} />
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h6>{userProfile.posts.length} posts</h6>
                        <h6>{userProfile.user.followers.length} Followers</h6>
                        <h6>{userProfile.user.following.length} Following</h6>
                    </div>
                    {showfollow ? 
                        <button style={{margin:"10px"}} className="btn waves-effect waves-light #1565c0 blue darken-4"
                        onClick={()=>followUser()}>
                            Follow
                       </button>
                    : 
                        <button style={{margin:"10px"}} className="btn waves-effect waves-light #1565c0 blue darken-4"
                        onClick={()=>unfollowUser()}>
                            unfollow
                        </button>
                    }
                    
                    
                
                </div>
            </div>
            <div className="gallery">
                {
                    userProfile.posts.map(item =>{
                        return (
                            <img className="item" key={item._id} src={item.photo} alt={item.title} />
                        )
                    })
                }          
            </div>
        </div>
        :
        <h2>Loading...! </h2> }
        
    </React.Fragment>
    )
}

export default Profile