/******* USER/CHANNEL PAGE *******/

import "./user.scss";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link, useHistory, useParams} from "react-router-dom";
import Achievement from "../../card/achievement/achievement";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faEye} from "@fortawesome/free-solid-svg-icons";
import SmallVideoCard from "../../card/smallVideoCard/smallVideoCard";
import InfiniteScroll from 'react-infinite-scroll-component';
import {useSession} from "../../../providers/UserContext";
import {getChannelCreationDate} from "../../../utils/auxiliarMethods";
import React from "react";
import {useForm} from "react-hook-form";
import button from "bootstrap/js/src/button";

const PAGE_SIZE = 3;

function User() {

    const {id_user} = useParams();
    const [user, setUser] = useState(null);
    const [tags, setTags] = useState(null);
    const [playlists, setPlaylists] = useState(null);
    const [subscribers, setSubscribers] = useState(null);
    let history = useHistory();

    // Video(s):
    const [videos, setVideos] = useState(null);
    const [page, setPage] = useState(1);
    const [limitPages, setLimitPages] = useState(10);
    const [loadingVideos, setloadingVideos] = useState(true);

    // Achievement(s):
    const [unlocked, setUnlocked] = useState(null); // Achievement(s) unlocked
    const [locked, setLocked] = useState(null); // Achievement(s) locked

    // Edit page:
    //const {handleSubmit} = useForm();
    const [edit, setEdit] = useState(false);
    const fileInputRef = useRef(null);
    const [name, setName] = useState('');
    const [getName, setGetName] = useState('');
    const [getBanner, setGetBanner] = useState('');

    const handleSubmit = (e) => {
        //e.preventDefault();
        editUser(name);
    };

    // User with login:
    const session = useSession();

    useEffect(() => {
        axios.get(`http://localhost:3001/user/${id_user}`)
            .then(response => {
                setUser(response.data.data.info[0])
                setTags(response.data.data.tags)
                setPlaylists(response.data.data.playlists)
                setSubscribers(response.data.data.subscribers)
                setUnlocked(response.data.data.achievements_unlocked)
                setLocked(response.data.data.achievements_locked)
                setGetName(response.data.data.info[0].name)
                setGetBanner(response.data.data.info[0].banner)
            })
    }, [id_user, name]);

    useEffect(() => {
        setloadingVideos(true)
        axios.get(`http://localhost:3001/user/${id_user}/uploaded-videos?limit=${PAGE_SIZE}&offset=${(page - 1) * PAGE_SIZE}`, {params: {page}})
            //axios.get(`http://localhost:3001/user/${id_user}/uploaded-videos`, {params: {page}})
            .then(response => {
                setLimitPages(response.data.pages)
                setVideos(page === 1 ? response.data.videos : [...videos, ...response.data.videos])
                setloadingVideos(false)
            })
    }, [page, id_user]);

    // Edit page:
    const handleEdit = async () => {
        setEdit(!edit);
    };

    // edit username:
    const editUser = () => {
        try {
            axios.post(`http://localhost:3001/user/edit/`, {
                name: name
            }, {
                withCredentials: true
            }).then(res => {

                console.log("editUser", res.statusText)
                console.log(res.status)
            });
        } catch (err) {
            console.log('err', err.response.data)
        }
    }

    // Event handler called when a file is dropped onto the div:
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        //console.log(file);

        // Create FormData object and append the file:
        const formData = new FormData();
        formData.append('file', file);

        console.log(" frontend file", file);
        axios.post('http://localhost:3001/user/upload-banner', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then((response) => {
            console.log(response.data);
        }).catch(error => {
            console.log("error", error);
        })
    };

    // Event handler called when a file is being dragged over the div:
    const handleDrag = (e) => {
        e.preventDefault();
    };

    function handleFileInputChange(event) {
        // Do something with the files that were selected via the file input
    }

    /*
    const handleChange = async (e) => {
        setInput(e.target.value);
        //console.log(setInput);
    };

     */

    // banner path swap:
    const haystack = getBanner;
    const needle = 'http';
    const banner = haystack.includes(needle)

    return <div className={"user-page-container"}>
        {/*  Banner */}
        <div className={"banner-container"}>
            {/* Admin button */}
            {user && session?.admin === 1 && <div className={"admin-button"}>
                <p>Admin</p>
            </div>}
            {user &&
                <>
                    {banner ?
                        <div className={"banner"} style={{backgroundImage: `url('${user.banner}')`}}></div>
                        :
                        <div className={"banner"}
                             style={{backgroundImage: `url('http://localhost:3001${user.banner}')`}}>
                            {/*style={{backgroundImage: `url('${user.banner}')`}}>*/}
                        </div>}
                </>}
            {user && session?.id_user && edit && <div className={"edit-banner-container"}>
                <div className={"edit-banner"}
                     style={{backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 255)`}}
                />
            </div>}
            {user && <div className={"banner banner-overlay"}/>}
            {/* Edit banner file upload */}
            {user && session?.id_user && edit && <div className={"edit-banner-file-container"}
                                                      onDrop={handleDrop}
                                                      onDragOver={handleDrag}>
                <div className={"edit-file-button"}>
                    <FontAwesomeIcon className={"edit-file-icon"} icon={faPenToSquare}/>
                </div>
                <input ref={fileInputRef}
                       type="file"
                       name={"image"}
                       onChange={handleFileInputChange}/>
            </div>}
        </div>
        {/*  Details */}
        <div className={"details-container-1"}>
            <div className={"details-container-2"}>
                {/* Edit button */}
                {session?.id_user === user?.id && <button className={`edit-button${edit ? " active" : ""}`}
                                                          onClick={handleEdit}>
                    <p>Editar Canal</p>
                    <FontAwesomeIcon icon={faPenToSquare}/>
                </button>}
                {/* User name */}
                {user && <div className={"user-name-container"}>
                    {session?.id_user && <>
                        {edit ?
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    defaultValue={user.name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                    onClick={editUser}/>
                                <button type="submit">
                                    <FontAwesomeIcon className={"edit-icon"} icon={faPenToSquare}/>
                                </button>
                            </form> : <h1>{user.name}</h1>}
                    </>}
                </div>}
                {/* User description */}
                {user && <p>{user.description}</p>}
            </div>
            <div className={"details-container-3"}>
                <div className={"statistics-container"}>
                    <div className={"statistic"}>
                        <h3>Subscritores</h3>
                        {user && <h2>{user.total_subscribers}</h2>}
                    </div>
                    <div className={"statistic"}>
                        <h3>Visualizalções</h3>
                        {user && <h2>{user.total_views}</h2>}
                    </div>
                    <div className={"statistic"}>
                        <h3>Videos</h3>
                        {user && <h2>{user.total_videos}</h2>}
                    </div>
                </div>
                {/***  AVATAR ***/}
                {user && <div className={"user-avatar-container"}>
                    <div className={"user-avatar"}
                         style={{backgroundImage: user.avatar ? `url('${user.avatar}')` : `url('${user.avatar}')`}}>
                    </div>
                    {/* Edit avatar */}
                    {session?.id_user && edit && <div className={"edit-avatar-file-container"}
                                                      onDrop={handleDrop}
                                                      onDragOver={handleDrag}>
                        <div className={"edit-file-button"}>
                            <FontAwesomeIcon className={"edit-file-icon"} icon={faPenToSquare}/>
                        </div>
                        <input type="file" ref={fileInputRef}/>
                    </div>}
                </div>}
            </div>
        </div>
        <hr/>
        {/*  Achievements */}
        <h2>Achievements</h2>
        <div className={"achievements-container"}>
            <h2 className={"achievements-title"}>Desbloqueados</h2>
            <div className={"unlocked-container"}>
                {!unlocked && <p>A carregar...</p>}
                {unlocked && <>
                    {unlocked.length === 0 && <p>Sem resultados</p>}
                    {unlocked.map(achievement => achievement.visible || session?.id_user === user?.id ? <Achievement
                        key={achievement.id}
                        id={achievement.id}
                        title={achievement.title}
                        description={achievement.description}
                        level={achievement.level}
                        max_level={achievement.max_level}
                        visible={achievement.visible}
                        date={achievement.date}
                        edit={edit ? true : false}
                        type={"unlocked"}
                    /> : "")}
                </>}
            </div>

            <h2 className={"achievements-title"}>Bloqueados</h2>
            <div className={"locked-container"}>
                {!locked && <p>A carregar...</p>}
                {locked && <>
                    {locked.length === 0 && <p>Sem resultados</p>}
                    {locked.length > 0 && locked.map(achievement => <Achievement
                        key={achievement.id}
                        id={achievement.id}
                        title={achievement.title}
                        description={achievement.description}
                        max_level={achievement.max_level}
                        type={"locked"}
                    />)}
                </>}
            </div>
        </div>
        {/*  Videos */}
        <div className={"title-container"}>
            <h2>Uploads</h2>
            {session?.id_user && edit && <FontAwesomeIcon icon={faEye} className={"edit-icon"}/>}
        </div>
        {/*
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
         */}
        <div className={"video-container"}>
            {!videos && <p>A carregar...</p>}
            {videos && <>
                {videos.length === 0 && <p>Sem resultados</p>}
                {<InfiniteScroll
                    dataLength={videos.length}
                    next={() => {
                        if (page < limitPages && !loadingVideos)
                            setPage(page + 1)
                    }}
                    hasMore={(page < limitPages)}
                    loader={<h3>A carregar...</h3>}
                    endMessage={
                        <p>
                            <b>Sem mais resultados</b>
                        </p>}>
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
                </InfiniteScroll>}
            </>}
        </div>

        {/*  Playlists */}
        <div className={"title-container"}>
            <h2>Playlists</h2>
            {session?.id_user && edit && <FontAwesomeIcon icon={faEye} className={"edit-icon"}/>}
        </div>
        <div className={"playlist-container"}>
            {!playlists && <p>A carregar...</p>}
            {playlists && <>
                {playlists.length === 0 && <p>Sem resultados</p>}
                {playlists.map(playlist => <SmallVideoCard
                    key={playlist.playlist_id}
                    id={playlist.playlist_id}
                    avatar={user.avatar}
                    thumbnail={playlist.thumbnail}
                    duration={playlist.total_time}
                    user={user.name}
                    title={playlist.title}
                    views={playlist.views}
                    created={playlist.created}
                    type={"playlist"}
                    owner={playlist.owner}
                />)}
            </>}
        </div>
        {/*  Details */}
        <div className={"details-container-4"}>
            {/*  Subscribers */}
            <h2 className={"details-title"}>Subscritores</h2>
            <div className={"subscriptions-container"}>
                {!subscribers && <p>A carregar...</p>}
                {subscribers && <>
                    {subscribers.length === 0 && <p>Sem resultados</p>}
                    {subscribers.map(subscriber =>
                        <Link key={subscriber.id}
                            // Clean videos
                              onClick={() => {
                                  setVideos([])
                              }}
                              to={"/user/" + subscriber.id} // Redirect to subscriber channel page
                              className={"subscriber-container"}>
                            <div className={"subscriber-avatar-container"}
                                 style={{backgroundImage: `url('${subscriber.avatar}')`}}>
                            </div>
                            <h5>{subscriber.name}</h5>
                        </Link>)}
                </>}
            </div>
            {/*  About */}
            <h2 className={"details-title"}>Acerca</h2>
            {user && <div className={"about-container"}>
                <p>Canal criado a {getChannelCreationDate(user.registered)}</p>
                <br/>
                <p><span>{user.total_videos}</span> videos carregados</p>
                <p><span>{user.total_playlists}</span> playlists criadas</p>
                <p><span>{user.total_views}</span> vizualizações no total</p>
                <p><span>{user.total_subscribers}</span> subscritores</p>
            </div>}
        </div>
    </div>
}

export default User;