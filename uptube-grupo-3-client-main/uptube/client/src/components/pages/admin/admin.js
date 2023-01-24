import "./admin.scss";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import React from "react";
import {convertIsoToDate} from "../../../utils/auxiliarMethods";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {useSession} from "../../../providers/UserContext";

function Admin() {

    // User (admin) with login:
    const session = useSession();

    const [reports, set_reports] = useState([]);
    const [users, set_users] = useState([]);
    const [observation, set_observation] = useState('');
    const [edit, setEdit] = useState(false); // Edit page
    const [formInputObservation, setFormInputObservation] = useState('');


    useEffect(() => {
        axios.get(`http://localhost:3001/report/get/all`,
            {withCredentials: true})
            .then(res => {
                console.log(reports);
                set_reports(res.data.reports);
            })
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:3001/user/all`,
            {withCredentials: true})
            .then(res => {
                console.log(users);
                set_users(res.data.users);
            })
    }, [])

    // ### Buttons:

    // solve report:
    const solveReport = (id_report) => {
        axios.post(`http://localhost:3001/report/solve/${id_report}`, {
                observation: observation
            },
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            })
    }

    // unsolve report:
    const unsolveReport = (id_report) => {
        axios.post(`http://localhost:3001/report/unsolve/${id_report}`, {
                observation: observation
            },
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            })
    }

    const hideVideo = (id_video) => {
        axios.post(`http://localhost:3001/video/hide/${id_video}`,
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            })
    }

    const unhideVideo = (id_video) => {
        axios.post(`http://localhost:3001/video/unhide${id_video}`,
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            })
    }

    /*
    const deleteVideo = (id_video) => {
        axios.post(`http://localhost:3001/video/delete/${id_video}`,
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            })
    }

    const cancelUser = (id_user) => {
        axios.post(`http://localhost:3001/user/edit/${id_user}`,
            {withCredentials: true})
            .then(res => {
                console.log(res.data.message);
            })
    }
     */

    // Edit page:
    const handleEdit = async () => {
        setEdit(!edit);
    };

    const handleChange = (event) => {
        setFormInputObservation({
            ...formInputObservation,
            [event.target.name]: event.target.value
        });
    }

    const handleSubmit = async() => {
        // store the states in the form data
        const formData = new FormData();
        formData.append("observation", formInputObservation.observation)
        console.log(formData);
        /*try {
            // make axios post request
            const response = await axios({
                method: "post",
                url: "/api/login",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });
        } catch(error) {
            console.log(error)
        }*/
    }

    console.log("formInputObservation", formInputObservation)


    return <div className={"admin-page-container"}>
        <h1>Administração</h1>
        <div className={"admin-container"}>
            {!reports && <p>Loading...</p>}

            <div className={"admin-reports"}>
                {reports && <>
                    {reports.length === 0 && <p>No results</p>}
                    <div className={"admin-report-header"}>
                        <h2>Reports</h2>
                        {/* Edit button */}
                        {session?.id_user && <button className={`edit-button${edit ? " active" : ""}`}
                                                     onClick={handleEdit}>
                            <p>Editar denúncias</p>
                            <FontAwesomeIcon icon={faPenToSquare}/>
                        </button>}

                    </div>
                    <table>
                        <tr>
                            <th>
                                <div>Denúncia (ID)</div>
                            </th>
                            <th>
                                <div>Denunciante (ID)</div>
                            </th>
                            <th>
                                <div>Data de denúncia</div>
                            </th>
                            <th>
                                <div>Data de modificação</div>
                            </th>
                            <th>
                                <div>Categoria (ID)</div>
                            </th>
                            <th>
                                <div>Denunciado (ID)</div>
                            </th>
                            <th>
                                <div>Video (ID)</div>
                            </th>
                            <th>
                                <div>Observações</div>
                            </th>
                            <th>
                                <div>Resolvido</div>
                            </th>
                        </tr>
                        {reports.map(report =>
                            <>
                                <tr key={report.id}>
                                    <td>
                                        <div>{report.id ? report.id : "-"}</div>
                                    </td>
                                    <td>
                                        <div>{report.id_reporter ? report.id_reporter : "-"}</div>
                                    </td>
                                    <td>
                                        <div>{report.date ? convertIsoToDate(report.date) : "-"}</div>
                                    </td>
                                    <td>
                                        <div>{report.modified ? convertIsoToDate(report.modified) : "-"}</div>
                                    </td>
                                    <td>
                                        <div>{report.category ? report.category : "-"}</div>
                                    </td>
                                    <td>
                                        <div>{report.id_user ? report.id_user : "-"}</div>
                                    </td>
                                    <td>
                                        <div>{report.id_video ? report.id_video : "-"}</div>
                                    </td>
                                    <td>
                                        {!edit && <div>{report.observation ? report.observation : "-"}</div>}
                                        {edit && <div>
                                            <form onSubmit={handleSubmit}>
                                                <input
                                                    type="observation"
                                                    name="observation"
                                                    placeholder={report.observation}
                                                    value={report.observation}
                                                    onChange={handleChange}
                                                />
                                            </form>
                                            <button type="submit">
                                                Salvar
                                            </button>
                                        </div>}
                                    </td>
                                    <td>
                                        <div>{report.solved ? "Sim" : "Não"}</div>
                                    </td>
                                </tr>
                            </>
                        )}
                    </table>
                </>
                }
            </div>
            {!users && <p>Loading...</p>}
            <div className={"admin-users"}>
                {users && <>
                    {users.length === 0 && <p>No results</p>}
                    <div className={"admin-users-title"}>
                        <h2>Users</h2>
                    </div>
                    <table>
                        <tr>
                            <th>
                                <div>Utilizador (ID)</div>
                            </th>
                            <th>
                                <div>Avatar</div>
                            </th>
                            <th>
                                <div>Username</div>
                            </th>
                            <th>
                                <div>Email</div>
                            </th>
                            <th>
                                <div>Administrador</div>
                            </th>
                            <th>
                                <div>Data registo</div>
                            </th>
                            <th>
                                <div>Conta</div>
                            </th>
                            <th>
                                <div>Total visualizações</div>
                            </th>
                            <th>
                                <div>Total playlists</div>
                            </th>
                            <th>
                                <div>Total videos</div>
                            </th>
                        </tr>
                        {users.map(user =>
                            <>
                                <tr key={user.id}>
                                    <td>
                                        <div>{user.id ? user.id : "-"}</div>
                                    </td>
                                    <td>{user.avatar ? <div className={"td-avatar-container"}
                                                            style={{backgroundImage: `url('${user.avatar}')`}}/> :
                                        <div>-</div>}</td>
                                    <td>
                                        <div>{user.username ? user.username : "-"}</div>
                                    </td>
                                    <td>
                                        <div>{user.email ? user.email : "-"}</div>
                                    </td>
                                    <td>
                                        <div>{user.admin ? "Sim" : "Não"}</div>
                                    </td>
                                    <td>
                                        <div>{user.registered ? convertIsoToDate(user.registered) : "-"}</div>
                                    </td>
                                    <td>
                                        <div>{user.active ? "Ativa" : "Desativa"}</div>
                                    </td>
                                    <td>
                                        <div>{user.total_views ? user.total_views : "0"}</div>
                                    </td>
                                    <td>
                                        <div>{user.total_playlists ? user.total_playlists : "0"}</div>
                                    </td>
                                    <td>
                                        <div>{user.total_videos ? user.total_videos : "0"}</div>
                                    </td>
                                </tr>
                            </>
                        )}
                    </table>
                </>}
            </div>
        </div>
    </div>
}

export default Admin;

