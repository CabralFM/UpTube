/******* CARD VIDEO *******/

import "./videoCard.scss";
import {Link, useHistory, useParams} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbsUp, faThumbsDown} from "@fortawesome/free-regular-svg-icons";
import {faThumbsUp as faThumbsUpSolid, faThumbsDown as faThumbsDownSolid} from "@fortawesome/free-solid-svg-icons";
import {faFlag} from "@fortawesome/free-solid-svg-icons";
import React, {useRef, useEffect, useState} from "react";
import axios from "axios";
import {setPublicationTime} from "../../../utils/auxiliarMethods";
import {useSession} from "../../../providers/UserContext";
import Popup from "../popup/popup";

function VideoCard(props) {
    const history = useHistory();
    const userSession = useSession();
    const {id_user} = useSession();
    console.log("id_user", id_user);
    const id_video = props.id_video;
    //const videoOwner = props.videoOwner;
    //console.log("videoOwner", videoOwner);
    const path = props?.path;
    //console.log("path", path)
    let uploadedDate = props?.uploaded.toLocaleString()
    const subscribed = props.subscribed;
    const subscribeButton = props.subscribeButton;
    const videoOwner = props.videoOwner;
    const [active, setActive] = useState(false);
    let reactionIsLike = props.like;
    let reactionIsDislike = props.dislike;
    const handleClick = () => {
        setActive(!active);
    };
    const [usePopup, setUsePopup] = useState(false);
    // required for <video> :
    const videoRef = useRef(null)
    useEffect(() => {
        const {current: videoElement} = videoRef
        videoElement.setAttribute('muted', '')
    }, [])

    // report :
    const [reportCat, setReportCat] = useState([]);

    const handleReport = (e) => {
        try {
            axios.post(`http://localhost:3001/report/video/${id_video}`, {
                category: 11
            }, {withCredentials: true})
                .then(res => {
                    console.log(res.data);
                    history.push('/reportpage')
                });
        } catch (err) {
            console.log('err', err.response.data);
        }
    }

    const reportCategories = async () => {
        setUsePopup(!usePopup);
        //console.log(usePopup);
        axios.get(`http://localhost:3001/report/categories`,
            {
                withCredentials: true
            })
            .then(res => {
                setUsePopup(true)
                setReportCat(res.data?.categories)
                console.log("reportCategories", reportCat)
            }).catch((e) => {
            console.log("erro", e)
        })
    }

    //console.log("uploadedDate", uploadedDate);
    //console.log("path", path);
    console.log("subscribeButton", subscribeButton)

    return <div key={props.id} className={"video-card-container"}>
        {/*** VIDEO ***/}
        <video
            src={`http://localhost:3001${path}.mp4`}
            ref={videoRef}
            controls width="100%"
            loop={true}
            muted={true}
            autoPlay={true}
            playsInline={true}>
        </video>

        <div className={"details-container"}>
            {/*** TAGS ***/}
            <div className={"tags-container"}>
                {props.tags.map(tag => <p className={"tag"}>{'#' + tag.tag + ' '}</p>)}
            </div>
            {/*** TITLE ***/}
            <div className={"title-container"}>
                <h3>{props.title}</h3>
                {userSession.id_user ? <>
                    <FontAwesomeIcon icon={faFlag} className={"videocard-fa-report-flag"}
                                     onClick={reportCategories}/>
                    {usePopup && <Popup trigger={usePopup} setTrigger={setUsePopup}>
                        <div className={"videocard-popup-report-box"}>
                            <div className={"videocard-report-container"}>
                                <h1>Reportar vídeo</h1>
                                <h4>Seleccione a(s) categoria(s) alusiva(s) ao conteúdo a reportar:</h4>
                                {!reportCat && <p>A carregar...</p>}
                                {reportCat && <>
                                    {reportCat.length === 0 && <p>Sem resultados</p>}
                                    {reportCat.map(r =>
                                        <div className={"report-data-container"}>
                                            <h4 className={"data-type"}>{r.category}</h4>
                                            <div className={"videocard-switch-container"}>
                                                <label className="switch">
                                                    <input type="checkbox"/>
                                                    <span className="slider round"/>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                    <button className={"videopage-report-submit"}
                                    onClick={handleReport}>Confirmar</button>
                                </>}
                            </div>
                        </div>
                    </Popup>}
                </> : <FontAwesomeIcon icon={faFlag}/>
                }
            </div>
            <div className={"info-container"}>
                {/*** AVATAR ***/}
                <div className={"avatar-container"}
                     style={{backgroundImage: `url('${props.ownerAvatar}')`}}>
                </div>
                <div className={"channel-container-1"}>
                    <div className={"channel-container-2"} id={"container"}>
                        <h3 className={"channel"}>{props.ownerName}</h3>
                        {subscribeButton === true && userSession.id_user &&
                            <>
                                {subscribed === true ?
                                    <button className={"subscription-button " + "unsubscribe"}
                                            onClick={() => props.handleUnsubscribe(props.id_subscribed)}>
                                        Deixar de subscrever
                                    </button> :
                                    <button className={"subscription-button"}
                                            onClick={() => props.handleSubscribe(props.id_subscribed)}>
                                        Subscrever
                                    </button>}
                            </>}
                    </div>
                    <p>{props.views} visualizações | {setPublicationTime(uploadedDate)}</p>
                </div>
                <div className={"reactions-container"}>
                    {userSession.id_user ? reactionIsLike ?
                            <FontAwesomeIcon icon={faThumbsUpSolid} className={"videocard-fa-reactions-like-exists-icon"}
                                             onClick={props.addLike}/> :
                            <FontAwesomeIcon icon={faThumbsUp} className={"videocard-fa-reactions-like-icon"}
                                             onClick={props.addLike}/> :
                        <FontAwesomeIcon icon={faThumbsUp}/>
                    }
                    <p>{props.likes}</p>
                    <p> | </p>
                    {userSession.id_user ? reactionIsDislike ?
                            <FontAwesomeIcon icon={faThumbsDownSolid}
                                             className={"videocard-fa-reactions-dislike-exists-icon"}
                                             onClick={props.addDislike}/> :
                            <FontAwesomeIcon icon={faThumbsDown} className={"videocard-fa-reactions-dislike-icon"}
                                             onClick={props.addDislike}/> :
                        <FontAwesomeIcon icon={faThumbsDown}/>}
                    <p>{props.dislikes}</p>
                </div>
            </div>
        </div>
    </div>
}

export default VideoCard;