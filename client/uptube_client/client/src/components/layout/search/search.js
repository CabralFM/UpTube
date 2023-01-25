/******* SEARCH BAR *******/

import "./search.scss";
import logo from "./../../../images/logo.svg"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";
import {faBell, faCircleUser} from "@fortawesome/free-regular-svg-icons";
import {Link} from "react-router-dom";
import {useNavbar} from "../../../providers/NavbarContext";
import InputSearch from "../../card/inputSearch/inputSearch";
import {useSession} from "../../../providers/UserContext";
import axios from "axios";
import {useEffect, useState} from "react";
import Achievement from "../../card/achievement/achievement";
import React from "react";

function Search() {
    const {navbarActive, setNavbarActive, uiHidden} = useNavbar();
    const session = useSession();
    const id_user = useSession();
    const [notifications, setNotifications] = useState([]);
    const [openNotifications, setOpenNotifications] = useState(false);

    const handleNotifications = (e) => {
        axios.get(`http://localhost:3001/notification/get-notifications-bell`,
            {
                withCredentials: true
            })
            .then(res => {
                setNotifications(res.data.notifications);
                console.log(notifications)
            }).catch((e) => {
            console.log("erro", e)
        })
    }

    useEffect(() => {
        handleNotifications();
    }, [id_user])

    // Edit page:
    const handleOpenNotifications = async () => {
        setOpenNotifications(!openNotifications);
    };

    return <div className={"search-container" + (uiHidden ? " hidden" : "")}>
        {/** MENU **/}
        <div className={"menu-mobile-container"} onClick={(_e) => {
            navbarActive ? setNavbarActive(false) : setNavbarActive(true)
        }}>
            <div className={"line"}/>
            <div className={"line"}/>
            <div className={"line"}/>
        </div>
        {/** LOGO **/}
        <Link to={"/homepage"}>
            <img src={logo} alt="logo"/>
        </Link>
        {/** SEARCH **/}
        <div className={"input-search-container"}>
            <InputSearch/>
        </div>
        {/** NOTIFICATIONS **/}
        {session?.user?.id && <div className={"notification-container"}>
            <div className={"bell-container"} onClick={handleOpenNotifications}>
                <FontAwesomeIcon icon={faBell} className={"faBell"}/>
            </div>
            <div className={"avatar"}
                 style={{backgroundImage: `url('${session?.user?.avatar}')`}}>
            </div>
            {/*<FontAwesomeIcon icon={faCaretDown} className={"faCaretDown"}/>*/}
        </div>}
        {/** NOTIFICATIONS WINDOW**/}
        {session?.user?.id && openNotifications && <div className={"notification-container-click"}>
            <h3>Notificações</h3>
            <div className={"notifications"}>
                {!notifications && <p>A carregar...</p>}
                {notifications && <>
                    {notifications.length === 0 && <p>Sem resultados</p>}
                    {notifications.map(n => <div>
                        <p>{n.description}</p>
                    </div>)}
                </>}
            </div>
        </div>}
        {/** LOGIN **/}
        {!session?.user?.id && <Link className={"login-button"} to={"/login"}>
            <p>Iniciar Sessão</p>
            <FontAwesomeIcon icon={faCircleUser}/>
        </Link>}
    </div>
}

export default Search;