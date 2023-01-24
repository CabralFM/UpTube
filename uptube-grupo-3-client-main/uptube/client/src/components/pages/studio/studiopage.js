import "./studiopage.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import InfiniteScroll from "react-infinite-scroll-component";
import SmallVideoCard from "../../card/smallVideoCard/smallVideoCard";
import React, {useEffect, useState} from "react";
import {useSession} from "../../../providers/UserContext";
import {useHistory} from 'react-router-dom'
import axios from "axios";
import User from "../user/user";

function StudioPage() {

    const {id_user} = useSession();
    const session = useSession();
    const PAGE_SIZE = 50;
    let history = useHistory();

    const [videos, setVideos] = useState(null);
    const [page, setPage] = useState(1);
    const [limitPages, setLimitPages] = useState(10);
    const [loadingVideos, setloadingVideos] = useState(true);


    useEffect(() => {
        axios.get(`http://localhost:3001/user/${id_user}/uploaded-videos?limit=${PAGE_SIZE}&offset=${(page - 1) * PAGE_SIZE}`, {params: {page}},
            {
                withCredentials: true
            })
            .then(res => {
                setLimitPages(res.data.pages)
                setVideos(page === 1 ? res.data.videos : [...videos, ...res.data.videos])
                setloadingVideos(false)
                console.log("video", videos)
                console.log("res.data", res.data)
            })
    }, [page, id_user]);

    return <div className={"studio-page-container"}>
        <div className={"title-container"}>
            <h2>Uploads</h2>
            <button className={"uploadvideo-button"}
                    onClick={() => history.push("/video/upload/")}>Publicar um Vídeo
            </button>
        </div>
        <div className={"video-container"}>
            {!videos && <p>A carregar...</p>}
            {videos && <>
                {videos.length === 0 && <p>Sem resultados</p>}
                {videos.map(video => <SmallVideoCard
                    key={video.id}
                    id={video.id}
                    thumbnail={video.thumbnail}
                    duration={video.length}
                    tags={video.tags}
                    title={video.title}
                    views={video.views}
                    created={video.uploaded}
                    type={"edit"}
                />)}
            </>}
        </div>
    </div>
}

export default StudioPage;