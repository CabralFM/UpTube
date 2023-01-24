/******* CARD/POPUP ACHIEVEMENT *******/

import axios from "axios";
import {useState} from "react";
import {convertIsoToDate} from "../../../utils/auxiliarMethods";
import Popup from "../popup/popup";
import "./achievement.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faTrophy,
    faMedal,
    faCrown,
    faHeart,
    faUsers,
    faPlay,
    faUserGroup,
    faUserSecret,
    faFaceAngry,
    faLock,
    faEye,
    faEyeSlash
} from "@fortawesome/free-solid-svg-icons";

// TODO: aplicar fadein na animação de entrada do popup.

// ----- Array of possible achievements:
// * Adoram-me!
// * Influencer!
// * Rising star!
// * Socialite!
// * Só a começar!
// * Seguidor
// * Stalker
// * Anti-social

function Achievement(props) {

    // ----- Props:
    // * props.locked: array of locked achievements;
    // * props.unlocked: array of unlocked achievements:
    // * props.type: switch code definitions to locked/unlocked;
    // * props.edit: switch code definitions to set unlocked achievements visibility.

    // ----- Button to active popup with achievement details:
    const [buttonPopup, setButtonPopup] = useState(false);

    // ----- Set unlocked achievements visibility:
    // * Receives 0 and 1 from the database and transforms it into a boolean value:
    const [visible, setVisible] = useState(props.visible === 1 ? true : false);

    const handleVisibility = async () => {
        let auxVisible = !visible
        //console.log("get visible:", visible);
        setVisible(!visible);
        //console.log("set visible:", visible);
        if (auxVisible) { // Set visible
            axios.post(`http://localhost:3001/achievements/disclose/${props.id}`)
                .then(response => {
                    //console.log("show", response.data);
                })
        } else { // Set invisible
            axios.post(`http://localhost:3001/achievements/hide/${props.id}`)
                .then(response => {
                    //console.log("hide", response.data);
                })
        }
    };

    return <>
        {/**** SMALL ACHIEVEMENT CARD ***/}
        <div className={"achievement-container"}>
            {/* LOCKED ICON */}
            {props.type === "locked" &&
                <FontAwesomeIcon icon={faLock} className={"icon locked"} onClick={() => setButtonPopup(true)}/>}

            {/* EDIT ICON */}
            {props.edit === true && props.type === "unlocked" && <>
                {visible ?
                    <FontAwesomeIcon icon={faEye} className={"icon-visibility"} onClick={handleVisibility}/> :
                    <FontAwesomeIcon icon={faEyeSlash} className={"icon-visibility"} onClick={handleVisibility}/>
                }
            </>}

            {/* UNLOCKED ICON */}
            {props.type === "unlocked" && props.title === "Adoram-me!" &&
                <FontAwesomeIcon icon={faHeart} className={visible ? `icon level-${props.level}` : `icon disabled`}
                                 onClick={() => setButtonPopup(true)}/>}
            {props.type === "unlocked" && props.title === "Influencer!" &&
                <FontAwesomeIcon icon={faCrown} className={visible ? `icon level-${props.level}` : `icon disabled`}
                                 onClick={() => setButtonPopup(true)}/>}
            {props.type === "unlocked" && props.title === "Rising star!" &&
                <FontAwesomeIcon icon={faMedal} className={visible ? `icon level-${props.level}` : `icon disabled`}
                                 onClick={() => setButtonPopup(true)}/>}
            {props.type === "unlocked" && props.title === "Socialite!" &&
                <FontAwesomeIcon icon={faUsers} className={visible ? `icon level-${props.level}` : `icon disabled`}
                                 onClick={() => setButtonPopup(true)}/>}
            {props.type === "unlocked" && props.title === "Só a começar!" &&
                <FontAwesomeIcon icon={faPlay} className={visible ? `icon level-${props.level}` : `icon disabled`}
                                 onClick={() => setButtonPopup(true)}/>}
            {props.type === "unlocked" && props.title === "Seguidor" &&
                <FontAwesomeIcon icon={faUserGroup} className={visible ? `icon level-${props.level}` : `icon disabled`}
                                 onClick={() => setButtonPopup(true)}/>}
            {props.type === "unlocked" && props.title === "Stalker" &&
                <FontAwesomeIcon icon={faUserSecret} className={visible ? `icon level-${props.level}` : `icon disabled`}
                                 onClick={() => setButtonPopup(true)}/>}
            {props.type === "unlocked" && props.title === "Anti-social" &&
                <FontAwesomeIcon icon={faFaceAngry} className={visible ? `icon level-${props.level}` : `icon disabled`}
                                 onClick={() => setButtonPopup(true)}/>}
            {/* ACHIEVEMENT TITLE */}
            <h3 className={`${visible || props.type === "locked" ? "" : "title-disable"}`}>{props.title}</h3>
        </div>

        {/*** ACHIEVEMENT POPUP ***/}
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
            {/* ACHIEVEMENT TITLE */}
            <h1>{props.title}</h1>
            {/* ACHIEVEMENT MAIN ICON - TROPHY */}
            <FontAwesomeIcon icon={faTrophy}
                             className={props.type === "unlocked" ? `achievement-main-icon level-${props.level}` : `achievement-main-icon level-${props.max_level}`}/>
            {/* ACHIEVEMENT ICON */}
            <div className={"icon-container"}>
                {props.type === "locked" && <FontAwesomeIcon icon={faLock} className={"icon"}/>}
                {props.type === "unlocked" && props.title === "Adoram-me!" &&
                    <FontAwesomeIcon icon={faHeart} className={`icon`}/>}
                {props.type === "unlocked" && props.title === "Influencer!" &&
                    <FontAwesomeIcon icon={faCrown} className={`icon`}/>}
                {props.type === "unlocked" && props.title === "Rising star!" &&
                    <FontAwesomeIcon icon={faMedal} className={`icon`}/>}
                {props.type === "unlocked" && props.title === "Socialite!" &&
                    <FontAwesomeIcon icon={faUsers} className={`icon`}/>}
                {props.type === "unlocked" && props.title === "Só a começar!" &&
                    <FontAwesomeIcon icon={faPlay} className={`icon`}/>}
                {props.type === "unlocked" && props.title === "Seguidor" &&
                    <FontAwesomeIcon icon={faUserGroup} className={`icon`}/>}
                {props.type === "unlocked" && props.title === "Stalker" &&
                    <FontAwesomeIcon icon={faUserSecret} className={`icon`}/>}
                {props.type === "unlocked" && props.title === "Anti-social" &&
                    <FontAwesomeIcon icon={faFaceAngry} className={`icon`}/>}
            </div>
            {/* UNLOCKED DATE */}
            {props.type === "unlocked" &&
                <span className={"date"}>Desbloqueado a {convertIsoToDate(props.date)}</span>}
            {/* MORE INFO */}
            <div className={"info-container"}>
                <h2>Mais informações</h2>
                {/* DESCRIPTION */}
                <h3>{props.description}</h3>
                {/* MAX LEVEL (LOCKED) */}
                {props.type === "locked" && <>
                    <h2>Nivel máximo</h2>
                    {props.max_level === 1 && <h3>Bronze</h3>}
                    {props.max_level === 2 && <h3>Prata</h3>}
                    {props.max_level === 3 && <h3>Ouro</h3>}
                </>}
                {/* CURRENT LEVEL (UNLOCKED) */}
                {props.type === "unlocked" && <>
                    <h2>Nivel atual</h2>
                    {props.level === 1 && <h3>Bronze (1/{props.max_level})</h3>}
                    {props.level === 2 && <h3>Prata (2/{props.max_level})</h3>}
                    {props.level === 3 && <h3>Ouro (3/{props.max_level})</h3>}
                </>}
                {/* ACHIEVEMENT VISIBILITY (UNLOCKED) */}
                {props.type === "unlocked" && <div>
                    <h2>Visibilidade</h2>
                    <FontAwesomeIcon icon={props.visible === 1 ? faEye : faEyeSlash} className={"icon-visibility"}/>
                </div>}
            </div>
        </Popup>
    </>
}

export default Achievement;