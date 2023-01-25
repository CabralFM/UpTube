/******* DEFINITIONS PAGE *******/

import "./definitions.scss";
import {useSession} from "../../../providers/UserContext";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import DefinitionsCard from "../../card/definitions/definitionsCard";
import axios from "axios";

function Definitions() {

    // user with login:
    const session = useSession();
    const {id_user, refresh} = useSession();

    // notification states:
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [comment, setComment] = useState(false);
    const [subscription, setSubscription] = useState(false);
    const [upload, setUpload] = useState(false);
    //const [addUserPlaylist, setAddUserPlaylist] = useState(false);
    const [achievement, setAchievement] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:3001/notification/get-all-from-user`,
            {withCredentials: true})
            .then(res => {
                setIsLoading(false);
                //console.log("DATAA", res.data?.notifications)
                const data = res.data?.notifications;
                setNotifications(data?.notifications);
                //console.log("notifications", notifications);
                //console.log("DATA", data);
                filterNotifications(res.data?.notifications);
            }).catch(err => {
            setIsLoading(false);
            setError(err);
            console.log("erro", err);
        })
    }, [notifications, id_user])

    /*

    function getNotifications() {
        axios.get(`http://localhost:3001/notification/get-all-from-user`,
            {withCredentials: true})
            .then(res => {
                setIsLoading(false);
                const data = res.data?.notifications;
                setNotifications(data?.notifications);
                //console.log("notifications", notifications);
                console.log("DATA", data);
                filterNotifications(notifications);
            }).catch(err => {
            setIsLoading(false);
            setError(err);
            console.log("erro", err);
        })
    }

     */

    function handleChange(e, notification_type) {
        if (notification_type === 'like') setLike(e.target.checked);
        if (notification_type === 'dislike') setDislike(e.target.checked);
        if (notification_type === 'comment') setComment(e.target.checked);
        if (notification_type === 'subscription') setSubscription(e.target.checked);
        if (notification_type === 'upload') setUpload(e.target.checked);
        //if (notification_type === 'addUserPlaylist') setAddUserPlaylist(e.target.checked);
        if (notification_type === 'achievement') setAchievement(e.target.checked);
    }

    const addLike = () => {
        axios.post(`http://localhost:3001/notification/add-notification`, {
                id_user: id_user,
                id_notification_type: 1
            },
            {withCredentials: true})
            .then(res => {
                //console.log("ADDED LIKE");
            })
    }

    const deleteLike = () => {
        axios.post(`http://localhost:3001/notification/del-notification`, {
                id_user: id_user,
                id_notification_type: 1
            },
            {withCredentials: true})
            .then(res => {
                //console.log("DELETED LIKE");
            })
    }

    const addDislike = async () => {
        axios.post(`http://localhost:3001/notification/add-notification`, {
                id_user: id_user,
                id_notification_type: 2
            },
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            })
    }

    const deleteDislike = () => {
        axios.post(`http://localhost:3001/notification/del-notification`, {
                id_user: id_user,
                id_notification_type: 2
            },
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            })
    }

    const addComment = () => {
        axios.post(`http://localhost:3001/notification/add-notification`, {
                id_user: id_user,
                id_notification_type: 3
            },
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            })
    }

    const deleteComment = () => {
        axios.post(`http://localhost:3001/notification/del-notification`, {
                id_user: id_user,
                id_notification_type: 3
            },
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            })
    }

    const addSubscribed = () => {
        axios.post(`http://localhost:3001/notification/add-notification`, {
                id_user: id_user,
                id_notification_type: 4
            },
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            })
    }

    const deleteSubscribed = () => {
        axios.post(`http://localhost:3001/notification/del-notification`, {
                id_user: id_user,
                id_notification_type: 4
            },
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            })
    }

    const addUpload = () => {
        axios.post(`http://localhost:3001/notification/add-notification`, {
                id_user: id_user,
                id_notification_type: 5
            },
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            })
    }

    const deleteUpload = () => {
        axios.post(`http://localhost:3001/notification/del-notification`, {
                id_user: id_user,
                id_notification_type: 5
            },
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            })
    }

    const addAchievement = () => {
        axios.post(`http://localhost:3001/notification/add-notification`, {
                id_user: id_user,
                id_notification_type: 11
            },
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            })
    }

    const deleteAchievement = () => {
        axios.post(`http://localhost:3001/notification/del-notification`, {
                id_user: id_user,
                id_notification_type: 11
            },
            {withCredentials: true})
            .then(res => {
                console.log(res.data);
            })
    }

    function filterNotifications(notifications) {
        console.log("entrei aqui em filterNotifications")
        console.log("notifications?.length", notifications?.length)
        for (let i = 0; i < notifications?.length; i++) {
            console.log("entrei aqui no FOR")
            console.log("ESTE", notifications[i]?.id_notification_type)
            if (notifications[i]?.id_notification_type === 1) {
                console.log("entrei aqui no primeiro IF")
                setLike(true);
                console.log("setlike is now: ", like);
                console.log("notifications.id_user: ", notifications.id_user);
                console.log("notifications.id_notification_type: ", notifications.id_notification_type);
            } else setLike(false);
            if (notifications[i]?.id_notification_type === 2) {
                console.log("entrei aqui no IF 2")
                setDislike(true);
                console.log("setDislike is now: ", dislike);
                console.log("notifications.id_user: ", notifications.id_user);
                console.log("notifications.id_notification_type: ", notifications.id_notification_type);
            } else setDislike(false);
            if (notifications[i]?.id_notification_type === 3) {
                console.log("entrei aqui no IF 3")
                setComment(true);
                console.log("setComment is now: ", comment);
                console.log("notifications.id_user: ", notifications.id_user);
                console.log("notifications.id_notification_type: ", notifications.id_notification_type);
            } else setComment(false);
            if (notifications[i]?.id_notification_type === 4) {
                console.log("entrei aqui no IF 4")
                setSubscription(true);
                console.log("setSubscription is now: ", subscription);
                console.log("notifications.id_user: ", notifications.id_user);
                console.log("notifications.id_notification_type: ", notifications.id_notification_type);
            } else setSubscription(false);
            if (notifications[i]?.id_notification_type === 5) {
                console.log("entrei aqui no IF 5")
                setUpload(true);
                console.log("setUpload is now: ", upload);
                console.log("notifications.id_user: ", notifications.id_user);
                console.log("notifications.id_notification_type: ", notifications.id_notification_type);
            } else setUpload(false);
            //if (notifications.id_notification_type === 6) {setComment(true);}
            //if (notifications.id_notification_type === 7) {setComment(true);}
            //if (notifications.id_notification_type === 8) {setComment(true);}
            //if (notifications.id_notification_type === 9) {setComment(true);}
            //if (notifications.id_notification_type === 10) {setComment(true);}
            if (notifications[i]?.id_notification_type === 11) {
                console.log("entrei aqui no IF 11")
                setAchievement(true);
                console.log("setAchievement is now: ", achievement);
                console.log("notifications.id_user: ", notifications.id_user);
                console.log("notifications.id_notification_type: ", notifications.id_notification_type);
            } else setAchievement(false);
            console.log("chegou ao fim")
        }
    }

    /*
    useEffect(() => {
        if (notifications)
            getNotifications();
    }, [notifications, id_user])
     */

    return <div className={"definitions-page-container"}>
        <h1>Definições</h1>
        {!isLoading &&
            <>
                {/* Dados do utilizador */}
                <DefinitionsCard title={"Dados do utilizador"}>
                    <div className={"data-container"}>
                        <h4 className={"data-type"}>Conta</h4>
                        <div className={"switch-container"}>
                            <label className="switch">
                                <input type="checkbox"/>
                                <span className="slider round"/>
                            </label>
                        </div>
                    </div>
                    <div className={"data-container"}>
                        <h4 className={"data-type"}>Email</h4>
                        {session && <h4 className={"user-data"}>{session?.user?.email}</h4>}
                    </div>
                    <div className={"data-container"}>
                        <h4 className={"data-type"}>Password</h4>
                        {/* TODO: confirmar link */}
                        <Link to={"/recover-password"}>Recuperar password</Link>
                    </div>
                    <div className={"data-container"}>
                        <h4 className={"data-type"}>Username</h4>
                        {session && <h4 className={"user-data"}>@{session?.user?.username}</h4>}
                    </div>
                    <div className={"data-container"}>
                        <h4 className={"data-type"}>Name</h4>
                        {session && <h4 className={"user-data"}>{session?.user?.name}</h4>}
                    </div>
                </DefinitionsCard>
                {/* Notificações */}
                <DefinitionsCard title={"Notificações"}>
                    <p>Active as notificações que pretende receber por email</p>
                    {/* New like */}
                    <div className={"data-container"}>
                        <h4 className={"data-type"}>Like</h4>
                        <div className={"switch-container"}>
                            <label className="switch">
                                <input type="checkbox"
                                       checked={like}
                                       onChange={(e) => handleChange(e, 'like')}
                                       onClick={like ? addLike : deleteLike}
                                />
                                <span className="slider round"/>
                            </label>
                        </div>
                    </div>
                    {/* New dislike */}
                    <div className={"data-container"}>
                        <h4 className={"data-type"}>Dislike</h4>
                        <div className={"switch-container"}>
                            <label className="switch">
                                <input type="checkbox"
                                       checked={dislike}
                                       onChange={(e) => handleChange(e, 'dislike')}
                                       onClick={dislike ? deleteDislike : addDislike}
                                />
                                <span className="slider round"/>
                            </label>
                        </div>
                    </div>
                    {/* New Comment */}
                    <div className={"data-container"}>
                        <h4 className={"data-type"}>Comentário</h4>
                        <div className={"switch-container"}>
                            <label className="switch">
                                <input type="checkbox"
                                       checked={comment}
                                       onChange={(e) => handleChange(e, 'comment')}
                                       onClick={comment ? deleteComment : addComment}
                                />
                                <span className="slider round"/>
                            </label>
                        </div>
                    </div>
                    {/* New Subscriber */}
                    <div className={"data-container"}>
                        <h4 className={"data-type"}>Subscritor</h4>
                        <div className={"switch-container"}>
                            <label className="switch">
                                <input type="checkbox"
                                       checked={subscription}
                                       onChange={(e) => handleChange(e, 'subscription')}
                                       onClick={subscription ? deleteSubscribed : addSubscribed}
                                />
                                <span className="slider round"/>
                            </label>
                        </div>
                    </div>
                    {/* New video published */}
                    <div className={"data-container"}>
                        <h4 className={"data-type"}>Vídeo Publicado</h4>
                        <div className={"switch-container"}>
                            <label className="switch">
                                <input type="checkbox"
                                       checked={upload}
                                       onChange={(e) => handleChange(e, 'upload')}
                                       onClick={upload ? deleteUpload : addUpload}
                                />
                                <span className="slider round"/>
                            </label>
                        </div>
                    </div>
                    {/* User added to playlist */}
                    <div className={"data-container"}>
                        <h4 className={"data-type"}>Utilizador adicionado a Playlist</h4>
                        <div className={"switch-container"}>
                            <label className="switch">
                                <input type="checkbox"/>
                                <span className="slider round"/>
                            </label>
                        </div>
                    </div>
                    {/* User added video to playlist */}
                    <div className={"data-container"}>
                        <h4 className={"data-type"}>Utilizador adicionou Vídeo a Playlist</h4>
                        <div className={"switch-container"}>
                            <label className="switch">
                                <input type="checkbox"/>
                                <span className="slider round"/>
                            </label>
                        </div>
                    </div>
                    {/* New achievement */}
                    <div className={"data-container"}>
                        <h4 className={"data-type"}>Novo Achievement</h4>
                        <div className={"switch-container"}>
                            <label className="switch">
                                <input type="checkbox"
                                       checked={achievement}
                                       onChange={(e) => handleChange(e, 'achievement')}
                                       onClick={achievement ? deleteAchievement : addAchievement}
                                />
                                <span className="slider round"/>
                            </label>
                        </div>
                    </div>
                </DefinitionsCard>
                {/* Histórico de report */}
                <DefinitionsCard title={"Histórico de report"}>
                    <p>Sem resultados.</p>
                </DefinitionsCard>
            </>
        }
    </div>
}

export default Definitions;