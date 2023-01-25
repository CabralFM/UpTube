import "./ChangePw.scss"
import React, { useState} from "react";
import axios from "axios";
import { useHistory} from "react-router-dom";
import logo from "../../../images/logo_uptube_white.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faInfoCircle, faKey} from "@fortawesome/free-solid-svg-icons";
import {useSession} from "../../../providers/UserContext";

function ChangePw() {

    const {refresh}=useSession();
    const [validEmail, setValidEmail] = useState("");
    const [password, setPwd] = useState("");
    const [rePassword, setRePassword] = useState("");
    const history = useHistory();
    //const {username, setUser} = useSession();
    const [user, setUser] = useState(null);



    let handleSubmit = async (e) => {

        e.preventDefault();

        let recUser = {
            email: validEmail,
            password: password,
            rep_password: rePassword
        }

        axios.post(`http://localhost:3001/user/update-password`, recUser, {
            withCredentials: true
        })
            .then((res) => {
                alert("Password alterada com sucesso!");
                refresh()
                setUser(res.data.user);
                history.replace("/home");
            }).catch((error) => {
            alert("error: Credenciais incorretas!");
        });
    }



    return <div className={'recoverpwtkn'}>
        <div className={'recovercntrtkn'}>
            <div className={'logotkn'}>
                <img src={logo} alt={'logo'}/>
            </div>

            <div className={'titletkn'}>
                <h2>Alterar Password</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className={"email"}>
                    <label htmlFor="email">
                        {/* <FontAwesomeIcon icon={faCheck} className={setValidEmail ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={setValidEmail ? "hide" : "invalid"} />*/}
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder={'email'}
                        value={validEmail}
                        onChange={(e) => setValidEmail(e.target.value)}
                        required
                        aria-invalid={setValidEmail ? "false" : "true"}
                        aria-describedby="emailnote"

                    />
                    <FontAwesomeIcon icon={faEnvelope}/>
                    <p id="email" className={!setValidEmail ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        4 to 40 caracteres.<br />
                        Deve ser um email váido
                        com o caracter <span aria-label="at symbol">@</span>
                    </p>
                </div>

                <div className={"password"}>
                    <label htmlFor="password">
                        {/* <FontAwesomeIcon icon={faCheck} className={setValidEmail ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={setValidEmail ? "hide" : "invalid"} />*/}
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder={'password'}
                        value={password}
                        onChange={(e) => setPwd(e.target.value)}
                        required
                        aria-invalid={setPwd ? "false" : "true"}
                        aria-describedby="passwordnote"

                    />
                    <FontAwesomeIcon icon={faKey}/>
                    <p id="password" className={!setPwd ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        12 a 50 caracteres.<br />
                        Deve conter letra maiúscula, minúscula, numero e símbolo.<br />
                        Símbolos permitidos: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </p>
                </div>



                <div className={"password"}>
                    <label htmlFor="password">
                        {/* <FontAwesomeIcon icon={faCheck} className={setValidEmail ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={setValidEmail ? "hide" : "invalid"} />*/}
                    </label>
                    <input
                        type="password"
                        id="rePassword"
                        name="rePassword"
                        placeholder={'repetir password'}
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                        required
                        aria-invalid={setRePassword ? "false" : "true"}
                        aria-describedby="rePassworddnote"

                    />
                    <FontAwesomeIcon icon={faKey}/>
                    <p id="rePassword" className={!setRePassword ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Deve ser a mesma password preenchida no campo password.
                    </p>
                </div>


                <button className={"btnRegister"} onClick={handleSubmit}>Alterar Password</button>

            </form>

        </div>
    </div>


}

export default ChangePw;