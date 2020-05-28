import React,{useContext,useRef,useEffect,useState} from 'react'
import { Link,useHistory } from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
const Navbar = () => {
    const searchmodal = useRef(null)
    const history = useHistory()
    const [search,setSearch]=useState("")
    const [userDetails,setUserDetails]=useState([])
    const {state,dispatch} = useContext(UserContext)

    useEffect(()=>{
        M.Modal.init(searchmodal.current)
    },[])

    const renderList = () => {
        if(state){
            return[
                <li key="1"><i className="material-icons modal-trigger" data-target="modal1" style={{color:"black"}}>search</i></li>,
                <li key="2"><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/create">Create Post</Link></li>,
                <li key="4"><Link to="/myfollowingposts">My Following Post</Link></li>,
                <li key="5">
                    <button className="btn #303f9f indigo darken-2" onClick={()=>{
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        history.push('/signin')
                    }}>
                        Logout
                    </button>
                </li>
            ]
        }else{
            return[
                <li key="6"><Link to="/signin">Signin</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    const fetchUsers = (query) => {
        setSearch(query)
        fetch('/search-users',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                query:query
            })
        }).then(res=>res.json())
        .then(results=>{
            // console.log(results)
            setUserDetails(results.user)
        })
    }

    return(
        <nav>
            <div className="nav-wrapper white">
            <Link to={state?'/':"/signin"} className="brand-logo left">Instagram</Link>
            <ul id="nav-mobile" className="right">
                {renderList()}
            </ul>
            </div>

            {/* <!-- Modal Structure --> */}
            <div id="modal1" className="modal" ref={searchmodal} style={{color:"black"}}>
                <div className="modal-content">
                <input 
                    type="text"
                    placeholder="search users"
                    value = {search}
                    onChange = {(e) => {fetchUsers(e.target.value)}}
                    />
                    <ul className="collection">
                        {userDetails.map(item=>{
                            return <Link key={item._id} to={item._id !== state._id ? "/profile/"+item._id:"/profile"} onClick={()=>{
                                M.Modal.getInstance(searchmodal.current).close()
                                setSearch("")
                            }}><li class="collection-item">{item.email}</li></Link>
                        })}
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" 
                    onClick={()=>{setSearch('')}}>Close</button>
                </div>
            </div>
  </nav>
    )
}

export default Navbar