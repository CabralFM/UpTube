/******* DEFINITIONS PAGE *******/

import "./definitionsCard.scss";
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleUp} from "@fortawesome/free-solid-svg-icons";

function DefinitionsCard(props) {

    const [open, setOpen] = useState(false);

    // Open div:
    const handleOpen = async () => {
        setOpen(!open);
    };

    return <div className={"definitions-card-container"}>
        <div className={"header-container"}>
            <h3>{props.title}</h3>
            <FontAwesomeIcon className={"icon"} icon={open ? faAngleUp : faAngleDown}
                             onClick={handleOpen}/>
        </div>
        <div style={{display: open ? '' : 'none'}}>
            <span className={"line"}/>
            {props.children}
        </div>
    </div>
}

export default DefinitionsCard;





