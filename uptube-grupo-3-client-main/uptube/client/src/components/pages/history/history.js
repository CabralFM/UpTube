/******* HISTORY PAGE *******/

import "./history.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import SmallVideoCard from "../../card/smallVideoCard/smallVideoCard";
import {useSession} from "../../../providers/UserContext";

function History() {

    const [videos, setVideosHistory] = useState(null);
    const session = useSession(); // User with login

    useEffect(() => {
        axios.get(`http://localhost:3001/user/${session?.user?.id}/history`)
            .then(response => {
                setVideosHistory(response.data.history);
            })
    }, [session?.user?.id]);

    return <div className={"history-page-container"}>
        <h1>Histórico de visualizações</h1>
        <div className={"history-container-3"}>
            <div className={"video-container"}>
                {!videos && <p>Loading</p>}
                {videos && <>
                    {videos.length === 0 && <p>No results.</p>}
                    {videos.map(video => <SmallVideoCard
                        key={video.id}
                        id={video.id_video}
                        user={video.name}
                        avatar={video.avatar}
                        thumbnail={video.thumbnail}
                        title={video.title}
                        time={video.time}
                        startTime={video.startstamp}
                        stopsTime={video.stopstamp}
                        type={"history"}
                    />)}
                </>}
            </div>
        </div>
    </div>
}

export default History;