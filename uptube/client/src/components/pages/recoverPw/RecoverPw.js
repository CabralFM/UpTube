import './RecoverPw.scss'
import logo from '../../../images/logo_uptube_white.svg'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from '@fortawesome/free-regular-svg-icons';
import {useState} from "react";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {useSession} from "../../../providers/UserContext";
import {faCheck, faInfoCircle, faTimes} from "@fortawesome/free-solid-svg-icons";



function RecoverPw () {
    const {refresh}=useSession();
    const [validEmail, setValidEmail] = useState("");
    const history = useHistory();
    const {username, setUser} = useSession();


    const handleSubmit = async (e) => {
        e.preventDefault();

        const recEmail = {
            email: validEmail,
        }

        const response = await axios.post('http://localhost:3001/user/recover-password', recEmail, {
            withCredentials: true
        })
            .then((response) => {
                alert("Enviamos-te um e-mail de recuperação da password")
                refresh();
                setUser(response.data.user);
                history.push("/changePw");
            }).catch((err) => {
                if (err?.response) {
                    history.push("/login");
                    alert("error: Credenciais inválidas!");
                }
        });
    }


    return <div className={'recoverpw'}>
        <div className={'recovercntr'}>
            <div className={'logo'}>
                <img src={logo} alt={'logo'}/>
            </div>

            <div className={'title'}>
                <h2>Recuperar Password</h2>
            </div>
        <div className={'formMasterRecPw'}>
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
                         {/*  <FontAwesomeIcon icon={faInfoCircle} />
                       4 to 40 caracteres.<br />
                        Deve ser um email váido.<br />*/}
                    </p>
                </div>

                <button className={"btnRegister"} onClick={handleSubmit}>Enviar email de Recuperação</button>

            </form>
        </div>
        </div>
    </div>
}


export default RecoverPw;