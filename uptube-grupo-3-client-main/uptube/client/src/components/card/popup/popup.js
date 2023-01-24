/******* POPUP COMPONENT *******/

import "./popup.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";

function Popup(props) {

    return (props.trigger) ?
        (<div className={"popup"}>
            <div className={"popup-inner"}>
                <div className={"close-btn"} onClick={() => props.setTrigger(false)}><FontAwesomeIcon icon={faClose}/></div>
                {props.children}
            </div>
        </div>) : "";
}

export default Popup;