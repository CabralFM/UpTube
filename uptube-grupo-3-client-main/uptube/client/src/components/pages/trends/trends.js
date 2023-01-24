/******* TRENDS PAGE *******/

import "./trends.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import SmallVideoCard from "../../card/smallVideoCard/smallVideoCard";

function Trends() {

    const [suggestedVideos, setSuggestedVideos] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/user/suggestedVideos`)
            .then(response => {
                setSuggestedVideos(response.data.suggestedVideos);
            })
    }, []);

    return <div className={"trends-page-container"}>
        <h1>Tendências</h1>
        <div className={"trends-container"}>
            <div className={"video-container"}>
                {!suggestedVideos && <p>Loading</p>}
                {suggestedVideos && <>
                    {suggestedVideos.length === 0 && <p>No results.</p>}
                    {suggestedVideos.map(video => <SmallVideoCard
                        key={video.id}
                        id={video.id}
                        user={video.name}
                        avatar={video.avatar}
                        thumbnail={video.thumbnail}
                        duration={video.length}
                        title={video.title}
                        views={video.views}
                        created={video.uploaded}
                        likes={video.total_likes}
                        comments={video.total_comments}
                        type={"video homepage"}
                    />)}
                </>}
            </div>
        </div>
    </div>
}

export default Trends;