const express = require("express");
const router = express.Router();
const {queryDB} = require("./../connection");
const userService = require("../services/userService");
const playlistService = require("../services/playlistService");
const videoService = require("../services/videoService");
const {stringify} = require("nodemon/lib/utils");

// get /playlist/:id_playlist/title        #        retrieve playlist title
// TODO: adicionar este endpoint a coleção do postman
router.get('/:id_playlist/title', async function (req, res) {
    try {
        let playlist = await queryDB(`SELECT title FROM playlist WHERE id = ?`, [req.params.id_playlist]);
        if (playlist === 0) throw "playlist doesn't exist";
        res.json({success: true, playlist});
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
})

// get /playlist/all        #        retrieve every single playlist
router.get('/all', async function (req, res) {
    try {
        //let total_time = await queryDB(`SELECT COUNT(v.len) AS total_length FROM video v LEFT JOIN playlist_has_video AS pv ON v.id_video = pv.video_id_video WHERE v.user_id_user=?`, [req.params.id_user]);
        let playlist = await queryDB("SELECT * FROM playlist");
        //let user_has_playlist = await queryDB("SELECT * FROM user_has_playlist WHERE user_id_user");
        let playlists = await queryDB(`SELECT p.id,
                                              up.id_user,
                                              up.owner,
                                              p.title,
                                              p.description,
                                              p.type,
                                              p.total_time,
                                              p.created,
                                              p.modified
                                       FROM playlist p
                                                JOIN user_has_playlist up ON up.id_playlist = p.id`);
        if (playlist === 0) throw 'no playlists to list';
        res.json({success: true, playlists});
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
})

// get /playlist/all/:id_user        #        retrieve playlists from user x

router.get('/all/:id_user', async function (req, res) {
    try {
        //await userService.userSession(req.session.id_user); //TODO: check if needed
        let user_id = await queryDB("SELECT * FROM user WHERE user.id=?", [req.params.id_user])
        if (user_id.length === 0) throw `there's no such user`;
        // TODO: total_time será soma feita em backend e adicionado em res.json
        let user_playlists = await userService.getUserPlaylists(req.params.id_user);
        /*let user_playlists = await queryDB(`SELECT p.id,
                                                   up.owner,
                                                   p.title,
                                                   p.description,
                                                   p.type,
                                                   (SELECT COUNT(v.length) AS total_length
                                                    FROM video v
                                                             JOIN playlist_has_video AS pv ON v.id = pv.id_video) AS total_length,
                                                   p.created,
                                                   p.modified ` +
            `FROM playlist p JOIN user_has_playlist up ON p.id = up.id_playlist ` +
            `JOIN user ON user.id = up.id_user ` +
            `WHERE user.id=?`, [req.params.id_user]);*/
        if (user_playlists.length === 0) throw 'no playlist(s) found';
        res.json({success: true, user_playlists});
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});


// get /playlist/:id_playlist/all-videos        #        retrieve all videos from playlist
// TODO: adicionar este endpoint a coleção do postman
router.get('/:id_playlist/all-videos', async function (req, res) {
    try {
        await playlistService.checkIfPlaylistExists(req.params.id_playlist);
        let videos = await queryDB(`SELECT v.id, v.thumbnail, v.length, v.title, v.views, v.uploaded, GROUP_CONCAT(t.tag) AS tags
                                          FROM video v
                                          JOIN tag t ON t.id_video = v.id
                                          JOIN playlist_has_video pv ON pv.id_video = v.id
                                          WHERE pv.id_playlist = ?
                                          GROUP BY v.id`, [req.params.id_playlist]);
        res.json({success: true, videos});
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
})


// post (playlist)/user/:id_user/create-playlist        #        create playlist

router.post('/user/:id_user/create-playlist', async function (req, res) {
    try {
        await userService.checkIfUserExists(req.params.id_user); // redundant? TODO: review id_user as session
        await userService.userSession(req.session.id_user);
        let userPlaylist = await queryDB(`SELECT *
                                          FROM user_has_playlist
                                                   JOIN playlist ON id_playlist = playlist.id
                                          WHERE id_user = ?`, [req.params.id_user]);

        // checks if title already exists and emits warning
        for (let i = 0; i < userPlaylist.length; i++) {
            if (userPlaylist[i].title === req.body.title) {
                process.emitWarning('You already have a playlist with that title. Do you want to continue?');
            }
        }
        let dataInsert = await queryDB(`INSERT INTO playlist
                                        SET ?`, {
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            //TODO: count total_time?
        })
        let newPlaylistID = dataInsert.insertId;
        await queryDB(`SELECT id
                       FROM playlist `)
        await queryDB(`INSERT INTO user_has_playlist
                       SET ?`, {
            id_playlist: newPlaylistID,
            id_user: req.session.id_user,
            owner: 1
        })
        let newPlaylist = await queryDB(`SELECT *
                                         FROM playlist
                                         WHERE id = ?`, [newPlaylistID]);
        res.json({success: true, newPlaylist});
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});


// post (/user/:id_user) /edit-playlist/:id_playlist        #        edit playlist

//     ONLY THE OWNER of the playlist CAN EDIT IT
// MUST HAVE LOGGED IN

router.post('/edit/:id_playlist', async function (req, res) {
    try {
        await userService.checkIfUserExists(req.session.id_user);
        await userService.userSession(req.session.id_user);
        await playlistService.checkIfPlaylistExists(req.params.id_playlist);
        await playlistService.checkIfUserInSessionOwnsPlaylist(req.session.id_user, req.params.id_playlist)
        // update playlist:
        await queryDB(`UPDATE playlist
                       SET title       = ?,
                           description = ?,
                           type        = ?,
                           modified    = ?
                       WHERE id = ?`, [req.body.title, req.body.description, req.body.type, new Date(), req.params.id_playlist]);
        //TODO: total_time: calcular em backend?
        let playlist = await queryDB(`SELECT *
                                      FROM playlist
                                      WHERE id = ?`, [req.params.id_playlist])
        res.json({success: true, playlist});
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
})

// post (/user/:id_user) /playlist/delete/:id_playlist        #        delete playlist

//     ONLY THE OWNER of the playlist CAN DELETE IT

router.post('/delete/:id_playlist', async function (req, res) {
    try {
        await userService.checkIfUserExists(req.session.id_user);
        await userService.userSession(req.session.id_user);
        await playlistService.checkIfPlaylistExists(req.params.id_playlist);
        await playlistService.checkIfUserInSessionOwnsPlaylist(req.session.id_user, req.params.id_playlist)
        await queryDB(`DELETE
                       FROM playlist
                       WHERE playlist.id = ?`, [req.params.id_playlist])
        res.json('playlist deleted.')
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
})

// post /playlist/:id_playlist/add-user/:id_user        #        add user to playlist

//     ONLY THE OWNER of the playlist CAN ADD USER to it

router.post('/:id_playlist/add/:id_user', async function (req, res) {
    try {
        let id_user = req.params.id_user;
        let id_playlist = req.params.id_playlist;
        await userService.userSession(req.session.id_user);
        await userService.checkIfUserExists(id_user);
        await playlistService.checkIfPlaylistExists(id_playlist);
        await playlistService.checkIfUserInSessionOwnsPlaylist(req.session.id_user, req.params.id_playlist)

        let playlistHasUser = await queryDB(`SELECT *
                                             FROM user_has_playlist
                                             WHERE id_user = ?
                                               AND id_playlist = ?`,
            [id_user, id_playlist]);
        if (playlistHasUser.length > 0) throw `duplicate entry: user ${id_user} already added to playlist ${id_playlist}`;

        /*
        // verificar se o user não é o owner
        if (user[0].id_user === req.session.id_user) {
            res.status(400).send("User is already the owner of playlist.");
            return;
        }

        // verificar se o user com a sessão ativa é o owner da playlist
        let owner = await queryDB(`SELECT *
                                   FROM user_has_playlist
                                   WHERE user_id_user = ?`, [req.session.id_user])
        if (owner.length === 0) {
            res.status(400).send("Only the owner of the playlist can add another user.");
            return;
        }
         */
        await queryDB(`INSERT INTO user_has_playlist
                       SET ?`, {
            id_user: req.params.id_user,
            id_playlist: req.params.id_playlist,
            owner: 0
        })
        res.json(`user ${id_user} successfully added to playlist ${id_playlist}`);
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
})

// post /playlist/:id_playlist/delete/:id_user        #        delete user from playlist

//     ONLY THE OWNER of the playlist CAN DELETE USERS from it

router.post('/:id_playlist/delete/:id_user', async function (req, res) {
    try {
        let id_user = req.params.id_user;
        let id_playlist = req.params.id_playlist;
        await userService.userSession(req.session.id_user);
        await userService.checkIfUserExists(id_user);
        await playlistService.checkIfPlaylistExists(id_playlist);
        await playlistService.checkIfUserInSessionOwnsPlaylist(req.session.id_user, id_playlist)
        /*
        // verificar se o user não é o owner
        if (user[0].id_user === req.session.id_user) {
            res.status(400).send("Owner cannot delete himself.");
            return;
        }
        // verificar se o user com a sessão ativa é o owner da playlist
        let owner = await queryDB(`SELECT *
                                   FROM user_has_playlist
                                   WHERE user_id_user = ?`, [req.session.id_user])
        if (owner.length === 0) {
            res.status(400).send("Only the owner of the playlist can delete another user.");
            return;
        }
         */

        let playlistHasUser = await queryDB(`SELECT *
                                             FROM user_has_playlist
                                             WHERE id_user = ?
                                               AND id_playlist = ?`,
            [id_user, id_playlist]);
        if (playlistHasUser.length === 0) throw `user's not in playlist`;

        await queryDB(`DELETE
                       FROM user_has_playlist
                       WHERE id_user = ?`, [req.params.id_user])

        res.json(`user ${id_user} successfully deleted from playlist ${id_playlist}`);
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
})

// post /user/:id_user/playlist/:id_playlist/add-video/:id_video        #        add video to playlist

// SHARED PERMISSION

router.post("/:id_playlist/add-video/:id_video", async function (req, res) {
    try {
        await userService.userSession(req.session.id_user);
        //         await userService.checkIfUserExists(id_user); TODO: needed?
        await videoService.checkIfVideoExists(req.params.id_video);
        await playlistService.checkIfPlaylistExists(req.params.id_playlist);
        // check if user in session has access to playlist:
        let playlistHasUser = await queryDB(`SELECT *
                                             FROM user_has_playlist
                                             WHERE id_user = ?
                                               AND id_playlist = ?`,
            [req.session.id_user, req.params.id_playlist]);
        if (playlistHasUser.length === 0) throw `user has no permission`;
        // check if video is already in playlist:
        let playlistHasVideo = await queryDB("SELECT * FROM playlist_has_video WHERE id_video=? AND id_playlist=?",
            [req.params.id_video, req.params.id_playlist])
        if (playlistHasVideo.length > 0) throw `video is already in playlist`;
        // add video to playlist:
        await queryDB(`INSERT INTO playlist_has_video (id_playlist, id_video)
                       VALUES (?, ?);`, [req.params.id_playlist, req.params.id_video]);

        // check if video exists
        //let video = await queryDB("SELECT * FROM video WHERE id_video = ?", [req.params.id_video])
        //if (video.length === 0) {
        //    res.status(400).send("video doesn't exist.");
        //    return;
        //}

        //TODO: manter toda esta data: ?

        // playlist updated
        let playlistUpdate = await queryDB("SELECT * FROM playlist WHERE playlist.id = ?", [req.params.id_playlist])

        // videos from playlist updated
        let VideoPlaylistUpdate = await queryDB(`SELECT v.id,
                                                        v.title,
                                                        v.description,
                                                        v.path,
                                                        v.uploaded,
                                                        v.thumbnail,
                                                        v.id_user
                                                 FROM playlist_has_video pv
                                                          JOIN video v ON v.id = pv.id_video
                                                 WHERE pv.id_playlist = ?`, [req.params.id_playlist])

        res.json({
            success: true,
            data: {
                playlistUpdate,
                VideoPlaylistUpdate
            }
        })
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});

// post /user/:id_user/playlist/:id_playlist/del-video/:id_video        #        delete video from playlist

// SHARED PERMISSION

router.post("/:id_playlist/del-video/:id_video", async function (req, res) {
    try {
        await userService.userSession(req.session.id_user);
        //         await userService.checkIfUserExists(id_user); TODO: needed?
        await videoService.checkIfVideoExists(req.params.id_video);
        await playlistService.checkIfPlaylistExists(req.params.id_playlist);
        // check if user in session has access to playlist:
        let playlistHasUser = await queryDB(`SELECT *
                                             FROM user_has_playlist
                                             WHERE id_user = ?
                                               AND id_playlist = ?`,
            [req.session.id_user, req.params.id_playlist]);
        if (playlistHasUser.length === 0) throw `user has no permission`;
        // check if video is already in playlist:
        let playlistHasVideo = await queryDB("SELECT * FROM playlist_has_video WHERE id_video=? AND id_playlist=?",
            [req.params.id_video, req.params.id_playlist])
        if (playlistHasVideo.length === 0) throw `video's not in playlist`;
        // delete video from playlist:
        await queryDB("DELETE FROM playlist_has_video WHERE id_playlist = ? AND id_video = ?", [req.params.id_playlist, req.params.id_video]);
        // playlist updated
        let playlistUpdate = await queryDB("SELECT * FROM playlist WHERE playlist.id = ?", [req.params.id_playlist]);

        //TODO: manter toda esta data: ?
        // videos from playlist updated
        let videoPlaylistUpdate = await queryDB(`SELECT v.id,
                                                        v.title,
                                                        v.description,
                                                        v.path,
                                                        v.uploaded,
                                                        v.thumbnail,
                                                        v.id_user
                                                 FROM playlist_has_video pv
                                                          JOIN video v ON v.id = pv.id_video
                                                 WHERE pv.id_playlist = ?`, [req.params.id_playlist])
        res.json({
            success: true,
            data: {
                playlistUpdate,
                videoPlaylistUpdate
            }
        })
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});

module.exports = router;