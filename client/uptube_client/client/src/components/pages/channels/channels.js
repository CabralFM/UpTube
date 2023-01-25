/******* CHANNELS PAGE *******/

import "./channels.scss";
import {useEffect, useState} from "react";
import Channel from "../../card/channel/channel";
import axios from "axios";

function Channels() {

    const [users, setUsers] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/user/all`)
            .then(response => {
                setUsers(response.data.users);
            })
    }, []);

    return <div className={"channels-page-container"}>
        <div className={"channels-container"}>
            <h1>Canais</h1>
            {!users && <p>Loading</p>}
            {users && <>
                {users.length === 0 && <p>No results.</p>}
                {users.map(user => <Channel
                    key={user.id}
                    id={user.id}
                    avatar={user.avatar}
                    banner={user.banner}
                    name={user.name}
                    username={user.username}
                    date={user.registered}
                    type={"channel page"}
                />)}
            </>}
        </div>
    </div>
}

export default Channels;