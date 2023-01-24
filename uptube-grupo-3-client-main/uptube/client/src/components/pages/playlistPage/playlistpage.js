/******* PLAYLIST PAGE *******/

import "./playlistpage.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import SmallVideoCard from "../../card/smallVideoCard/smallVideoCard";
import {useParams} from "react-router-dom";

function PlaylistPage() {

    const {id_playlist} = useParams();
    const [videos, setVideos] = useState(null);
    const [playlistTitle, setPlaylistTitle] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/playlist/${id_playlist}/all-videos`)
            .then(response => {
                setVideos(response.data.videos)
            })

        axios.get(`http://localhost:3001/playlist/${id_playlist}/title`)
            .then(response => {
                setPlaylistTitle(response.data.playlist[0].title)
            })
    }, [id_playlist]);

    return <div className={"playlist-page-container"}>
        {playlistTitle && <h1>{playlistTitle}</h1>}
        <div className={"playlist-container"}>
            <div className={"video-container"}>
                {!videos && <p>Loading</p>}
                {videos && <>
                    {videos.length === 0 && <p>No results.</p>}
                    {videos.map(video => <SmallVideoCard
                        key={video.id}
                        id={video.id}
                        thumbnail={video.thumbnail}
                        duration={video.length}
                        tags={video.tags}
                        title={video.title}
                        views={video.views}
                        created={video.uploaded}
                        type={"video"}
                    />)}
                </>}
            </div>
        </div>
    </div>
}

export default PlaylistPage;