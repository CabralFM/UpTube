const express = require("express");
const router = express.Router();
const {queryDB} = require("./../connection");
const userService = require("../services/userService");
const checkIDParams = require("../utils/checkParams");
const {stringify} = require("nodemon/lib/utils");
const videoService = require("../services/videoService");

// total likes per video id
router.get('/:id_video/likes', async function (req, res) {
    try {
        let id_video = req.params.id_video;
        let reactions = await queryDB(`SELECT COUNT(type) AS Likes
                                       FROM reaction
                                       WHERE type = "like"
                                         AND id_video = ?`, [id_video]);
        if (id_video === ":id_video" || id_video === "id_video" || id_video === 0) throw `missing params`;
        res.json(reactions);
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
})

// total Dislikes per video id
router.get('/:id_video/dislikes', async function (req, res) {
    try {
        let id_video = req.params.id_video;
        if (id_video === ":id_video" || id_video === "id_video" || id_video === 0) throw `missing params`;
        let reactions = await queryDB(`SELECT COUNT(type) AS Dislikes
                                       FROM reaction
                                       WHERE type = "dislike"
                                         AND id_video = ?`, [id_video]);
        res.json(reactions);
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
})

// get reaction from user x in video x
router.get('/:id_user/get-reactions/:id_video', async function (req, res) {
    try {
        let id_video = req.params.id_video;
        let id_user = req.params.id_user;
        //await userService.checkIfUserExists(id_user); TODO: estava a dar erro na videopage. why?
        await videoService.checkIfVideoExists(id_video);
        let reactions = await queryDB(`SELECT *
                                       FROM reaction r
                                       JOIN user u ON r.id_user = u.id
                                       WHERE id_user = ?
                                         AND id_video = ?`, [id_user, id_video]);
        if (reactions.length === 0) {
            res.json({success: false, message: `empty`}); return;
        }
        res.json(reactions);
    } catch (err) {
        return res.status(err.code || 500).json({success: false, error: err.message || err});
    }
})


// add like to video
router.post('/add/like/:id_user/:id_video', async function (req, res) {
    try {
        let id_video = req.params.id_video;
        let id_user = req.params.id_user;
        let type = req.body.type;
        if (id_video === ":id_video" || id_video === "id_video" || id_video === 0)
            throw {success: false, message: 'missing params', code: 400};
        if (req.body.type !== `like` && req.body.type !== `dislike`)
            throw {success: false, message: 'reaction must be like or dislike', code: 400};
        await userService.checkIfUserExists(req.params.id_user);
        await videoService.checkIfVideoExists(id_video);
        const checkIfUserOwnsVideo = await queryDB(`SELECT v.id_user
                                                    FROM video v
                                                    WHERE v.id = ?`, [id_video]);
        if (id_user === stringify(checkIfUserOwnsVideo[0].id_user)) {
            res.json({success: false, message: `user can't like is own video`});
            return;
        }

        // check if reaction already exists in video
        let reaction = await queryDB(`SELECT *
                                      FROM reaction
                                      WHERE id_user = ?
                                        AND id_video = ?
                                      LIMIT 1`, [id_user, id_video]);

        if (reaction[0]) {
            const id_reaction = reaction[0].id;
            if (type === 'like' && type === stringify(reaction[0].type)) {
                await queryDB(`DELETE
                               FROM reaction
                               WHERE reaction.id = ?`, [id_reaction]);
                await queryDB(`SELECT total_likes
                                                        FROM video v`);
                    await queryDB(`UPDATE video
                                   SET total_likes = total_likes - 1
                                   WHERE video.id = ?`, [id_video]);
                const reactionUpdate = await queryDB(`SELECT *
                                                      FROM reaction
                                                      WHERE reaction.id`, [id_reaction]);
                res.json({success: true, reaction_update: reactionUpdate[0], message: 'like removed'});
                return;
            }
            else {
                await queryDB(`UPDATE reaction
                               SET ?
                               WHERE reaction.id = ?`, [{
                    type: 'like'
                }, id_reaction]);
                const totalUpdate = await queryDB(`SELECT total_likes, total_dislikes
                                                   FROM video v`);
                if (totalUpdate[0].length >= 0 || totalUpdate[1].length > 0) {
                    await queryDB(`UPDATE video
                                   SET total_likes    = total_likes + 1,
                                       total_dislikes = total_dislikes - 1
                                   WHERE video.id = ?`, [id_video]);
                }
                const reactionUpdate = await queryDB(`SELECT *
                                                      FROM reaction
                                                      WHERE reaction.id`, [id_reaction]);
                res.json({success: true, reaction_update: reactionUpdate[0], message: 'dislike swapped to like'});
                return;
            }
        }
        // if not, add reaction to video
        await queryDB(`INSERT INTO reaction
                       SET ?`, {
            id_user: id_user,
            id_video: id_video,
            type: type
        })
        // Update total_likes (video table)
        if (type === 'like') {
            await queryDB(`UPDATE video
                           SET total_likes = total_likes + 1
                           WHERE video.id = ?`, [id_video]);
        }

        /* NOTIFICATIONS MISSING:
        // TODO: o add reaction só está a contemplar o user a receber o like? e o user que faz o like?
        //if (req.body.id_video > 0) {
            let id_sender = req.body.id_user; <- TODO: como é que sabemos o id_sender?
            if (notificationType === 1) {
                subject = `Recebeu um like no vídeo ${video[0].title}`;
                body = `${id_sender} gostou do seu vídeo`;
            } else if (notificationType === 2) {
                subject = `Recebeu um dislike no vídeo ${video[0].title}`;

            } else if (notificationType === 3) { //não pertence aqui
                subject = `Novo comentário ao vídeo ${video[0].title}`
            }
        }
         */
        return res.status(201).json({success: true, message: 'like added'});
    } catch (err) {
        return res.status(err.code || 500).json({success: false, error: err.message});
    }
});

// add dislike to video
router.post('/add/dislike/:id_user/:id_video', async function (req, res) {
    try {
        let id_video = req.params.id_video;
        let id_user = req.params.id_user;
        let type = req.body.type;
        if (id_video === ":id_video" || id_video === "id_video" || id_video === 0)
            throw {success: false, message: 'missing params', code: 400};
        if (req.body.type !== `like` && req.body.type !== `dislike`)
            throw {success: false, message: 'reaction must be like or dislike', code: 400};
        await userService.checkIfUserExists(req.params.id_user);
        await videoService.checkIfVideoExists(id_video);
        const checkIfUserOwnsVideo = await queryDB(`SELECT v.id_user
                                                    FROM video v
                                                    WHERE v.id = ?`, [id_video]);
        console.log("passei aqui")
        console.log("checkIfUserOwnsVideo[0].id_user", checkIfUserOwnsVideo[0].id_user)
        console.log("id_user", id_user)

        if (id_user === stringify(checkIfUserOwnsVideo[0].id_user)) {
            console.log("entrei no if (id_user === checkIfUserOwnsVideo[0].id_user)")
            console.log("checkIfUserOwnsVideo[0].id_user", checkIfUserOwnsVideo[0].id_user)
            console.log("id_user", id_user)
            res.json({success: false, message: `user can't dislike is own video`});
            return;
        }

        // check if reaction already exists in video
        let reaction = await queryDB(`SELECT *
                                      FROM reaction
                                      WHERE id_user = ?
                                        AND id_video = ?
                                      LIMIT 1`, [id_user, id_video]);

        if (reaction[0]) {
            const id_reaction = reaction[0].id;
            if (type === 'dislike' && type === stringify(reaction[0].type)) {
                await queryDB(`DELETE
                               FROM reaction
                               WHERE reaction.id = ?`, [id_reaction]);
                await queryDB(`SELECT total_dislikes
                                                        FROM video v`);
                    await queryDB(`UPDATE video
                                   SET total_dislikes = total_dislikes - 1
                                   WHERE video.id = ?`, [id_video]);
                const reactionUpdate = await queryDB(`SELECT *
                                                      FROM reaction
                                                      WHERE reaction.id`, [id_reaction]);
                res.json({success: true, reaction_update: reactionUpdate[0], message: 'dislike removed'});
                return;
            }
            else {
                await queryDB(`UPDATE reaction
                               SET ?
                               WHERE reaction.id = ?`, [{
                    type: 'dislike'
                }, id_reaction]);
                const totalUpdate = await queryDB(`SELECT total_likes, total_dislikes
                                                   FROM video v`);
                if (totalUpdate[0].length > 0 || totalUpdate[1].length >= 0) {
                    await queryDB(`UPDATE video
                                   SET total_dislikes = total_dislikes + 1,
                                       total_likes    = total_likes - 1
                                   WHERE video.id = ?`, [id_video]);
                }
                const reactionUpdate = await queryDB(`SELECT *
                                                      FROM reaction
                                                      WHERE reaction.id`, [id_reaction]);
                res.json({success: true, reaction_update: reactionUpdate[0], message: 'like swapped to dislike'});
                return;
            }
        }
        // if not, add reaction to video
        await queryDB(`INSERT INTO reaction
                       SET ?`, {
            id_user: id_user,
            id_video: id_video,
            type: type
        })
        // Update total_dislikes (video table)
        if (type === 'dislike') {
            await queryDB(`UPDATE video
                           SET total_dislikes = total_dislikes + 1
                           WHERE video.id = ?`, [id_video]);
        }

        /* NOTIFICATIONS MISSING:
        // TODO: o add reaction só está a contemplar o user a receber o like? e o user que faz o like?
        //if (req.body.id_video > 0) {
            let id_sender = req.body.id_user; <- TODO: como é que sabemos o id_sender?
            if (notificationType === 1) {
                subject = `Recebeu um like no vídeo ${video[0].title}`;
                body = `${id_sender} gostou do seu vídeo`;
            } else if (notificationType === 2) {
                subject = `Recebeu um dislike no vídeo ${video[0].title}`;

            } else if (notificationType === 3) { //não pertence aqui
                subject = `Novo comentário ao vídeo ${video[0].title}`
            }
        }

         */
        return res.status(201).json({success: true, message: 'dislike added'});
    } catch (err) {
        return res.status(err.code || 500).json({success: false, error: err.message});
    }
});

/*
// DELETE reaction
router.post('/del/:id_user/:id_video/:id_reaction', async function (req, res) {
    try {
        // check if reaction exists:
        let reactionExists = await queryDB(`SELECT *
                                            FROM reaction
                                            WHERE id = ?`, [req.params.id_reaction])
        if (reactionExists.length === 0) throw `reaction does not exist`;
        // check if video exists:
        await videoService.checkIfVideoExists(req.params.id_video);
        // check if user exists:
        // TODO: user.session
        let userExists = await queryDB(`SELECT *
                                        FROM user
                                        WHERE id = ?`, [req.params.id_user])
        if (userExists.length === 0) throw `user does not exist`;
        // check if reaction matches video:
        const matchUser = await queryDB(`SELECT reaction.id_user, user.id
                                         FROM reaction
                                                  JOIN user ON id_user = user.id
                                         WHERE id_user = ?`, [req.params.id_user])
        if (matchUser.length === 0) throw `user has no reaction`;
        const matchVideo = await queryDB(`SELECT reaction.id_video, video.id
                                          FROM reaction
                                                   JOIN video ON id_video = video.id
                                          WHERE id_video = ?`, [req.params.id_video])
        if (matchVideo.length === 0) throw `video has no reaction`;

        // Update total_likes (video table)
        if (reactionExists[0].type === "like") {
            await queryDB(`UPDATE video
                           SET total_likes = total_likes - 1
                           WHERE video.id = ?`, [req.params.id_video]);
        }

        await queryDB(`DELETE
                       FROM reaction
                       WHERE id_user = ?
                         AND id_video = ?
                         AND id = ?`, [req.params.id_user, req.params.id_video, req.params.id_reaction])

        return res.status(201).send("reaction deleted.");
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }

});

 */

module.exports = router;