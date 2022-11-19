import React, { useEffect, useState } from "react";
import Link from "next/link";

const Singup = () => {
    const [ name,setName ] = useState()
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
        fetch('/api/users',options)
        .then(response => response.json())
        .then(data => {
            if(!data.success) {
                setError(data.message)
            }else{
                setSubmitSuccess(true)
            }
        })
        .catch(err => console.log(err))
    }

    const validateFormData = (formData) => {
        let errors = 0
        /**
         * Regex password validation
         * 1. At least one Uppercase letter
         * 2. At least one special charactere (!@#$&*)
         * 3. At least one digit
         * 4. At least one Lowercase letter
         * 5. A lenght of 8 minimum
         */
        const passwordFormat = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,25}$/
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const nameFormat = /^[a-zA-Z]+$/;
        // Check name
        if(formData.name.match(nameFormat) && formData.name.length > 2){
            setValidName(true)
        }else{
            setValidName(false)
            errors++
        }
        // Check email
        if(formData.email.match(mailformat)){
            setValidEmail(true)
        }else{
            setValidEmail(false)
            errors++
        }
        // Check password
        if(formData.password.match(passwordFormat)){
            setValidPassword(true)
        }else{
            setValidPassword(false)
            errors++
        }
        if(errors>0)return true
    }

    useEffect(()=>{
        console.log(error)
    },[error])

    return(
        <main className="container">
            <div className="login-card-wrapper">
                <h1>Sign up</h1>
                <form onSubmit={(e)=>onSubmit(e)} method='POST'>
                    <div className="form-group">
                        <label for="name">Nom</label>
                        {!validName ? (<span className="error">Le nom n'est pas valide</span>) : null}
                        <input className={`input-text ${!validName ? "error" : ""}`} name="name" type="text" onChange={(e)=>setName(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label for="email">Email</label>
                        {!validEmail ? (<span className="error">L'email n'est pas valide</span>) : null}
                        <input className={`input-text ${!validEmail ? "error" : ""}`} name="email" type="email" onChange={(e)=>setEmail(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label for="password">Mot de passe</label>
                        {!validPassword ? (<span className="error">Le mot de passe doit contenir au moins une majuscule et une minuscule, un charactere spécial (!@#$&*), un chiffre, et doit avoir une longueur de 8 characteres minimum</span>) : null}
                        <input className={`input-text ${!validPassword ? "error" : ""}`} name="password" type="password" onChange={(e)=>setPassword(e.target.value)} required/>
                    </div>
                    <span>Vous possédez déjà un compte ? <Link href="/users/login" legacyBehavior><a>Se connecter</a></Link></span>
                    <button className="button-1" type="submit">Envoyer</button>
                </form>
            </div>
            {error ? alert(error):null}
            {submitSuccess ? alert("inscription done successfully"):null}
        </main>
    )
}

export default Singup