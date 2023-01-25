/******* SEARCH BAR *******/

import "./inputSearch.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router-dom";
import {useState} from "react";

function InputSearch() {

    const history = useHistory();
    const [search, setSearch] = useState("");

    const handleChange = () => {
        history.push(`/homepage?search=${search}`)
    };

    return <div className={"search-bar-container"}>
        <input
            type={"text"}
            placeholder={"Pesquisar"}
            onChange={e => {
                setSearch(e.target.value)
            }}
        />
        <div className={"icon-container"}>
            <FontAwesomeIcon className={"icon"} icon={faSearch} type={"input"} onClick={_e => handleChange()}/>
        </div>
    </div>
}

export default InputSearch;