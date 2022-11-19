import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { AuthContext } from "../../_app";

const Login = () => {
    const { user, setUserData } = useContext(AuthContext); 
    const [ email, setEmail ] = useState()
    const [ password, setPassword ] = useState()
    const [ error, setError ] = useState()
    const [ submitSuccess, setSubmitSuccess ] = useState(false)
    const [ validEmail, setValidEmail ] = useState(true)
    const [ validPassword, setValidPassword ] = useState(true)
    const [ validName, setValidName ] = useState(true)

    const onSubmit = (e) => {
        e.preventDefault()
        // Get formdata from submit event
        const formData = Object.fromEntries(new FormData(e.target).entries())
        const errors = validateFormData(formData)
        if(errors) return
        const options = {
            method: 'POST',
            mode: 'same-origin',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }
        fetch('/api/auth',options)
        .then(response => response.json())
        .then(data => {
            if(!data.success) {
                setError(data.message)
            }else{
                if(data.success){
                    document.cookie = `jwt_token=${data.jwt_token}; path=/; max-age=86400; SameSite=Lax;`
                    fetch('/api/user/infos')
                    .then(res=>res.json())
                    .then(data=>setUserData(data.user))
                    setSubmitSuccess(true)
                    Router.push('/')
                }
            }
        })
        .catch(err => console.log(err))
    }

    const validateFormData = (formData) => {
        let errors = 0
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        // Check email
        if(formData.email.match(mailformat)){
            setValidEmail(true)
        }else{
            setValidEmail(false)
            errors++
        }
        if(errors>0)return true
    }

    useEffect(()=>{console.log(user)},[])
    
    return(
        <main className="container">
            <div className="login-card-wrapper">
                <h1>Login</h1>
                <form onSubmit={(e)=>onSubmit(e)}>
                    <div className="form-group">
                        <label for="email">Email</label>
                        <input className="input-text" name="email" type="email" placeholder="email@hotmail.com" onChange={(e)=>setEmail(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label for="password" >Password</label>
                        <input className="input-text" name="password" type="password" onChange={(e)=>setPassword(e.target.value)} required/>
                    </div>
                    <p>no account ? <Link href='/users/signup' legacyBehavior><a>Sign Up</a></Link></p>
                    <button className="button-1">Login</button>
                </form>
            </div>
            {error ? alert(error):null}
            {submitSuccess ? alert("inscription done successfully"):null}
        </main>
    )
}

export default Login