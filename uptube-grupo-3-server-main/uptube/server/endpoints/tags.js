const express = require("express");
const router = express.Router();
const {queryDB} = require("./../connection");
const videoService = require("../services/videoService");
const userService = require("../services/userService");


// add tag to video (session active)
router.post('/add/:id_video', async function (req, res) {

    try{
        //await userService.userSession(req.params.session);
        // check if video exists:
        //await videoService.checkIfVideoExists(req.params.id_video);
        // check if tag exists and matches video:
        let tag = await queryDB(`SELECT * FROM tag WHERE tag = ? AND id_video = ?`,[req.body.tag, req.params.id_video])
        if (tag.length > 0) throw {message: 'tag already exists', code: 400};

        // check if user owns video:
        let videoUser = await queryDB(`SELECT * FROM video WHERE id = ? AND id_user = ?`,[req.params.id_video, req.session.id_user])
        if (videoUser.length === 0) throw {message: `user is not the owner of video`, code: 403};

        // add new tag
        await queryDB(`INSERT INTO tag SET ?`, {
            id_user: req.body.id_user, // TODO: secure?
            //id_user: user[0].id_us,
            id_video: req.params.id_video,
            tag: req.body.tag
        })
        return res.status(201). send("tag added");
    }
    catch (err) {
        return res.status(err.code || 500).json({success: false, error: err.message || err});
    }
});

// delete tag done by user on it´s video
router.post('/del/:id_video/:id_tag(\\d+)', async function (req, res) {
    try{
        console.log("SESSION", req.session.id_user)
        await userService.userSession(req.session.id_user);
        // check if video exists:
        await videoService.checkIfVideoExists(req.params.id_video);
        // check if tag exists and matches video:
        let tag = await queryDB(`SELECT * FROM tag WHERE id = ? AND id_video = ?`,[req.params.id_tag, req.params.id_video])
        console.log("TAG", tag);
        console.log("tag.length", tag.length );
        if (tag.length === 0) throw {message: 'tag does not exist', code: 400};
        // check if user owns video:
        let videoUser = await queryDB(`SELECT * FROM video WHERE id = ? AND id_user = ?`,[req.params.id_video, req.session.id_user])
        if (videoUser.length === 0) throw {message: `user is not the owner of video`, code: 403};
        // delete tag
        await queryDB(`DELETE FROM tag WHERE id = ?`, [req.params.id_tag])
        return res.status(201). send('tag deleted');
    }
    catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});

/*
// delete tag done by user on it´s video
router.post('/del/:id_tag/:id_video', async function (req, res) {
    try{
        await userService.userSession(req.params.session); //TODO: uncomment
        // check if video exists:
        await videoService.checkIfVideoExists(req.params.id_video);
        // check if tag exists and matches video:
        let tag = await queryDB(`SELECT * FROM tag WHERE id = ? AND id_video = ?`,[req.params.id_tag, req.params.id_video])
        if (tag.length === 0) throw 'tag does not exist';
        // check if user owns video:
        let videoUser = await queryDB(`SELECT * FROM video WHERE id = ? AND id_user = ?`,[req.params.id_video, req.session.id_user])
        if (videoUser.length === 0) throw `user can only delete his own tags`;
        // delete tag
        await queryDB(`DELETE FROM tag WHERE id = ?`, [req.params.id_tag])
        return res.status(201). send('tag deleted');
    }
    catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});
 */


// ------- retrieve tags from video
router.get('/all-video/:id_video', async function (req, res) {
    try {
        // check if video exists:
        await videoService.checkIfVideoExists(req.params.id_video);
        let tagsVideo = await queryDB(`SELECT tag, id
                                       FROM tag
                                       WHERE id_video = ?`, [req.params.id_video]);
        //if (tagsVideo.length === 0) throw 'no tags to show';
        res.json(tagsVideo);
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
})

// ------- retrieve tags from user per videos

router.get('/all-user/:id_user', async function (req, res) {
    try {
        await userService.checkIfUserExists(req.params.id_user);
        let tagsUser = await queryDB(`SELECT tag.id_user, user.username, tag.tag, tag.id, tag.id_video
                                      FROM tag
                                               JOIN user ON id_user = user.id
                                      WHERE id_user = ?`, [req.params.id_user]);
        if (tagsUser.length === 0) throw 'no tags to show';
        res.json(tagsUser);
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
})

module.exports = router;



