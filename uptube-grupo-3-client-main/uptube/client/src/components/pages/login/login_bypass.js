import React, {useEffect, useState} from "react";
import axios from "axios";
import "./login_bypass.scss";
import {useSession} from "../../../providers/UserContext";

export const Login_bypass = () => {

    //const [user, setUser] = useState([]);
   const {refresh}=useSession();

    const userData = {
        //email: "jrochafonso@gmail.com", // email: values.email,
        email: "wildnature@mail.com", // email: values.email,
        //password: "12345" // password: values.password,
        password: "wildnature" // password: values.password
    }

    useEffect(() => {
        axios.post(`http://localhost:3001/user/login`, userData, {
            withCredentials: true
        })
            .then(res => {
                console.log(res.data.user[0])
                console.log(res.data.user)
                refresh()
            })
    }, []);

    return (
        <div className={"login-bypass"}>user has LOGGED IN :)</div>
    )
}