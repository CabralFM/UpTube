import React, {useEffect, useState} from "react";
import axios from "axios";

export const Logout = () => {

    //const [user, setUser] = useState([]);
    const [user, setUser] = useState(null);

    const userData = {
        email: "jrochafonso@gmail.com", // email: values.email,
        password: "12345" // password: values.password,
    }

    useEffect( () => {
        axios.post(`http://localhost:3001/user/logout`)
            .then(response => {
                console.log(response.data)
                setUser(response.data)
            })
    }, []);

    return (
        <>user has logged out</>
    )
}