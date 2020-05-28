import React,{useState,useEffect} from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'


const CreatePost = () => {
    const history = useHistory()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")

    useEffect(()=>{
        if(url){
        fetch("/createPost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Beware "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:url
            })
        }).then(res => res.json())
        .then(data => {           
           if(data.error){
                M.toast({html: data.error,classes:"#b71c1c red darken-4"})
           }
           else{
                M.toast({html: "Created Post Successfully",classes:"#81c784 green lighten-2"})
                history.push('/')
           }
        }).catch(err=>{
            console.log(err);
            
        })
    }
    },[url])

    const postData = () => { 
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","ankita1960")
        fetch("https://api.cloudinary.com/v1_1/ankita1960/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data =>{
            setUrl(data.url)
        })
        .catch(err => {
            console.log(err)
        })

    }

    return(
        <div className="card input-field" 
            style={{
                margin:"30px auto",
                padding:"20px",
                maxWidth:"500px",
                textAlign:"center"   
            }}
            >
            <input 
                type="text" 
                placeholder="title"
                value={title}
                onChange={(e)=>{setTitle(e.target.value)}}
                />
            <input 
                type="text" 
                placeholder="body"
                value={body}
                onChange={(e)=>{setBody(e.target.value)}}
                />
            <div className="file-field input-field">
                <div className="btn  #1565c0 blue darken-4">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} multiple />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload one or more files" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #1565c0 blue darken-4"
            onClick={()=>{postData()}}>Submit Post</button>
        </div>
    )
}

export default CreatePost