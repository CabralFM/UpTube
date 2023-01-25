//TODO: enviar email com link para editar video após upload

const express = require("express");
const router = express.Router();
const {queryDB} = require("./../connection");
const {idGen} = require("../utils/generator.js");
const path = require("path");
const util = require("util"); // to use promisify
const ffmpeg = require('fluent-ffmpeg');
const {getVideoDurationInSeconds} = require('get-video-duration')
const fs = require("fs"); // to use readdirSync, existsSync, mkdirSync
const {checkIfVideoExists} = require("../services/videoService");
const {checkIfUserExists, userSession} = require("../services/userService");
const userService = require("../services/userService");
const videoService = require("../services/videoService");
let bodyParser = require('body-parser')
let jsonParser = bodyParser.json()


// get videos from user # [id_video, title, description, len, likes, dislikes, path, created, thumbnail, id_user]

router.get('/user/:id_user/videos', async function (req, res) {
    const id_user = req.params.id_user;
    await userService.checkIfUserExists(id_user)
    let user = await queryDB(`SELECT *
                              FROM user
                              WHERE user.id = ?`, [req.params.id_user]);

    if (user.length === 0) return res.status(400).send("there's no such user.");

    //TODO: security risk: need to show v.available ?
    let videos = await queryDB(`SELECT v.id,
                                       v.title,
                                       v.description,
                                       v.length,
                                       (SELECT COUNT(type)
                                        FROM reaction
                                        WHERE type = "like"
                                          AND v.id = reaction.id_video) AS likes,
                                       (SELECT COUNT(type)
                                        FROM reaction
                                        WHERE type = "dislike"
                                          AND v.id = reaction.id_video) AS dislikes,
                                       v.path,
                                       v.uploaded,
                                       v.modified,
                                       v.thumbnail,
                                       v.id_user                        AS id_user
                                FROM video v
                                         LEFT JOIN video_history ON video_history.id_video = v.id
                                WHERE v.id_user = ?`, [req.params.id_user]);
    res.json({success: true, videos});
})

// get video by id # [id_video, title, description, len, likes, dislikes, path, created, thumbnail, id_user]

router.get('/video/:id_video', async function (req, res) {
    //console.log("get video x");
    try {
        let videoExist = await queryDB(`SELECT *
                                        FROM video
                                        WHERE video.id = ?`, [req.params.id_video]);

        if (videoExist.length === 0) throw {message: `there's no such video`, code: 404};

        let video = await queryDB(`SELECT v.id,
                                          v.available,
                                          v.title,
                                          v.description,
                                          v.length,
                                          v.views,
                                          (SELECT COUNT(type)
                                           FROM reaction
                                           WHERE type = "like"
                                             AND v.id = reaction.id_video)                   AS likes,
                                          (SELECT COUNT(type)
                                           FROM reaction
                                           WHERE type = "dislike"
                                             AND v.id = reaction.id_video)                   AS dislikes,
                                          (SELECT u.name FROM user u WHERE u.id = v.id_user) AS username,
                                          (SELECT u.avatar FROM user u WHERE u.id = v.id_user) AS useravatar,
                                          v.path,
                                          v.uploaded,
                                          v.modified,
                                          v.thumbnail,
                                          v.id_user                                          AS id_user
                                   FROM video v
                                            LEFT JOIN video_history ON video_history.id_video = v.id
                                   WHERE v.id = ?`, [req.params.id_video]);

        const v = {
            id: video[0].id,
            available: video[0].available,
            title: video[0].title,
            description: video[0].description,
            length: video[0].length,
            views: video[0].views,
            likes: video[0].likes,
            dislikes: video[0].dislikes,
            path: video[0].path,
            uploaded: video[0].uploaded,
            modified: video[0].modified,
            thumbnail: video[0].thumbnail,
            username: video[0].username,
            useravatar: video[0].useravatar,
            id_user: video[0].id_user
        }

        res.json({success: true, video: v});
    } catch (err) {
        return res.status(err.code || 500).json({success: false, error: err.message || err});
    }
})

// post /video/video       #       upload video

router.post('/video/upload', async function (req, res) {
    try {
        // check user's session:
        await userService.userSession(req.session.id_user);

        // check if exists a file to upload:
        if (!req.files || !req.files.file) throw "no files were uploaded.";

        // create id_video + check if id_video already exists and, if so, generate a new one:
        let id_list = await queryDB(`SELECT v.id
                                     FROM video v`);
        let id_video = '';
        let idExists = false;
        do {
            idExists = false;
            id_video = idGen(11);
            id_list.map(i => {
                if (id_video === (i).id) idExists = true;
            })
        } while (idExists);

        //
        let id_user = req.session.id_user
        let reqParams = {};
        //let tag;
        let dirPath = path.join(__dirname, '/../public/uploads/', id_video);
        const file = req.files.file; // reminder: file = 'file' in form-data (postman reference)
        const fileName_ext = file.name; // file name with extension
        const fileSize = file.data.length;
        //const fileName_noExtension = path.parse(fileName).name;
        const ext = path.extname(fileName_ext); // only .extension
        const fileName = path.parse(fileName_ext).name; // file name without extension
        console.log("EXT", ext)
        const allowedExtensions = /mkv|mov|mp4|avi|wmv|mpeg-1|mpeg-2|mpeg4|mpg|mpegps|flv|3gpp|webm|dnxhr|hevc/;
        const md5 = file.md5;
        const URL = '/uploads/' + id_video + '/' + id_video + md5; //path send to DB
        const getDir = () => {
            // to output files after deleting raw file:
            console.log('\nfiles in directory:');
            let dir = fs.readdirSync(dirPath);
            dir.forEach(file => {
                console.log("console.log(file);", file);
            });
        }
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
        const rawPath = path.join(__dirname, '/../public/uploads/', id_video, '/raw_video_' + id_video + md5 + ext);
        const videoPath = path.join(__dirname, '/../public/uploads/', id_video, id_video + md5 + '.mp4');
        const thumbPath = path.join(__dirname, '/../public/uploads/', id_video, '/', 'tn_');
        util.promisify(file.mv)(rawPath);
        if (!allowedExtensions.test(ext)) throw '\nunsupported extension';
        if (fileSize > 500000000000000) throw '\nfile must be less than 476,837,158.2 Megabytes (MB)';
        let videoSeconds = 0;

        await getVideoDurationInSeconds(rawPath).then((duration) => {
            videoSeconds = duration;
        });

        reqParams.id = id_video;
        reqParams.title = fileName;
        reqParams.length = videoSeconds;
        reqParams.path = URL;
        reqParams.thumbnail = thumbPath;
        reqParams.id_user = id_user;

        await queryDB(`INSERT INTO video
                       SET ?`, reqParams);

        /*
                // first update to DB:
                await queryDB(`INSERT INTO video
                               SET ?`, {
                    id: id_video,
                    title: fileName,
                    length: videoSeconds,
                    path: videoPath,
                    thumbnail: thumbPath,
                    id_user: req.session.id_user
                });
         */

        // using ffmpeg to compile and create video and thumbnails:
        await new Promise(complied => {
            ffmpeg(rawPath) // ffmpeg('/path/to/video.avi')
                .on('filenames', async function (filenames) {
                    console.log('will generate ' + filenames.join(', '))
                })
                .on('progress', async function (progress) {
                    console.log('uploading: ' + progress.percent + '% done');
                    await queryDB(`UPDATE video
                                   SET ?
                                   WHERE id = ?`,
                        [{progress: progress.percent}, id_video]);
                })
                .on('end', async function () {
                    console.log('\nscreenshots taken');
                    fs.unlink(rawPath, (err => {
                        if (err) throw(err);
                        else console.log('raw file deleted');
                        getDir();
                        complied();
                    }));
                })
                .on('error', async function (err) {
                    console.error(err);
                })
                .screenshots({
                    // will take screens at 20%, 40%, 60% and 80% of the video
                    count: 4,
                    size: '320x?',
                    //filename: id_video + '_thumbnail-at-%s-seconds.png', > removed to simplify
                    folder: dirPath
                })
                /*
                .output(videoPath)
                //.audioCodec('libfaac') error: Audio codec libfaac is not available
                .videoCodec('libx264')
                .format('mp4');
                /*
                // for mk4:
                //.videoCodec('libx265')
                //.videoBitrate('1000k');
                */

                //TODO: como inserir isto numa var? (para poder escolher trocar entre mp4 e mk4)
                .output(videoPath)
                .videoCodec('libx264')
                .format('mp4');
        });

        // update video/progress in DB when at 100:
        await queryDB(`UPDATE video
                       SET ?
                       WHERE id = ?`, [{progress: 100}, id_video]);

        let uploadedVideo = await queryDB('SELECT * FROM video WHERE id = ?', [id_video]);

        res.json({
            success: true,
            message: "\nfile uploaded successfully",
            url: videoPath,
            video: uploadedVideo[0]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({message: err});
    }
});

// get /video/video-progress

router.get('/video/:id_video/upload-progress', async function (req, res) {
    const id_video = req.params.id_video;
    let newVideo = await queryDB('SELECT video.progress FROM video WHERE id = ?', [id_video]);
    res.json({success: true, progress: newVideo[0].progress});
});

// post /video/publish       #       publish video [title, description, len, path, thumbnail]

router.post('/video/publish/:id_video', jsonParser, async function (req, res) {
        try {
            //console.log("entrei aqui no backend")

            await userService.userSession(req.session.id_user);
            const id_video = req.params.id_video;
            const thumbnail = req.body.thumbnail;
            //const thumbPath = path.join(__dirname, '/../public/uploads/', id_video, '/', 'tn_');
            const thumbPath = path.join('/uploads/', id_video, '/', 'tn_');

            //console.log("passei a verificação do user")

            const query = await queryDB(`UPDATE video
                                         SET ?
                                         WHERE id = ?`, [{
                title: req.body.title,
                description: req.body.description,
                thumbnail: thumbPath + thumbnail
            },
                id_video]);

            //console.log("passei a query")
            //console.log("query", query);
            //console.log("thumbnail: thumbPath", thumbPath);
            //console.log("thumbnail: thumbnail", thumbnail);

            let publishedVideo = await queryDB('SELECT * FROM video WHERE id = ?', [id_video]);
            res.json({success: true, video: publishedVideo[0]});
        } catch (err) {
            res.status(500).json({message: err});
        }
    }
)
/*
// post /video/edit/:id_video       #       edit video [title, description, len, path, thumbnail]

router.post('/video/edit/:id_video', async function (req, res) {
    try {
        await userService.userSession(req.session.id_user);
        //await videoService.checkIfVideoExists(req.params.id_video);
        //console.log("passei aqui", checkIfVideoExists);
        let update = {};
        if (req.body.title) update.title = req.body.title;
        if (req.body.description) update.description = req.body.description;
        if (req.body.thumbnail) update.thumbnail = req.body.thumbnail;
        if (Object.values(update).length > 0)
            await queryDB(`UPDATE video
                           SET ?
                           WHERE id = ?`, [update, req.params.id_video]);

        let videoUpdated = await queryDB(`SELECT *
                                          FROM video
                                          WHERE video.id = ?`, [req.params.id_video]);
        res.json({success: true, videoUpdated});
    } catch (err) {
        res.status(500).json({message: err});
    }
});
 */

// post /video/delete/:id_video       #       delete video [id_video]
//TODO: middleware
router.post('/video/delete/:id_video', async function (req, res) {
    try {
        //console.log("delete video");
        if (!req.session.id_user) return res.status(401).send("please login.");

        let videoExist = await queryDB(`SELECT *
                                        FROM video
                                        WHERE video.id = ?`, [req.params.id_video]);
        if (videoExist.length === 0) return res.status(400).send("there's no such video.");

        await queryDB(`DELETE
                       FROM video
                       WHERE video.id = ?`, [req.params.id_video]);
        let videoList = await queryDB(`SELECT *
                                       FROM video`); //TODO: apagar videoList quando passarmos para frontend; ?
        res.json({success: true, videoList});
    } catch (err) {
        res.status(500).json({message: err});
    }
});

router.post('/video/:id_video/hide', async function (req, res) {
    try {
        if (!req.session.id_user) return res.status(401).send("please login.");

        let videoExist = await queryDB(`SELECT *
                                        FROM video
                                        WHERE video.id = ?`, [req.params.id_video]);
        if (videoExist.length === 0) return res.status(400).send("there's no such video.");

        await queryDB(`UPDATE video
                       SET ?
                       WHERE video.id = ?`, [{available: 0}, req.params.id_video]);

        res.json({success: true, message: "video hidden"});
    } catch (err) {
        res.status(500).json({message: err});
    }
});

router.post('/video/:id_video/unhide', async function (req, res) {
    try {
        if (!req.session.id_user) return res.status(401).send("please login.");

        let videoExist = await queryDB(`SELECT *
                                        FROM video
                                        WHERE video.id = ?`, [req.params.id_video]);
        if (videoExist.length === 0) return res.status(400).send("there's no such video.");

        await queryDB(`UPDATE video
                       SET ?
                       WHERE video.id = ?`, [{available: 1}, req.params.id_video]);

        res.json({success: true, message: "video available again"});
    } catch (err) {
        res.status(500).json({message: err});
    }
});

// TODO: atualizar histórico da pesquisa
// get/video/search       #       get search videos
router.get('/video-search', async function (req, res) {

    const search = req.query.search ? `%${req.query.search}%` : '%%';
    const videos = await queryDB(`SELECT v.id,
                                         v.thumbnail,
                                         v.length,
                                         v.title,
                                         v.uploaded,
                                         v.total_comments,
                                         v.total_likes,
                                         v.total_dislikes,
                                         v.views,
                                         u.avatar,
                                         u.name
                                  FROM video v
                                           JOIN user u ON u.id = v.id_user
                                  WHERE v.title LIKE ?
                                  GROUP BY v.id`, [search]);
    res.json({success: true, videos});
})

module.exports = router;
