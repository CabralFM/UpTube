const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {queryDB} = require("../connection");
const userService = require("../services/userService");
const videoService = require("../services/videoService");
const emailService = require("../services/emailService");
const {tokenGen} = require("../utils/generator");
const {checkSession} = require("../utils/checkSession");
const path = require("path");
const fs = require("fs");
const {stringify} = require("nodemon/lib/utils");

// ------- Session

router.get("/session", checkSession, async function (req, res) {

    let userSession = req.session.id_user;

    try {
        await userService.userSession(userSession);
        let user = await userService.getUserSessionInfoById(userSession);
        let tags = await userService.getUserTags(userSession);
        res.json({success: true, user, tags});
    } catch (e) {
        res.status(500).json({success: false, error: e});
    }
});

// ------- Register

router.post('/register', async function (req, res) {

    let userName = req.body.username;
    let userEmail = req.body.email;
    let creationDate = new Date();
    let password = req.body.password;
    let userPassword = await bcrypt.hash(password, 12);

    try {
        await userService.checkIfEmailIsAvailable(userEmail);
        await userService.insertUser(userName, userEmail, userPassword, creationDate);
        let user = await userService.getUserInfoByEmail(userEmail);
        res.status(200).json({success: true, user});
    } catch (e) {
        res.status(409).json({success: false, error: e});
    }
})

// ------- Login

router.post(`/login`, async function (req, res) {
    let userPassword = req.body.password;
    let userEmail = req.body.email;

    try {
        await userService.checkIfUserExistsByEmail(userEmail);
        await userService.userLogin(userEmail, userPassword);
        let user = await userService.getUserInfoByEmail(userEmail);
        req.session.id_user = user[0].id; // create session
        res.json({success: true, user});
    } catch (e) {
        res.json({success: false, error: e});
    }
})

// ------- Logout

router.post("/logout", function (req, res) {
    req.session.destroy();
    res.send("Logged out");
});

// ------- Password

//  Recover password

router.post("/recover-password", async function (req, res) {
    let userEmail = req.body.email;

    try {
        await userService.checkIfUserExistsByEmail(userEmail);
        let subject = "Recover your password"
        //---> Felicio: era isso ao invés da linha de baixo
        let tokenGenPw = tokenGen(38);
        //let tokenLink = tokenGen(38); // TODO: confirmar;
        // Felicio: a linha abaixo let link nao existia
        //let link = "http://localhost:3000/homepage"
        // TODO: como adionar o link ao email.
        /*let body = `Requested the change of the password.
                    To reset your password, click on the following link ${link}."`*/

        let body = `Para alterar a password, click no link abaixo:
                    "http://localhost:3000/changePw/+${tokenGenPw}"`


        await emailService.emailService(userEmail, subject, body);
        res.json({success: true, message: "Email successfully sent."});
    } catch (e) {
        res.json({success: false, error: e});
    }
});

//  update password

router.post("/update-password", async function (req, res) {

    let userEmail = req.body.email;
    let password = req.body.password;
    let userPassword = await bcrypt.hash(password, 12);

    try {
        await userService.checkIfUserExistsByEmail(userEmail);
        await userService.updatePassword(userEmail, userPassword);
        // TODO: Que informação devemos mostrar do utilizador?
        let user = await userService.getUserInfoByEmail(userEmail);
        res.json({success: true, user});
    } catch (e) {
        res.json({success: false, error: e});
    }
});

// ------- User

// Retrieve all users

router.get('/all', async function (req, res) {
    try {
        let users = await userService.getAllUsers();
        res.json({success: true, users});
    } catch (e) {
        res.json({success: false, error: e});
    }
});

// Retrieve user x data

router.get('/:id_user(\\d+)', async function (req, res) {
    let userId = req.params.id_user;

    try {
        await userService.checkIfUserExists(userId);
        res.json({
            success: true,
            data:
                {
                    info: await userService.getUserPageInfoById(req.params.id_user),
                    tags: await userService.getUserTags(req.params.id_user),
                    achievements_unlocked: await userService.getUserUnlockedAchievements(req.params.id_user),
                    achievements_locked: await userService.getUserLockedAchievements(req.params.id_user),
                    // TODO: delete videos
                    //videos: await userService.getUserVideos(req.params.id_user),
                    playlists: await userService.getUserPlaylists(req.params.id_user),
                    subscribers: await userService.getUserPageSubscribers(req.params.id_user)
                }
        })
    } catch (e) {
        res.json({success: false, error: e});
    }
});

// Retrieve user videos data
// TODO: ver melhor com o João porque em video.js já existe um endpoint que faz o mesmo.
router.get('/:id_user(\\d+)/uploaded-videos', async function (req, res) {

    let userId = req.params.id_user;
    let limit = req.query.limit;
    let offset = req.query.offset;

    try {
        await userService.checkIfUserExists(userId);
        let videos = await userService.getUserVideos(userId, limit, offset);
        let totalVideos = await userService.getTotalUserVideos(userId);
        let pages = Math.ceil(totalVideos[0].total_videos / limit);
        res.json({
            success: true,
            pages,
            videos
        })
    } catch (e) {
        res.json({success: false, error: e});
    }
});

// Edit user with active session

router.post(`/edit`, async function (req, res) {
    let userSession = req.session.id_user;

    try {
        await userService.userSession(userSession);
        let update = {};
        if (req.body.email) update.email = req.body.email;
        if (req.body.username) update.username = req.body.username;
        if (req.body.name) update.name = req.body.name;
        if (req.body.description) update.description = req.body.description;
        if (req.body.profile_image) update.profile_image = req.body.profile_image;
        if (req.body.background_image) update.background_image = req.body.background_image;

        if (Object.values(update).length > 0) {
            await userService.updateUser(update, userSession);
        }
        let user = await userService.getUserInfoById(userSession);
        res.json({success: true, data: {user}});
    } catch (e) {
        res.json({success: false, error: e});
    }
})

// Delete

router.post(`/:id_user(\\d+)/delete`, async function (req, res) {

    let userId = req.params.id_user

    try {
        await userService.checkIfUserExists(userId)
        await userService.deleteUser(userId)
        res.json({success: true, message: `User ${userId} ID successfully deleted.`});
    } catch (e) {
        res.json({success: false, error: e});
    }
})

// ------- Subscription

// Retrieve user subscriptions

router.get(`/:id_user(\\d+)/subscriptions`, async function (req, res) {

    let userId = req.params.id_user;
    let limit = 50//req.body.limit;
    let offset = 10//req.body.offset;

    try {
        await userService.checkIfUserExists(userId);
        let subscriptions = await userService.getUserSubscriptions(userId);
        res.json({success: true, subscriptions});
    } catch (e) {
        res.json({success: false, error: e});
    }
})

// Retrieve subscribers from user

router.get(`/:id_user(\\d+)/subscribers`, async function (req, res) {

    let userId = req.params.id_user;

    try {
        await userService.checkIfUserExists(userId);
        let subscribers = await userService.getUserSubscribers(userId);
        res.json({success: true, subscribers});
    } catch (e) {
        res.json({success: false, error: e});
    }
})

// Delete subscriber from user

router.post(`/subscriber/:id_subscribed/delete`, async function (req, res) {

    let userSubscribedId = req.params.id_subscribed;
    let userSubscriberId = req.session.id_user;

    try {
        await userService.checkIfUserExists(userSubscribedId);
        await userService.checkIfUserExists(userSubscriberId);
        await userService.checkSubscription(userSubscriberId, userSubscribedId, false);
        let subscription = await userService.getSubscriptionId(userSubscriberId, userSubscribedId);
        await userService.deleteSubscription(subscription[0].id);
        let subscribers = await userService.getUserSubscribers(userSubscribedId);
        if (subscribers.length > 0) {
            res.json({success: true, subscribers: subscribers});
        } else {
            res.json({success: true, subscribers: "User has no subscribers"});
        }
    } catch (e) {
        res.json({success: false, error: e});
    }
})

// Insert subscription

//router.post(`/:id_subscribed(\\d+)/subscriber/:id_subscriber(\\d+)/insert`, async function (req, res) {
router.post(`/subscriber/:id_subscribed/insert`, async function (req, res) {

    let userSubscribedId = req.params.id_subscribed;
    //let userSubscriberId = req.params.id_subscriber;
    let userSubscriberId = req.session.id_user;

    try {
        await userService.checkIfUserExists(userSubscriberId);
        await userService.checkSubscription(userSubscriberId, userSubscribedId, true);
        await userService.insertSubscription(userSubscribedId, userSubscriberId);
        let subscribers = await userService.getUserSubscribers(userSubscribedId);
        res.json({success: true, subscribers});
    } catch (e) {
        res.json({success: false, error: e});
    }
})

// ------- Search

// Retrieve searches from user

router.get(`/:id_user(\\d+)/search`, async function (req, res) {

    let userId = req.params.id_user;

    try {
        await userService.checkIfUserExists(userId);
        let searches = await userService.getUserSearch(userId);
        res.json({success: true, data: {searches}});
    } catch (e) {
        res.json({success: false, error: e});
    }
})

// Create user search

router.post(`/search/store`, async function (req, res) {

    let userSession = req.session.id_user;

    try {
        await userService.userSession(userSession);
        let user = req.session.id_user;
        let keyword = req.body.keyword;
        let date = req.body.date;
        // Insert new search
        await queryDB(`INSERT INTO search
                       SET ?`, {
            id_user: user,
            keyword: keyword,
            date: date
        });
        let searches = await userService.getUserSearch(userSession);
        res.json({success: true, data: {searches}});
    } catch (e) {
        res.json({success: false, error: e});
    }
})

// ------- History

// Insert user x history

router.post(`/:id_user(\\d+)/history/:id_video/insert`, async function (req, res) {

    let userId = req.params.id_user;
    let videoId = req.params.id_video;

    try {
        await userService.checkIfUserExists(userId);
        await videoService.checkIfVideoExists(videoId);
        await userService.insertUserHistory(userId, videoId);
        await videoService.updateTotalViewsVideo(videoId);
        let history = await userService.getUserHistory(userId);
        res.json({success: true, history})
    } catch (e) {
        res.json({success: false, error: e});
    }
})

// Retrieve user x history

router.get(`/:id_user(\\d+)/history`, async function (req, res) {

    let userId = req.params.id_user

    try {
        await userService.checkIfUserExists(userId);
        let history = await userService.getUserHistory(userId);
        if (history.length === 0) {
            res.json({success: true, subscribers: "User hasn't history."});
        } else {
            res.json({success: true, history});
        }
    } catch (e) {
        res.json({success: false, error: e});
    }
})

// ------- Suggested Channels

router.get(`/suggestedChannels`, async function (req, res) {
    // TODO: update
    let userId = req.session.id_user;
    let limit = 50//req.body.limit;
    let offset = 10//req.body.offset;
    let suggestedChannels = [];

    if (userId) { // Session active
        suggestedChannels = await userService.getSuggestedChannels(userId, limit, offset);
    } else {
        suggestedChannels = await userService.getUsersByCreationDate(limit, offset, []);
    }
    res.json({success: true, suggestedChannels});
})

// ------- Suggested videos

router.get(`/suggestedVideos`, async function (req, res) {
    // TODO: update
    let userId = req.session.id_user;
    let limit = 50//req.body.limit;
    let offset = 10//req.body.offset;
    let suggestedVideos = [];

    if (userId) { // Session active
        suggestedVideos = await videoService.getSuggestedVideos(userId, limit, offset);
    } else {
        suggestedVideos = await videoService.getVideosByPublication(limit, offset, []);
    }
    res.json({success: true, suggestedVideos});
})

// ------- Definitions

router.get(`/:id_user/definitions/account`, async function (req, res) {
    // TODO: Session active
    let userId = req.params.id_user;
    try {
        await userService.checkIfUserExists(userId);
        res.json({
            success: true,
            data:
                {
                    //account: await userService.getUserDataAccount(userId),
                    //notifications: await userService.getUserDataNotifications(userId),
                    //report: await userService.getUsersReport(userId),
                }
        })
    } catch (e) {
        res.json({success: false, error: e});
    }
})

// ------- Upload banner

router.post(`/upload-banner`, async function (req, res) {

    // TODO: query
    const id_user = req.session.id_user;
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' })
    }
    let file = req.files.file;
    let dirPath = path.join(__dirname, '/../public/uploads/', stringify(id_user), '/');

    // file.name = file name
    let extension = path.extname(file.name);
    file.name = `user_${stringify(id_user)}_banner_${new Date().getTime()}${extension}`;
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
    //let filePath = `http://localhost:3001${dirPath}${file.name}`
    let filePath = `${dirPath}${file.name}`
    const dataBasePath = '/uploads/' + id_user + '/' + file.name;
    await file.mv(`${dirPath}${file.name}`, err => {
        if (err) {
            console.error(err)
            return res.status(500).send(err)
        }

        console.log("filePath", filePath);
        queryDB(`UPDATE user
                       SET banner = ? WHERE user.id = ?`, [dataBasePath, id_user]);
        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` })
        //res.json({ success: true})
    })
});

module.exports = router;