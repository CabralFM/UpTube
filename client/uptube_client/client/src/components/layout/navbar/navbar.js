/******* NAVBAR *******/

import "./navbar.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faFire, faClapperboard,
    faClockRotateLeft,
    faPlay,
    faVideo,
    faGear,
    faUser,
    faArrowRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import {Link, NavLink} from "react-router-dom";
import {useNavbar} from "../../../providers/NavbarContext";
import InputSearch from "../../card/inputSearch/inputSearch";
import {useSession} from "../../../providers/UserContext";
import axios from "axios";

function Navbar() {
    const {refresh} = useSession();
    const session = useSession(); // User with login
    const {navbarActive, uiHidden} = useNavbar();

    const handleLogout = async (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/user/logout', null, {
            withCredentials: true
        })
            .then(r => {
                //refresh();
                window.location.replace("/homepage")
            });
    };

    return <div className={"navbar-container" + (navbarActive && !uiHidden ? " hidden" : "")}>
        {/** SEARCH **/}
        <div className={"input-search-container"}>
            {<InputSearch/>}
        </div>

        {session?.user?.id && <Link to={"/user/" + session?.user?.id}>
            <div className={"user"}>
                <div className={"avatar"}
                     style={{backgroundImage: `url('${session?.user?.avatar}')`}}>
                </div>
                <div>
                    <h3>{session?.user?.name}</h3>
                    <h4>{session?.user?.username}</h4>
                </div>
            </div>
        </Link>}

        <div className={"menu-container"}>
            <ul className={"ul-1"}>
                <div className={"option-container"}>
                    <NavLink className={"link"} to={"/homepage"}>
                        <FontAwesomeIcon icon={faHouse}/>
                        <li>Início</li>
                    </NavLink>
                </div>

                <div className={"option-container"}>
                    <NavLink className={"link"} to={"/trends"}>
                        <FontAwesomeIcon icon={faFire}/>
                        <li>Tendências</li>
                    </NavLink>
                </div>

                {session?.user?.id && <>
                    <div className={"option-container"}>
                        <NavLink className={"link"} to={"/subscriptions"}>
                            <FontAwesomeIcon icon={faClapperboard}/>
                            <li>Subscrições</li>
                        </NavLink>
                    </div>

                    <div className={"option-container"}>
                        <NavLink className={"link"} to={"/history"}>
                            <FontAwesomeIcon icon={faClockRotateLeft}/>
                            <li>Histórico</li>
                        </NavLink>
                    </div>

                    <div className={"option-container"}>
                        <NavLink className={"link"} to={"/playlists"}>
                            <FontAwesomeIcon icon={faPlay}/>
                            <li>Playlists</li>
                        </NavLink>
                    </div>
                </>}

                {!session?.user?.id && <div className={"option-container"}>
                    <NavLink className={"link"} to={"/channels"}>
                        <FontAwesomeIcon icon={faPlay}/>
                        <li>Canais</li>
                    </NavLink>
                </div>}
            </ul>

            {session?.user?.id && <div className={"tags"}>
                <h3>Tags</h3>
                <div className={"tags-container"}>
                    {!session?.tags && <p>Loading</p>}
                    {session?.tags && <>
                        {session?.tags.length === 0 && <p>No results.</p>}
                        {session?.tags.map(tag => <p>{tag.tag}</p>)}
                    </>}
                </div>
            </div>}

            {session?.user?.id && <ul className={"ul-2"}>
                {session?.user?.admin === 1 && <div className={"option-container"}>
                    <NavLink className={"link"} to={"/admin"}>
                        <FontAwesomeIcon icon={faUser}/>
                        <li>Admin</li>
                    </NavLink>
                </div>}

                <div className={"option-container"}>
                    <NavLink className={"link"} to={"/studiopage"}>
                        <FontAwesomeIcon icon={faVideo}/>
                        <li>Estúdio</li>
                    </NavLink>
                </div>

                <div className={"option-container"}>
                    <NavLink className={"link"} to={"/definitions"}>
                        <FontAwesomeIcon icon={faGear}/>
                        <li>Definições</li>
                    </NavLink>
                </div>

                <div className={"option-container"}>
                    <div className={"link"} onClick={handleLogout}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket}/>
                        <li>Terminar sessão</li>
                    </div>
                </div>
            </ul>}
        </div>
    </div>;
}

export default Navbar;