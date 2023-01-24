/******* SUBSCRIPTIONS PAGE *******/

import "./subscriptions.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import Channel from "../../card/channel/channel";
import {useSession} from "../../../providers/UserContext";

function Subscriptions() {

    const session = useSession(); // User with login
    const [subscriptions, setSubscriptions] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/user/${session?.user?.id}/subscriptions`)
            .then(response => {
                setSubscriptions(response.data.subscriptions);
            })
    }, [session?.user?.id]);

    return <div className={"subscriptions-page-container"}>
        <h1>Subscrições</h1>
        {!subscriptions && <p>Loading</p>}
        {subscriptions && <>
            {subscriptions.length === 0 && <p>No results.</p>}
            {subscriptions.map(subscription => <Channel
                key={subscription.id}
                id={subscription.id}
                avatar={subscription.avatar}
                banner={subscription.banner}
                name={subscription.name}
                username={subscription.username}
                date={subscription.date}
                type={"subscriptions page"}
            />)}
        </>}
    </div>
}

export default Subscriptions;