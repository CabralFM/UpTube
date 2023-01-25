import './edit.scss';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useForm} from "react-hook-form";
import {useHistory} from "react-router-dom";
import {useSession} from "../../../../providers/UserContext";
import {useParams} from "react-router-dom";
import {faClose, faFingerprint} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function EditVideo() {

    const userSession = useSession()?.user;
    const {id_user} = useSession();
    //const userSession = useSession()?.user[0]?.id;
    console.log("userSession", userSession);
    //console.log('useSession()?.user[0]?.id', useSession()?.user[0]?.id);
    const {id_video} = useParams();
    let history = useHistory();
    const {handleSubmit} = useForm();
    const [videoTitle, set_videoTitle] = useState('')
    const [getVideoTitle, set_getVideoTitle] = useState('')
    const [videoDescription, set_videoDescription] = useState('')
    const [getVideoDescription, set_getVideoDescription] = useState('')
    const [thumbnail, set_thumbnail] = useState('');
    const [getTags, set_getTags] = useState(null);
    const [newTag, set_newTag] = useState('');
    const [clear, setClear] = useState('');
    const clearTagInput = () => {
        setClear('');
    };

    // redirect if video does not belong to user:
    useEffect(() => {
        axios.get(`http://localhost:3001/video/${id_video}`,
            {withCredentials: true})
            .then(res => {
                //if (id_user !== res.data?.video.id_user) history.push('/homepage');
                //console.log("userSession[0].id", userSession[0].id);
                //console.log("res.data.video[0].id_user", res.data.video[0].id_user);
                //console.log("VIDEO", res.data.video);
                //set_videoTitle(res.data?.video[0].title);
                //console.log("res.data?.video.id_user", res.data?.video.id_user)
                set_getVideoTitle(res.data?.video.title);
                set_getVideoDescription(res.data?.video.description);
                console.log("getVideoTitle", getVideoTitle);
                //set_videoDescription(res.data?.video[0].description);
                console.log("videoDescription", videoDescription);
                set_thumbnail(res.data?.video.thumbnail);
                //console.log("thumbnail", thumbnail);
                console.log("SDSDSDSD", getTags);
            }).catch((e) => {
            console.log("erro", e)
            history.push('/homepage');
        });
    }, [id_video])

    axios.get(`http://localhost:3001/video/${id_video}`,
        {withCredentials: true})
        .then(res => {
            set_getVideoTitle(res.data?.video?.title);
        },)

    const editVideo = async () => {
        try {
            axios.post(`http://localhost:3001/video/publish/${id_video}`, {
                title: videoTitle,
                description: videoDescription,
                thumbnail: thumbnail
            }, {
                withCredentials: true
            }).then(res => {
                console.log("editVideo", res.request.statusText)
                history.push('/video/' + id_video);
            });
        } catch (err) {
            console.log('err', err.response.data)
        }
    }

    // VIDEO TAGS:

    //get tags from video:
    useEffect(() => {
        axios.get(`http://localhost:3001/tags/all-video/${id_video}`,
            {
                withCredentials: true
            })
            .then(res => {
                set_getTags(res.data);
            })
    }, [newTag, clear])

    //add tags to video:
    const addTag = async (e) => {
        try {
            e.preventDefault();
            axios.post(`http://localhost:3001/tags/add/${id_video}`,
                {
                    tag: newTag,
                    id_user: userSession.id, // TODO: rever isto com a Margarida
                },
                {
                    withCredentials: true
                }).then(res => {
                console.log("addTag status: ", res.request.statusText);
            })
            clearTagInput(e);
        } catch (err) {
            console.log('err', err.response.data)
        }
    }

    //delete tags from video:
    async function removeTag(e, id_tag) {
        try {
            e.preventDefault();
            axios.post(`http://localhost:3001/tags/del/${id_video}/${id_tag}`,
                {
                    id_user: id_user
                },
                {
                    withCredentials: true
                }).then(res => {
                set_newTag(e.target.value);
                console.log("removeTag status: ", res.request.statusText);
            })
            clearTagInput(e);
        } catch (err) {
            console.log('err', err.res)
        }
    }


    return <div className="videoedit-page">
        <div className="first-videoedit-container">
            <div className="second-videoedit-container">
                <h1 className="videoedit-page-title">Edite o seu vídeo</h1>
                <div className="videoedit-options-root-container">
                    <div className="videoedit-options-container-one">
                        <div className="videoedit-options-container-span-box">
                            <div className="videoedit-options-pick-thumb">Escolher Thumbnail</div>
                            <div className="videoedit-options-id-video">
                                <FontAwesomeIcon className={"videoedit-fingerprint"} icon={faFingerprint}/>
                                <span id="videoedit-fingerprint-text">Your video ID:</span>
                                <div id="videoedit-fingerprint-box">
                                    <span id="videoedit-fingerprint-id">{id_video}</span>
                                </div>
                            </div>
                        </div>
                        <div className="videoedit-options-instructions">Escolha uma thumbnail para a capa do seu
                            vídeo
                        </div>
                        <div className="videoedit-options-photos-container">
                            <div
                                className={"videoedit-choose-thumbnail " + (thumbnail === '1.png' ? "selected-thumbnail" : "")}
                                style={{backgroundImage: `url(http://localhost:3001/uploads/${id_video}/tn_1.png)`}}
                                onClick={() => {
                                    set_thumbnail('1.png')
                                }}>
                                <span className="thumb-hovertext">Escolher como capa</span>
                            </div>
                            <div
                                className={"videoedit-choose-thumbnail " + (thumbnail === '2.png' ? "selected-thumbnail" : "")}
                                style={{backgroundImage: `url(http://localhost:3001/uploads/${id_video}/tn_2.png)`}}
                                onClick={() => {
                                    set_thumbnail('2.png')
                                }}>
                                <span className="thumb-hovertext">Escolher como capa</span>
                            </div>
                            <div
                                className={"videoedit-choose-thumbnail " + (thumbnail === '3.png' ? "selected-thumbnail" : "")}
                                style={{backgroundImage: `url(http://localhost:3001/uploads/${id_video}/tn_3.png)`}}
                                onClick={() => {
                                    set_thumbnail('3.png')
                                }}>
                                <span className="thumb-hovertext">Escolher como capa</span>
                            </div>
                            <div
                                className={"videoedit-choose-thumbnail " + (thumbnail === '4.png' ? "selected-thumbnail" : "")}
                                style={{backgroundImage: `url(http://localhost:3001/uploads/${id_video}/tn_4.png)`}}
                                onClick={() => {
                                    set_thumbnail('4.png')
                                }}>
                                <span className="thumb-hovertext">Escolher como capa</span>
                            </div>
                        </div>
                    </div>
                    <div className="videoedit-options-container-two">
                        <div className="videoedit-options-data-info">Dados do vídeo</div>
                        <form className="videoedit-form-container" onSubmit={handleSubmit(editVideo)}>
                            {/* TODO: desactivar enter dentro dos inputs?*/}
                            <p><input type="text" defaultValue={getVideoTitle}
                                      className="videoedit-options-title-input" minLength="4"
                                      placeholder=" Título do vídeo"
                                      onChange={(e) => {
                                          set_videoTitle(e.target.value);
                                      }}/></p>
                            <div>
                            <textarea className={"videoedit-options-title-input"}
                                      defaultValue={getVideoDescription}
                                      id="videoedit-options-description-input" required minLength="5"
                                      placeholder=" Descrição do vídeo"
                                      onChange={(e) => {
                                          set_videoDescription(e.target.value)
                                      }}/>
                            </div>
                            <div className="videoedit-final-container">
                                <div className="videoedit-tags-title">Tags</div>
                                <div className="videoedit-options-tags-box">
                                    <div className="videoedit-tags">
                                        <div>

                                            <label htmlFor="videoedit-tags-input"></label>
                                            <input type="text" id="videoedit-tags-input"
                                                   placeholder=" Adicionar (sem #)"
                                                   onChange={(e) => {
                                                       set_newTag(e.target.value);
                                                       setClear(e.target.value);
                                                   }}
                                                   value={clear}/>
                                            <input id="videoedit-options-tag-submit" type="button" value="+"
                                                   onClick={addTag}/>
                                        </div>
                                        {!getTags && <p>O vídeo ainda não tem tags</p>}
                                        {getTags && <>
                                            {getTags.length === 0 && <p>O vídeo ainda não tem tags</p>}
                                            <div className="videoedit-options-tags-list">
                                                {getTags.map((tag, index) => {
                                                    return <div key={index} className={'video-edit-each-tag'}>
                                                        <span className={'videoedit-options-tags-list-tag-name'}>{tag.tag}</span>
                                                        <FontAwesomeIcon
                                                            icon={faClose} onClick={(e) => removeTag(e, tag.id)}/>
                                                    </div>
                                                })}
                                                {/*getTags.map(vet => <div className={"video-edit-each-tag"}>
                                                    {'#' + vet.tag + ' '}
                                                    <span className={"video-edit-each-tag-x"}><FontAwesomeIcon
                                                        icon={faClose} onClick={removeTag}/></span>
                                                </div>)*/}
                                            </div>
                                        </>}
                                    </div>
                                    <input id="videoedit-options-submit" type="submit"
                                           value="Finalizar Edição"></input>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default EditVideo;