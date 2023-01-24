/******* PLAYLISTS PAGE *******/

import "./playlists.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import SmallVideoCard from "../../card/smallVideoCard/smallVideoCard";
import {useSession} from "../../../providers/UserContext";

function Playlists() {

    const session = useSession(); // User with login
    const [playlists, setPlaylists] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/playlist/all/${session?.user?.id}`)
            .then(response => {
                setPlaylists(response.data.user_playlists)
            })
    }, [session?.user?.id]);

    return <div className={"playlists-page-container"}>
        <h1>Playlists</h1>
        <div className={"playlist-container"}>
            {!playlists && <p>Loading</p>}
            {playlists && <>
                {playlists.length === 0 && <p>No results.</p>}
                {playlists.map(playlist => <SmallVideoCard
                    key={playlist.playlist_id}
                    id={playlist.playlist_id}
                    avatar={session?.user?.avatar}
                    thumbnail={playlist.thumbnail}
                    duration={playlist.total_time}
                    user={session?.user?.name}
                    title={playlist.title}
                    views={playlist.views}
                    created={playlist.created}
                    type={"playlist"}
                    owner={playlist.owner}
                />)}
            </>}
        </div>
    </div>
}

export default Playlists;