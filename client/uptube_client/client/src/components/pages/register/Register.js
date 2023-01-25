import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle, faKey } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import logo from "../../../images/logo_uptube_white.svg";
import { useHistory } from "react-router-dom";
import googleIcon from "../../../images/googleIncon.svg";
import "./Register.scss";
import {useSession} from "../../../providers/UserContext";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const NAME_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[ ]).{3,50}$/;
const EMAIL_REGEX = /^(?=.*[a-z])(?=.*[@.]).{4,40}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{12,50}$/;


const Register = () => {

    const {refresh}=useSession();

    const userRef = useRef();
    const errRef = useRef();

    const [username, setUser] = useState('');
    const [validUserName, setValidUserName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [termsConditionsBox, setTermsConditionsBox] = useState(false)
    const [validTerms, setValidTerms] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    function defaultNotifications(email) {
        axios.post(`http://localhost:3001/notification/add-default-notifications/${email}`,
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            }).catch((e) => {
            console.log(e);
        })
    }

    const history = useHistory();

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidUserName(USER_REGEX.test(username));
    }, [username])

    useEffect(() => {
        setValidName(NAME_REGEX.test(name));
    }, [name])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    },[email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        setValidMatch(password === matchPwd);
    }, [password, matchPwd])


    useEffect(() => {
        setErrMsg('');
    }, [email, username, password, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // se o botão estiver ativado com JS hack
        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(password);
        const v3 = EMAIL_REGEX.test(email);
        const v4 = NAME_REGEX.test(name);
        if (!v1 || !v2 || !v3 || !v4) {
            setErrMsg("Credenciais invalidas");
            return;
        }
        try {
            if (termsConditionsBox) {
                const response = await axios.post('http://localhost:3001/user/register',
                    {name, username, email, password},
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        withCredentials: true
                    }
                );
            }

            refresh()
            setSuccess(true);
            setName('');
            setUser('');
            setEmail('');
            setPwd('');
            setMatchPwd('');
            setValidTerms('');
            defaultNotifications(email);

        } catch (err) {
            if (!err?.response) {
                setErrMsg('Sem resposta do servidor');
            } else if (err.response?.status === 409) {
                setErrMsg('Já existe um utilizador registado com este email');
            } else {
                setErrMsg('Ocorreu um erro ao fazer o registo')
            }
            errRef.current.focus();
        }
    }

    const registerGoogle = () =>{
        axios.post('http://localhost:3001/user/register', {
        })
    }

    return (
        <div className="registerCntr">
            {success ? (
                //history.push('/home')

                <section>
                    <h2>Registo feito com sucesso! </h2>
                    <div>
                        {/*<button className={"btnRegSuccess"} onClick={handleSubmit}>Aceda a tua pagina</button>*/}
                        <div className={"btnRegSuccess"}>
                            <a href="/login">Aceda aqui para fazer o login</a>
                        </div>
                    </div>
                </section>




            ) : (
                <div className={'formMaster'}>
                    <div className={'logoImg'}>
                    <img src={logo} alt={'logo'}/>
                    <br />
                    </div>

                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h2>Criar conta</h2>

                    <div className={"formRegister"}>
                    <form onSubmit={handleSubmit}>

                        <div className={"name"}>
                        <label htmlFor="name">
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !name ? "hide" : "invalid"} />
                        </label>

                        <input
                            type="text"
                            id="name"
                            placeholder={'Nome completo'}
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="namenote"
                            onFocus={() => setNameFocus(true)}
                            onBlur={() => setNameFocus(false)}
                        />
                        {/*<div className={"nameIcon"}>*/}
                        <FontAwesomeIcon icon={faUser}/>
                        {/*</div>*/}
                        <p id="namenote" className={nameFocus && name && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            3 a 24 caracteres.<br />
                            Deve preencher o primeiro nome e apelido(s) iniciando com letras maiúsculas.<br />
                            Números, underscore, acentos e símbolos não são permitidos.
                        </p>
                        </div>

                        <div className={"usernameCntr"}>
                        <label htmlFor="username">
                            <FontAwesomeIcon icon={faCheck} className={validUserName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validUserName || !username ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder={'Username'}
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={username}
                            required
                            aria-invalid={validUserName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        {/*<div className={"usernameIcon"}>*/}
                        <FontAwesomeIcon icon={faUser}/>
                        {/*</div>*/}
                        <p id="uidnote" className={userFocus && username && !validUserName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            3 to 23 caracteres.<br />
                            Letras, números e underscore são permitidos.
                        </p>
                        </div>

                        <div className={"email"}>
                        <label htmlFor="email">
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="email"
                            placeholder={' E-mail'}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="emailnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <FontAwesomeIcon icon={faEnvelope}/>
                        <p id="email" className={emailFocus && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 a 40 carácteres.<br />
                            Deve ser um email válido
                            e conter o caractér <span aria-label="at symbol">@</span>
                        </p>
                        </div>

                        <div className={"password"}>
                        <label htmlFor="password">
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !password ? "hide" : "invalid"} />
                        </label>

                        <input
                            type="password"
                            id="password"
                            placeholder={'Password'}
                            onChange={(e) => setPwd(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <FontAwesomeIcon icon={faKey}/>
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            12 a 50 caracteres.<br />
                            Deve conter letra maiúscula, minúscula, numero e símbolo.<br />
                            Caracteres permitidos: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>
                        </div>
                        <div className={"confirm_pwd"}>
                        <label htmlFor="confirm_pwd">
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            placeholder={'Repetir password'}
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <FontAwesomeIcon icon={faKey}/>
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            As passwords não coincidem.
                        </p>
                        </div>
                    </form>
                    </div>
                    <br/>
                    <div className={'termsNconditions'}>
                        <p>
                        <input type={'checkbox'} className={'terms-box'} onChange={(e) =>{
                            setTermsConditionsBox(e.target.checked)
                        }}/>

                            Aceito os <a href={'/terms-and-conditions'}>termos e condições</a>
                        </p>
                    </div>
                    {!termsConditionsBox && <div className={'register-invalid-credencial'}>
                    </div>}

                    <button className={"btnRegister"} disabled ={!validName || !validPwd || !validMatch || !termsConditionsBox} onClick={handleSubmit}>Registar</button>


                    <div className="line">
                            <a href="/login">Fazer login</a>
                        </div>
                    <br/>
                    <div className={'googleDivReg'}>
                        <button className={"googleBtnReg"} type="submit"> Continuar com a Google <img className= "googleIconReg" src={googleIcon} alt={'googleIconReg'}/></button>
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

export default Register