/******* VIDEO PAGE *******/

import "./videopage.scss";
import {useHistory, useParams} from "react-router-dom";
import Video from "../../card/smallVideoCard/smallVideoCard";
import Comment from "../../card/comment/comment";
import {useSession} from "../../../providers/UserContext";
import React, {useEffect, useState} from "react";
import axios from "axios";
import VideoCard from "../../card/videoCard/videoCard";
import ReactPlayer from 'react-player'
import SmallVideoCard from "../../card/smallVideoCard/smallVideoCard";

function VideoPage() {

    //TODO: links dos vídeos com query ao invés de params?

    const history = useHistory();
    const userSession = useSession();
    const {id_user, refresh} = useSession();
    const {id_video} = useParams();
    const [video, setVideo] = useState(null);
    const [trends, setTrends] = useState(null);
    const [getTags, set_getTags] = useState([]);
    const [getComments, set_getComments] = useState([]);
    const [getUploadedDate, set_getUploadedDate] = useState('');
    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [comment, set_comment] = useState('');
    const [clear, setClear] = useState('');
    const [getSubscribers, set_getSubscribers] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [subscribeButton, set_subscribeButton] = useState(true);
    const [suggestedVideos, setSuggestedVideos] = useState(null);
    const clearTagInput = () => {
        setClear('');
    };

    function refreshVideo() {
        axios.get(`http://localhost:3001/video/${id_video}`,
            {withCredentials: true})
            .then(res => {
                if (res.data?.success === false) {
                    history.push("/homepage");
                }
                if (id_user === res.data?.video?.id_user) {
                    set_subscribeButton(false);
                }
                setVideo(res.data?.video);
                console.log("loaded refreshVideo");
                set_getUploadedDate(res.data?.video?.uploaded);
            }).catch((e) => {
            console.log("erro", e)
            history.push('/homepage');
        })
    }

    // redirect if video not available &&, if available, get info:
    useEffect(() => {
        refreshVideo()
    }, [id_video])

    // TODO: confirmar as dependências dos useEffect's
    if (video?.available === 0) history.push('/homepage');

    //TODO: ver endpoint no backend, devolver objecto vazio se não encontrar
    //load reaction from user:
    useEffect(() => {
        axios.get(`http://localhost:3001/reactions/${id_user}/get-reactions/${id_video}`,
            {
                withCredentials: true
            })
            .then(res => {
                if (res?.data[0]?.type === 'like') {
                    setLike(!like);
                }
                if (res?.data[0]?.type === 'dislike') {
                    setDislike(!dislike);
                }
            }).catch((e) => {
            console.log("erro", e)
            //TODO: ERRO AQUI ^
        })
    }, [id_video])

    // ADD NOTIFICATION
    async function addNotification(id_receiver, type, id_type, mail) {
        axios.post(`http://localhost:3001/notification/${id_receiver}`, {
            type: type,
            id_sender: id_user,
            id_comment: id_type,
            id_video: id_video,
            mail: mail
        }, {withCredentials: true})
            .then(res => {
                console.log("notification status: ", res.status);
                console.log(`notification sent to user ${id_receiver}`, res.data);
            }).catch((e) => {
            console.log("erro", e)
        });
    }

    // SUGGESTED VIDEOS
    useEffect(() => {
        axios.get(`http://localhost:3001/user/suggestedVideos`)
            .then(response => {
                setSuggestedVideos(response.data.suggestedVideos);
            })
    }, []);

    const videoOwner = video?.id_user;
    const id_subscribed = videoOwner;

    // info de user a partir de userSession, não precisa de endpoint

    // get tags from video:
    useEffect(() => {
        axios.get(`http://localhost:3001/tags/all-video/${id_video}`,
            {
                withCredentials: true
            })
            .then(res => {
                set_getTags(res.data)
                console.log("tags", getTags)
                console.log("USER", userSession)
            }).catch((e) => {
            console.log("erro", e);
        })
    }, [id_video])

    // SUBSCRIBE
    const handleSubscribe = async (id_subscribed) => {
        axios.post(`http://localhost:3001/user/subscriber/${id_subscribed}/insert`,
            {withCredentials: true})
            .then(res => {
                console.log(`user ${id_user} subscribed user ${id_subscribed}`, res.data);
                setSubscribed(true);
                refreshSubscribers();
            });
    }

    const handleUnsubscribe = async (id_subscribed) => {
        axios.post(`http://localhost:3001/user/subscriber/${id_subscribed}/delete`,
            {withCredentials: true})
            .then(res => {
                console.log(`user ${id_user} unsubscribed user ${id_subscribed}`, res.data);
                setSubscribed(false);
                refreshSubscribers();
            });
    }

    function refreshSubscribers() {
        axios.get(`http://localhost:3001/user/${videoOwner}/subscribers`,
            {withCredentials: true})
            .then(res => {
                console.log(`subscribers of user ${videoOwner}: `, getSubscribers.subscribers)
                if (res?.data?.success === true) {
                    for (let i = 0; i < res?.data.subscribers?.length; i++) {
                        if (res?.data.subscribers[i]?.id === id_user) {
                            setSubscribed(true);
                        } else {
                            setSubscribed(false);
                        }
                    }
                }
            }).catch((e) => {
            console.log("erro", e)
        })
    }

    useEffect(() => {
        if (video)
            refreshSubscribers();
    }, [video])

    // COMMENTS

    // get comments from video: (name, time, comment)
    useEffect(() => {
        axios.get(`http://localhost:3001/comments/all/${id_video}`,
            {
                withCredentials: true
            })
            .then(res => {
                set_getComments(res.data)
                console.log("getComments", getComments)
            }).catch((e) => {
            console.log("erro", e)
        })
    }, [id_video])

    //TODO: ordenar comentários, em cima ficam os mais recentes

    function refreshComments() {
        axios.get(`http://localhost:3001/comments/all/${id_video}`,
            {
                withCredentials: true
            })
            .then(res => {
                set_getComments(res.data)
                console.log("getComments", getComments)
            }).catch((e) => {
            console.log("erro", e)
        })
    }

    // add comment to video:
    const addComment = async (e) => {
        try {
            e.preventDefault();
            await axios.post(`http://localhost:3001/comments/add/${id_user}/${id_video}`, {
                comment: comment
            }, {
                withCredentials: true
            }).then(res => {
                refreshComments();
                clearTagInput(e);
                setButtonsEnabled(false);

                // send notification and checking if user owns video or not:
                if (videoOwner !== id_user) addNotification(videoOwner, 3, res.data.new_comment.id, 1);
                else addNotification(videoOwner, 3, res.data.new_comment.id, 0);

            });
        } catch (err) {
            console.log('err', err)
        }
    }

    // buttons
    let [buttonsEnabled, setButtonsEnabled] = useState(false);
    const handleCommentButton = (e) => {
        set_comment(e.target.value);
        setClear(e.target.value);
        setButtonsEnabled(true);

    }
    const handleCancelButton = (e) => {
        setClear(e.target.value);
        setButtonsEnabled(false);
    }

    // add reactions to video:
    const addLike = async (e) => {
        try {
            axios.post(`http://localhost:3001/reactions/add/like/${id_user}/${id_video}`, {
                type: 'like'
            }, {withCredentials: true})
                .then(res => {
                    setLike(true);
                    setDislike(false);
                    setVideo({...video, likes: res.data?.video?.likes, dislikes: res.data?.video?.dislikes})
                    refreshVideo();
                    console.log(res.data);
                });
        } catch (err) {
            console.log('err', err.response.data);
        }
    };
// ; refresh();

    const addDislike = async (e) => {
        try {
            axios.post(`http://localhost:3001/reactions/add/dislike/${id_user}/${id_video}`, {
                type: 'dislike'
            }, {withCredentials: true})
                .then(res => {
                    setDislike(true);
                    setLike(false);
                    setVideo({...video, likes: res.data?.video?.likes, dislikes: res.data?.video?.dislikes})
                    refreshVideo();
                    console.log(res.data);
                });
        } catch (err) {
            console.log('err', err.response.data);
        }
    };

    return <div className={"video-page"}>
        <div className={"video-page-video-container"}>
            <VideoCard
                videoOwner={video?.id_user}
                id_video={id_video}
                path={video?.path}
                ownerName={video?.username}
                ownerAvatar={video?.useravatar}
                tags={getTags}
                title={video?.title}
                views={video?.views}
                uploaded={getUploadedDate}
                likes={video?.likes}
                dislikes={video?.dislikes}
                like={like}
                dislike={dislike}
                subscribeButton={subscribeButton}
                subscribed={subscribed}
                id_subscribed={id_subscribed}
                handleSubscribe={handleSubscribe}
                handleUnsubscribe={handleUnsubscribe}
                addLike={addLike}
                addDislike={addDislike}
            />
            <div className={"video-description"}>
                {/*Descrição*/}
                {video?.description}
            </div>
            {userSession.id_user &&
                <form>
                    <div className={"comments-container"}>
                        {/*** AVATAR ***/}
                        <div className={"avatar-container"}
                             style={{backgroundImage: `url('https://th-thumbnailer.cdn-si-edu.com/2g8nKquP8amViV2k9lnR3YIfesk=/1000x750/filters:no_upscale():focal(4381x2523:4382x2524)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/e0/58/e058c2c2-b1d9-491c-abf5-973844b211a0/gettyimages-171399380.jpg')`}}>
                        </div>
                        {/*Escrever comentário...*/}
                        <input className="videopage-comments-input" type="text"
                               placeholder=" Comente este vídeo"
                               value={clear}
                               onChange={handleCommentButton}/>
                    </div>
                    {buttonsEnabled &&
                        <div className={"videopage-comment-buttons-box"}>
                            <button className={"videopage-cancel-button"} onClick={handleCancelButton}>Cancelar
                            </button>
                            <button className={"videopage-comment-button"} onClick={addComment} onChange={(e) => {
                                setButtonsEnabled(true);
                            }}>Comentar
                            </button>
                        </div>}
                </form>}
            <div className={"other-comments-container"}>
                {getComments && <>
                    {getComments?.length === 0 &&
                        userSession.id_user &&
                        <p className={"videopage-no-comments"}>Este vídeo ainda não tem comentários.</p>}
                    {!userSession.id_user &&
                        <p className={"videopage-no-comments"}>Para se registar no UPtube e comentar este vídeo,
                            clique <span
                                id={"click-here-to-register"}
                                onClick={() => history.push('/register')}>aqui</span></p>}
                    {getComments.map(comment => <Comment
                        key={comment.id}
                        {...comment}
                    />)}
                </>}
            </div>
        </div>
        <div className={"suggested-videos-main-container"}>
            <h4>Videos sugeridos</h4>
            <div className={"suggested-videos-side-container"}>
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
                        type={"suggested"}
                    />)}
                </>}
            </div>
        </div>
    </div>
}

export default VideoPage;