import React,{useState, useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
    const history = useHistory()
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)

    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])

    const uploadPic = () => { 
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

    const uploadFields = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"Invalid Email",classes:"#b71c1c red darken-4"})
            return
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
        }).then(res => res.json())
        .then(data => {
           if(data.error){
                M.toast({html: data.error,classes:"#b71c1c red darken-4"})
           }
           else{
                M.toast({html: data,classes:"#81c784 green lighten-2"})
                history.push('/signin')
           }
        }).catch(err=>{
            console.log(err);
            
        })
    }

    const postData = () => {
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
        
    }

    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input 
                    type="text"
                    placeholder="Name"
                    value = {name}
                    onChange = {(e) => {setName(e.target.value)}}
                    />
                <input 
                    type="text"
                    placeholder="Email"
                    value = {email}
                    onChange = {(e) => {setEmail(e.target.value)}}
                    />
                <input 
                    type="password"
                    placeholder="Password"
                    value = {password}
                    onChange = {(e) => {setPassword(e.target.value)}}
                    />

                <div className="file-field input-field">
                    <div className="btn  #1565c0 blue darken-4">
                        <span>Upload Pic</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="Upload one or more files" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #1565c0 blue darken-4" onClick={()=>postData()}>Signup</button>
                <h6>
                    <Link to="/signin">Already have an Account ?</Link>
                </h6>
            </div>
        </div>
    )
}

export default Signup