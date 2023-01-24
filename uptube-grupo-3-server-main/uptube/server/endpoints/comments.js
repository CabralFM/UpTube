const express = require("express");
const router = express.Router();
const {queryDB} = require("./../connection");
const videoService = require("../services/videoService");
const userService = require("../services/userService");


// ------- retrieve comments from video x
router.get('/all/:id_video', async function (req, res) {
    try {
        if (req.params.id_video === ":id_video") throw `missing params`;
        await videoService.checkIfVideoExists(req.params.id_video);
        let comments = await queryDB(`SELECT comment.id, comment, id_user, comment.date, user.name, user.avatar
                                      FROM comment
                                               JOIN user ON id_user = user.id
                                      WHERE comment.id_video = ?`, [req.params.id_video]);
        //if (comments.length === 0) throw "no comments to show";
        res.json(comments);
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
})

// ------- retrieve comments from user x (returns id_user, username, id_comment, comment, date, id_video)

router.get('/:id_user/all', async function (req, res) {
    try {
        if (req.params.id_user === ":id_user") throw `missing params`;
        await userService.checkIfUserExists(req.params.id_user);
        let userComments = await queryDB(`SELECT comment.id_user,
                                                 user.username,
                                                 comment.id as id_comment,
                                                 comment.comment,
                                                 comment.date,
                                                 comment.id_video
                                          FROM comment
                                                   JOIN user ON id_user = user.id
                                          WHERE id_user = ?`, [req.params.id_user]);
        //if (userComments.length === 0) throw 'no user to show'
        res.json(userComments);
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
})

// ------- retrieve all comments from user x in video x (returns id_user, username, id_comment, comment, date)

router.get('/:id_user/all-in/:id_video', async function (req, res) {
    try {
        if (req.params.id_user === ":id_user") throw `missing params`;
        if (req.params.id_video === ":id_video") throw `missing params`;
        await userService.checkIfUserExists(req.params.id_user);
        await videoService.checkIfVideoExists(req.params.id_video);
        let userComments = await queryDB(`SELECT comment.id_user,
                                                 user.username,
                                                 comment.id as id_comment,
                                                 comment.comment,
                                                 comment.date,
                                                 comment.id_video
                                          FROM comment
                                                   JOIN user ON id_user = user.id
                                          WHERE id_user = ?
                                            AND id_video = ?`, [req.params.id_user, req.params.id_video]);
        //if (userComments.length === 0) throw 'no user or video to show'
        res.json(userComments);
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
})

// ------- delete comment
router.post('/del/:id_comment/:id_video', async function (req, res) {
    try {
        await userService.userSession(req.params.session); //TODO: uncomment
        // check if id_video param is not empty:
        if (req.params.id_video === ":id_video") throw `missing params`;
        // check if video exists:
        await videoService.checkIfVideoExists(req.params.id_video);
        // check if comment exists:
        let commentExists = await queryDB(`SELECT *
                                          FROM comment
                                          WHERE id = ?`, [req.params.id_comment])
        if (commentExists.length === 0) throw `comment does not exist`;
        // check if user in session is the owner of the comment, if not: 'not allowed':
        let user = await queryDB(`SELECT id_user
                                  FROM comment
                                  WHERE id = ?`, [req.params.id_comment])
        if (user[0].id_user !== req.session.id_user) throw `not allowed`; //TODO: uncomment
        // check if comment matches with video:
        let comment = await queryDB(`SELECT *
                                     FROM comment
                                     WHERE id = ?
                                       AND id_video = ?`, [req.params.id_comment, req.params.id_video])
        //console.log ("comment", comment);
        //console.log ("comment.length", comment.length);
        if (comment.length === 0) throw `not allowed`;

        // Update total_comments (video table)
        // TODO: testar
        await queryDB(`UPDATE video
                                SET total_comments =  total_comments - 1
                                WHERE video.id = ?`, [req.params.id_video]);

        // delete comment
        await queryDB(`DELETE
                       FROM comment
                       WHERE id = ? AND id_video = ?`, [req.params.id_comment, req.params.id_video])
        return res.status(201).send("comment deleted.");

    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});

// ------- add comment to video
// TODO: incrementar a variavel total_comments na tabela video.
router.post('/add/:id_user/:id_video', async function (req, res) {
    try {
        const id_video = req.params.id_video;
        const id_user = req.params.id_user;
        //await userService.userSession(req.params.session); //TODO: uncomment
        // check if video exists/is available:
        await videoService.checkIfVideoExists(id_video);
        await videoService.checkIfVideoIsAvailable(id_video);
        // add comment
        let comment = await queryDB(`INSERT INTO comment
                       SET ?`, {
            id_user: id_user,
            id_video: id_video,
            comment: req.body.comment
        })

        // Update total_comments (video table)
        // TODO: testar
        await queryDB(`UPDATE video
                                SET total_comments =  total_comments + 1
                                WHERE video.id = ?`, [req.params.id_video]);

        let newComment = await queryDB(`SELECT * FROM comment c WHERE c.id = ?`, [comment.insertId]);
        res.json({success: true, new_comment: newComment[0]});
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});


module.exports = router;