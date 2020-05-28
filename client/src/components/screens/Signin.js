import React,{useState,useContext} from 'react'
import { Link ,useHistory } from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Signin = () => {
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")

    const postData = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"Invalid Email",classes:"#b71c1c red darken-4"})
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            
           if(data.error){
                M.toast({html: data.error,classes:"#b71c1c red darken-4"})
           }
           else{
               localStorage.setItem("jwt",data.token)
               localStorage.setItem("user",JSON.stringify(data.user))
               dispatch({type:"USER",payload:data.user})
                M.toast({html: "Successfully Signed In",classes:"#81c784 green lighten-2"})
                history.push('/')
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
                <button className="btn waves-effect waves-light #1565c0 blue darken-4" onClick={()=>postData()}>Login</button>
                <h6>
                    <Link to="/signup">Don't have an Account ?</Link>
                </h6>
                <h6>
                    <Link to="/reset">Forget Password</Link>
                </h6>
            </div>
        </div>
    )
}

export default Signin