//TODO: check TODO's in file

import './upload.scss';
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useForm} from "react-hook-form";
import * as FormData from 'form-data';
import {ProviderUser, useSession} from "../../../../providers/UserContext";
import {Redirect, useHistory, useParams} from "react-router-dom";
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';

import {faFingerprint, faUpload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Upload() {

    // getting USER ID
    //const userSession = useSession([0]).user; // id_user from user in session
    //const userSession = useSession().user[0].id;
    const userSession = useSession()?.user;
    //console.log('userSession', userSession);
    console.log('userSession', userSession);

    const [dragActive, setDragActive] = useState(false);
    const wrapper = useRef(null);
    const [progress, setProgress] = useState(0); // for video progress
    let history = useHistory();
    useEffect(() => {
        console.log('video progress: ', progress)
    }, [progress]);
    const [phase, setPhase] = useState(1);
    const [load, setLoad] = useState(false); //TODO check this
    // useForm:
    const {register, handleSubmit, formState, watch, reset} = useForm();
    // set publish:
    const [publishVideo, setPublishVideo] = useState(false);
    // id_video:
    const [id_video, setIdVideo] = useState(null);
    // thumbnails:
    const [thumbnail, setThumbnail] = useState(1);

    const handleDrag = (e) => { // (e)vents triggered by dragging
        e.preventDefault(); // cancels/prevents default event behavior
        e.stopPropagation(); // stops event from propagating up the DOM tree
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
        if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = async (e) => { // triggered by drop
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files[0] > 1) throw "please drag only one file at a time.";
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await Up(e.dataTransfer.files[0])
            setLoad(true);
        }
    };

    // UPLOAD VIDEO AXIOS.POST FUNCTION:

    async function Up(file) { // added filenames
        setPhase(2);
        //const {id_video} = useParams();
        try {
            let formData = new FormData();
            // appends new value onto an existing key inside a formData object:
            formData.append('file', file); //TODO: file.name needed or backend handles it?

            await axios.post(`http://localhost:3001/video/upload`, formData, { // TODO: what?
                headers: {'Content-Type': 'multipart/form-data'}, withCredentials: true, // TODO: get rid of repetition
                onUploadProgress: (progressAEvent) => {
                    const {loaded, total} = progressAEvent;
                    const progress = Math.floor((loaded * 100) / total);
                    setProgress(progress);
                }
            }).then(res => {
                let id_video = res.data.video.id;
                setIdVideo(res.data.video.id); //TODO: use (let) id_video

                let interval = setInterval(async () => {
                    let fill = await axios.get(`http://localhost:3001/video/${id_video}/upload-progress`, {
                        withCredentials: true
                    })
                    setProgress(fill.data.progress);
                    //setPhase(3);
                    if (fill.data.progress === 100) {
                        clearInterval(interval);
                    }
                }, 3000);
                history.push('/video/edit/' + id_video)
            })
        } catch (err) {
            console.error(err.response.data); // shows the real error
        }
    }

    const handleClick = async (e) => { // triggered by clicking pt.1
        e.preventDefault();
        e.stopPropagation();
        //if (e.target.files[0] > 1) throw "please video only one file at a time.";
        if (e.target.files && e.target.files[0]) {
            await Up(e.target.files[0]);
            setLoad(true);
        }
    };

    const onClick = () => { // triggered by clicking pt.2
        wrapper.current.click();
    };

    const videoData = async (values) => {

        const videoInput = {
            title: values.title,
            description: values.description,
            thumbnail: `http://localhost:3001/thumbnail/${id_video}/tn_${thumbnail}.png?`,
        };

        try {
            await axios.post(`http://localhost:3001/video/publish/${id_video}`, {videoInput}, {withCredentials: true}).then((res) => {
                if (res.statusText === 'OK') {
                    setPublishVideo(true);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    /*
    const videoData = data => {
        axios.post(`http://localhost:3001/video/publish/${id_video}`,
            {
                title: data.title,
                description: data.description,
                thumbnail: data.selectedThumb
            }, {withCredentials: true}).then((res) => {
            console.log(res);
            if (res.statusText === 'OK') setPublishVideo(true);
        });

    }
    */

    //if (publishVideo) return <Redirect to={`/homepage`}/> //TODO: what is this?


    return <div className="video-upload-page">
        <div className="first-upload-container">
            <div className="second-upload-container">
                {/*!useSession && <p className="please-login">please login</p>*/}
                {/*useSession.length === 0 && <p className="please-login">please login</p> TODO: fix this*/}
                {phase === 1 ?
                    <h1 className="video-upload-page-title">Upload de um novo vídeo</h1>
                    : phase === 2 ?
                        <h1 className="video-upload-page-title">Upload de um novo vídeo</h1>
                        :
                        <h1 className="video-upload-page-title">Upload concluído</h1>}
                {phase === 1 &&
                    <>
                        <form className="third-upload-container" onDragEnter={handleDrag}
                              onSubmit={(event) => event.preventDefault()}>
                            <input ref={wrapper} type="file" id="input-upload" multiple={false}
                                   onChange={handleClick}/>
                            <label id="label-upload" htmlFor="input-upload"
                                   className={dragActive ? "active" : "" /* TODO: fix */}>
                                <div className="drag-container">
                                    <div className="drag-invitation">
                                        <div><FontAwesomeIcon icon={faUpload} className="icon-upload"/></div>
                                        <div id="drag-text">
                                            <p id="drag-text-one">Arraste para aqui o vídeo ou clique</p>
                                            <p id="drag-text-two">para escolher o ficheiro</p>
                                        </div>
                                    </div>
                                    {/*TODO: <button> or <div> ?*/}
                                    <button className="upload-pseudo-button" onClick={onClick}></button>
                                    {/*</button>*/}
                                </div>
                            </label>
                            {dragActive &&
                                <div id="drag-area" onDragEnter={handleDrag} onDragLeave={handleDrag}
                                     onDragOver={handleDrag} onDrop={handleDrop}></div>}
                        </form>
                    </>}
                {phase === 2 &&
                    <>
                        <div className="third-upload-container">
                            <div id="label-upload">
                                <CircularProgressbar
                                    value={progress}
                                    styles={buildStyles({
                                        // Rotation of path and trail, in number of turns (0-1)
                                        rotation: 0.25,

                                        // whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                        strokeLinecap: 'round',

                                        // text size
                                        textSize: '12px',

                                        // how long animation takes to go from one percentage to another, in seconds
                                        //pathTransitionDuration: 2, //TODO: só demora porque forcei
                                        pathTransitionDuration: 0.5,

                                        // can specify path transition in more detail, or remove it entirely
                                        // pathTransition: 'none',

                                        // colors
                                        pathColor: `rgba(62, 152, 199, ${progress / 100})`,
                                        //textColor: '#3e98c7',
                                        trailColor: '#d6d6d6',
                                        backgroundColor: '#eeeeee',
                                        color: '#eeeeee'
                                    })}
                                    text={`${progress}%`}/>
                                <div className="progress-container">
                                    <div className="progress-bar">
                                <span className="progress-bar-fill"
                                      style={{width: progress + "%"}}></span>
                                    </div>
                                    <div className="loading-video-text">
                                        <p>A carregar o seu vídeo, por favor aguarde...<br/>
                                        Será brevemente transferido para a página de edição.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>}
            </div>
        </div>
    </div>
}

export default Upload;