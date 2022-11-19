import React, { useContext, useEffect } from "react"
import Router from "next/router"
import { AuthContext } from "../../_app"

const Logout = () => {
    const { setUserData } = useContext(AuthContext)
    useEffect(()=>{
        setUserData(null)
        document.cookie = 'jwt_token=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        Router.push('/users/login')
    },[])
}

export default Logout