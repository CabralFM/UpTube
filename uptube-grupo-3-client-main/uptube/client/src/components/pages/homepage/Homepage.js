/******* HOME PAGE *******/

import "./Homepage.scss";
import axios from "axios";
import SmallVideoCard from "../../card/smallVideoCard/smallVideoCard";
import {useEffect, useState} from "react";
import {useSession} from "../../../providers/UserContext";

// TODO: como fazer a paginação dos videos?
// TODO: como fazer a paginação dos canais?
// TODO: como escolher o canal para adicionar?
// TODO: popup para bookmark.

function HomePage() {

    const session = useSession(); // User with login

    const [suggestedVideos, setSuggestedVideos] = useState(null);
    const [suggestedChannels, setSuggestedChannels] = useState(null);
    const [topSuggestedChannels, setTopSuggestedChannels] = useState(null);
    // Search
    const [videosSearch, setVideosSearch] = useState(null);
    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        axios.get(`http://localhost:3001/user/suggestedVideos`)
            .then(response => {
                setSuggestedVideos(response.data.suggestedVideos);
            })
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:3001/user/suggestedChannels`)
            .then(response => {
                let channels = response.data.suggestedChannels;
                setSuggestedChannels(channels);
                setTopSuggestedChannels(channels.slice(0, 5));
            })
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:3001/video-search`,
            {params: {search: searchQuery}, withCredentials: true})
            .then(response => {
                setVideosSearch(response.data.videos);
            })
    }, [searchQuery]);

    return <div className={"home-page-container"}>
        {searchQuery ?
            <h1>Resultados da pesquisa</h1> :
            <h1>Videos sugeridos</h1>
        }
        <div className={"home-container"}>
            {/* Suggested videos */}
            {searchQuery ?
                <div className={"video-container"}>
                    {!videosSearch && <p>A carregar...</p>}
                    {videosSearch && <>
                        {videosSearch.length === 0 && <p>Sem resultados</p>}
                        {videosSearch.map(video => <SmallVideoCard
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
                            dislikes={video.total_dislikes}
                            comments={video.total_comments}
                            type={"video homepage"}
                        />)}
                    </>}
                </div> :
                <div className={"video-container"}>
                    {!suggestedVideos && <p>A carregar...</p>}
                    {suggestedVideos && <>
                        {suggestedVideos.length === 0 && <p>Sem resultados</p>}
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
                            dislikes={video.total_dislikes}
                            comments={video.total_comments}
                            type={"video homepage"}
                        />)}
                    </>}
                </div>
            }
            {/* Suggested channels */}
            {session?.user?.id && <div className={"suggested-channels-container-1"}>
                <div className={"header-container"}>
                    <h2>Canais sugeridos</h2>
                    <div className={"ellipsis"}>
                        <div className={"dot"}/>
                        <div className={"dot"}/>
                        <div className={"dot"}/>
                    </div>
                </div>
                <div className={"line"}/>
                {!topSuggestedChannels && <p>Loading...</p>}
                {topSuggestedChannels && <>
                    {topSuggestedChannels.length === 0 && <p>Sem resultados</p>}
                    {topSuggestedChannels.map(channel => <div className={"suggested-channel-container"}>
                        <div className={"suggested-channel-avatar-container"}
                             style={{backgroundImage: `url('${channel.avatar}')`}}>
                        </div>
                        <h5>{channel.name}</h5>
                    </div>)}
                    <div className={"suggested-channel-button"}>
                        <p>Mostrar mais</p>
                    </div>
                </>}
                {/* Suggested channel */}
                <div className={"suggested-channels-container-2"}>
                    <div className={"header-container"}>
                        <h2>Canais sugeridos</h2>
                        <h3>Ver todos</h3>
                    </div>
                    <div className={"line"}/>
                    <div className={"suggested-channels-container-3"}>
                        <div className={"suggested-channels-container-4"}>
                            <div className={"suggested-channel-avatar-container-2"}
                                 style={{backgroundImage: `url('https://cdn.dribbble.com/users/577645/screenshots/14939775/media/275d547d9ffee85fd1a9379fd10e9211.jpg')`}}>
                            </div>
                            <div className={"info-container"}>
                                <h5>Up Studio</h5>
                                <h6>Estúdio Design</h6>
                            </div>
                        </div>
                        <div className={"suggested-channel-image-container"}
                             style={{backgroundImage: `url('https://cdn.dribbble.com/users/577645/screenshots/14939775/media/275d547d9ffee85fd1a9379fd10e9211.jpg')`}}>
                        </div>
                        <div className={"add-channel-button"}>
                            {/*<div className={"icons-container"}>
                                <FontAwesomeIcon icon={faUser} className={"icon icon-user"}/>
                                <FontAwesomeIcon icon={faPlus} className={"icon icon-plus"}/>
                            </div>*/}
                            <p>Seguir Canal</p>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    </div>
}

export default HomePage;