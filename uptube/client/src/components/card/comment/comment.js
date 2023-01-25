/******* VIDEO PAGE *******/

import "./comment.scss";
import {Link} from "react-router-dom";
import Search from "../../layout/search/search";
import Navbar from "../../layout/navbar/navbar";
import Video from "../../card/smallVideoCard/smallVideoCard";
import VideoCard from "../../card/videoCard/videoCard";
import {setPublicationTime} from "../../../utils/auxiliarMethods";

function Comment(props) {

    let uploadedDate = props?.date.toLocaleString()

    return <div className={"comment-container"}>
        {/*** AVATAR ***/}
        <div className={"avatar-container"}
             id={'video-comment.id'}
             style={{backgroundImage: `url('${props.avatar}')`}}>
            {/*style={{backgroundImage: `url('https://th-thumbnailer.cdn-si-edu.com/2g8nKquP8amViV2k9lnR3YIfesk=/1000x750/filters:no_upscale():focal(4381x2523:4382x2524)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/e0/58/e058c2c2-b1d9-491c-abf5-973844b211a0/gettyimages-171399380.jpg')`}}>*/}
        </div>
        <div>
            <p>{props.name} <span>{setPublicationTime(uploadedDate)}</span></p>
            <p>{props.comment}</p>
        </div>
    </div>
}

export default Comment;