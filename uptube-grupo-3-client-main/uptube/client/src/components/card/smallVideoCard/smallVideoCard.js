/******* CARD PLAYLIST/VIDEO *******/

import "./smallVideoCard.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faMessage,
    faThumbsUp,
    faBookmark
} from "@fortawesome/free-regular-svg-icons";
import {
    faGear,
    faPlay,
} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {
    setTimeFormat,
    setPublicationTime,
    setTagsForVideoCard,
    setTotalDuration,
    setTimeWatching
} from "../../../utils/auxiliarMethods";
import shareIcon from "./../../../assets/share.svg"
import {useState} from "react";

function SmallVideoCard(props) {

    // ### Get property types (props.type):
    // - "video homepage": card to show video(s) on home page.
    // - "video": card to show video(s) on user page.
    // - "playlists": card to show playlists(s) on user page.
    // - "history": card to show playlists(s) on history page.
    // - "suggested": card to show video(s) on video page.
    // - "edit": card to show video(s) on studio page.

    let tags = [];
    if ((props.type === "video" || props.type === "edit") && props.tags !== null) {
        // Divides video tags into an array and adds a # if it doesn't exist:
        tags = setTagsForVideoCard(props.tags)
    }

    const haystack = props.thumbnail;
    const needle = 'http';
    const thumbnail = haystack.includes(needle)

    // State variable to keep track of whether the pop-up is visible or not:
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    return <div className={props.type === "suggested" ? "card-suggestions-container" : "card-container"} key={props.id}>

        <Link to={props.type === "playlist" ?
            "/playlist/" + props.id : // Redirect to playlist page
            "/video/" + props.id // Redirect to video page
        } className={"link-container"}>

            {/* Thumbnail */}
            {thumbnail ?
                <div className={"bg-image-container"}
                     style={{backgroundImage: `url('${props.thumbnail}')`}}>
                    {/* Duration (VIDEO) */}
                    {props.type !== "playlist" && props.type !== "history" &&
                        <p className={"duration"}>{setTimeFormat(props.duration)}</p>}
                </div>
                :
                <div className={"bg-image-container"}
                     style={{backgroundImage: `url('http://localhost:3001${props.thumbnail}')`}}>
                    {/* Duration (VIDEO) */}
                    {props.type !== "playlist" && props.type !== "history" &&
                        <p className={"duration"}>{setTimeFormat(props.duration)}</p>}
                </div>}
            {/* Overlay Thumbnail (PLAYLIST) */}
            {props.type === "playlist" && <div className={"image-overlay"}>
                <FontAwesomeIcon icon={faBookmark} className={"playlist-icon bookmark"}/>
                <FontAwesomeIcon icon={faPlay} className={"playlist-icon play"}/>
            </div>}

        </Link>

        {/* Avatar (PLAYLIST/HOMEPAGE/HISTORY) */}
        {props.type !== "video" && props.type !== "edit" && <div className={"avatar-container"}
                                                                 style={{backgroundImage: `url('${props.avatar}')`}}>
        </div>}

        <div className={props.type !== "video" && props.type !== "edit" ?
            "details-container details-margin-top" :
            "details-container"}>

            {/* Channel name (PLAYLIST/HOMEPAGE/HISTORY) */}
            {props.type !== "video" && props.type !== "edit" && <div className={"user-container"}>
                <p className={"user-name"}>{props.user}</p>
            </div>}

            {/* Tags (VIDEO) */}
            {(props.type === "video" || props.type === "edit") && <div className={"tags-container"}>
                {tags.map(tag => <p key={tag.id} className={"tag"}>{tag}</p>)}
            </div>}

            {/* Title */}
            <h3 className={"title"}>{props.title}</h3>

            {props.type !== "suggested" && <div className={"info-container"}>

                {/* Views / publication time */}
                {props.type === "playlist" &&
                    <p> Duração total: {setTotalDuration(props.duration)} | {setPublicationTime(props.created)}</p>}

                {(props.type === "video" || props.type === "edit") &&
                    <p>{props.views} visualizações | {setPublicationTime(props.created)}</p>}

                {props.type === "video homepage" &&
                    <p>{props.views} visualizações | {setPublicationTime(props.created)}</p>}

                {props.type === "history" && <div className={"history-container"}>
                    {/* Started watching (HISTORY) */}
                    <p>Início visualização: <span>{setTimeWatching(props.startTime)}</span></p>
                    {/* Stopped watching (HISTORY) */}
                    <p>Fim visualização: <span>{setTimeWatching(props.stopsTime)}</span></p>
                    {/* total time watched (HISTORY) */}
                    <p>Total visualizado: <span>{props.time}</span></p>
                </div>}

                {/* Gear (PLAYLIST) */}
                {(props.type === "playlist" && props.owner === 1) || props.type === "edit" &&
                    <Link to={props.type === "playlist" ? "" : "/video/edit/" + props.id}
                          className={"playlist-link-container"}>
                        <FontAwesomeIcon icon={faGear} className={"playlist-definitions-icon"}/>
                    </Link>}
            </div>}
        </div>

        {/* Reactions (VIDEO HOMEPAGE) */}
        {props.type === "video homepage" && <div className={"reactions-main-container"}>
            <div className={"line"}/>
            <div className={"reactions-container"}>

                {/* Comments */}
                <div className={"comments-container"}>
                    <FontAwesomeIcon icon={faMessage} className={"icon"}/>
                    {props.comments === 1 ?
                        <p> {props.comments} comentário</p> :
                        <p> {props.comments} comentários</p>
                    }
                </div>

                <div className={"likes-container"}>
                    <FontAwesomeIcon icon={faThumbsUp} className={"icon"}/>
                    {/* Likes */}
                    {props.likes === 1 ?
                        <p> {props.likes} like</p> :
                        <p> {props.likes} likes</p>
                    }
                </div>
                <div>
                    {/* Bookmark icon */}
                    <FontAwesomeIcon icon={faBookmark} className={"bookmark-icon"} onClick={() => setIsPopupVisible(!isPopupVisible)}/>

                    {/* Popup */}
                    {isPopupVisible && <div className={`popup-container ${isPopupVisible ? 'visible':''}`}>
                        <div className={"popup-content"}>
                            <h4>Adicionar à lista de reprodução</h4>
                            <label className="checkbox-label">
                                <p className={"label-description"}>Favoritos</p>
                                <input type="checkbox" checked="checked"/>
                                <span className="checkmark"/>
                                <div className={"playlist-type-container"}>
                                    <p>privada</p>
                                </div>
                            </label>
                            <label className="checkbox-label">
                                <p className={"label-description"}>Ver mais tarde</p>
                                <input type="checkbox"/>
                                <span className="checkmark"/>
                                <div className={"playlist-type-container"}>
                                    <p>privada</p>
                                </div>

                            </label>
                            <label className="checkbox-label">
                                <p className={"label-description"}>Videos incriveis</p>
                                <input type="checkbox" />
                                <span className="checkmark"/>
                                <div className={"playlist-type-container"}>
                                    <p>pública</p>
                                </div>
                            </label>
                            <div className={"popup-button"}>
                                <p>Adicionar lista</p>
                            </div>
                        </div>
                    </div>}

                    {/* Share icon */}
                    <img src={shareIcon} alt="Share Logo" className={"icon"}/>
                </div>
            </div>
        </div>}
    </div>;
}

export default SmallVideoCard;