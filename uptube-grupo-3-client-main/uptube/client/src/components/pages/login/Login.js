import { useRef, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import logo from '../../../images/logo_uptube_white.svg';
import {useHistory} from "react-router-dom";
import "./Login.scss";
import {faEnvelope} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey} from "@fortawesome/free-solid-svg-icons";
import {useSession} from "../../../providers/UserContext";
import googleIcon from "../../../images/googleIncon.svg";


const Login = () => {

    const {refresh}=useSession();
    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [user, setUser] = useState(null);

    const history = useHistory();

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post('http://localhost:3001/user/login',
                {email, password},
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    withCredentials: true
                })
                .then(res => {
                refresh()
            });

            setUser(response.data.user);
            //console.log(response.data);
            setEmail('');
            setPwd('');
            setSuccess(response.data.success);


        } catch (err) {
            if (!err?.response) {
                setErrMsg('Sem conexão com o servidor');
            } else if (err.response?.status === 400) {
                setErrMsg('Falta preencher o E-mail ou Password corretamente');
            } else if (err.response?.status === 401) {
                setErrMsg('Não autorizado');
            } else {
                setErrMsg('Falha no login');
            }
            errRef.current.focus();
        }
    }
    const registerGoogle = () =>{
        axios.post('http://localhost:3001/user/login', {
            // YOU SHALL NOT PASS!
        })
    }
console.log(success)
    return (
        <div className={'loginMain'}>

            {success ? (
                history.push('/home')
            ) : (
                <div className={'formMasterLog'}>
                    <img src={logo} alt={'logo'}/>
                    <br />
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h2>Fazer login</h2>

                    <div className={"formLog"}>
                    <form onSubmit={handleSubmit}>

                        <div className={"emailDiv"}>
                        <label htmlFor="email">E-mail:</label>
                        <input
                            type="text"
                            id="email"
                            ref={emailRef}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />
                            <FontAwesomeIcon icon={faEnvelope}/>

                        </div>

                        <div className={"passDiv"}>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={password}
                            required
                        />
                            <FontAwesomeIcon icon={faKey}/>

                        </div>
                        <div className={"forgotPass"}>
                            <a href="/recover-password">Esqueceu-se da password?</a>
                        </div>
                        <br/>
                        <button className={"btnLog"}>Login</button>
                    </form>
                    <p>
                        <span className="line">
                            <a href="./register">Criar conta</a>
                        </span>
                    </p>
                </div>
                    <br/>
                    <div className={'googleDiv'}>
                        <button className={"googleBtn"} type="submit"> <p>Continuar com a Google</p> <img className= "googleIcon" src={googleIcon} alt={'googleIcon'}/></button>
                        {/* <input type={'button'} value={'Continuar com a Google'} className={'google-button'} onClick={registerGoogle}/>
                        <div className={'googleIcon'}>
                        <img src={googleIcon} alt={'googleIcon'}/>
                        <FontAwesomeIcon icon={faGoogle} />
                    </div>*/}
                    </div>
                </div>
            )}

        </div>
    )
}

export default Login