/******* SUBSCRIPTION CARD *******/

import "./channel.scss";
import {Link} from "react-router-dom";
import {convertIsoToDate} from "../../../utils/auxiliarMethods";

function Channel(props) {

    // ### props.type:
    // - "subscriptions page"
    // - "channels page"

    return <Link to={"/user/" + props.id} className={"subscription-container"} key={props.id}>
        <div className={"avatar"}
             style={{backgroundImage: `url('${props.avatar}')`}}>
        </div>
        <div className={"info-container"}>
            <h3 className={"name"}>{props.name}</h3>
            <h3 className={"username"}>@{props.username}</h3>
            {props.type === "subscriptions page" ?
                <h3 className={"date"}>Subscrição: {convertIsoToDate(props.date)}</h3> :
                <h3 className={"date"}>Registo: {convertIsoToDate(props.date)}</h3>
            }
        </div>
        <div className={"banner"}
             style={{backgroundImage: `url('${props.banner}')`}}>
        </div>
        <div className={"banner-overlay"}/>
    </Link>
}

export default Channel;