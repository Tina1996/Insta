import React,{useState,useContext} from 'react'
import { Link ,useHistory,useParams } from 'react-router-dom'

import M from 'materialize-css'

const Signin = () => {
 
    const history = useHistory()
    const [password,setPassword] = useState("")
    const {token} = useParams()
    console.log(token)

    const postData = () => {
        
        fetch("/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token:token
            })
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            
           if(data.error){
                M.toast({html: data.error,classes:"#b71c1c red darken-4"})
           }
           else{
               
                M.toast({html: data.message,classes:"#81c784 green lighten-2"})
                history.push('/signin')
           }
        }).catch(err=>{
            console.log(err);
            
        })
    }

    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input 
                    type="password"
                    placeholder="Enter a new Password"
                    value = {password}
                    onChange = {(e) => {setPassword(e.target.value)}}
                    />
                <button className="btn waves-effect waves-light #1565c0 blue darken-4" 
                onClick={()=>postData()}>Update Password</button>
            </div>
        </div>
    )
}

export default Signin