const {queryDB} = require("../connection");
const bcrypt = require("bcrypt");
const videoService = require("../services/videoService");

async function userSession(user) {

    if (!user) {
        throw "please login";
    }
}

async function getUserPageInfoById(userId) {
    return await queryDB(`SELECT u.id, u.username, u.name, u.description, u.avatar, u.banner, u.registered, u.total_views, u.total_playlists, u.total_videos, COUNT(s.subscribed) AS total_subscribers
                                FROM user u
                                JOIN subscription s ON s.subscribed = u.id
                                WHERE u.id = ?`, [userId]);
}

async function getUserInfoById(userId) {
    return await queryDB(`SELECT *
                                FROM user
                                WHERE id = ?`, [userId]);
}

async function getUserSessionInfoById(userId) {
    return await queryDB(`SELECT active, admin, avatar, banner, description, email, id, name, registered, total_playlists, total_videos, total_views, username
                                FROM user
                                WHERE id = ?`, [userId]);
}

async function checkIfEmailIsAvailable(userEmail) {

    let user = await queryDB(`SELECT email
                                FROM user
                                WHERE email = ?`, [userEmail]);
    if (user.length > 0) {
        throw "invalid credentials.";
    }
}

async function insertUser(userName, userEmail, userPassword, userCreationDate) {
    return await queryDB(`INSERT INTO user SET ? `, {
        username: userName,
        email: userEmail,
        password: userPassword,
        registered: userCreationDate,
        active: 1,
        banner: "https://mcentre.lk/frontend/assets/images/default-banner.png",
        avatar: "https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar.png"
    });
}

async function getUserInfoByEmail(userEmail) {
    return await queryDB(`SELECT *
                                FROM user u
                                WHERE email = ?`, [userEmail]);
}

async function userLogin(userEmail, userPassword) {

    let currentUser = await queryDB("SELECT * FROM user WHERE email = ?", [userEmail]);

    // Check if email exists
    if (currentUser.length === 0) {
        throw "Invalid credentials.";
    }

    let currentPassword = await bcrypt.compare(userPassword, currentUser[0].password);

    // Check if password is correct
    if (!currentPassword) {
        throw "Invalid credentials.";
    }
}

async function checkIfUserExistsByEmail(userEmail) {

    let user = await queryDB(`SELECT email
                                FROM user
                                WHERE email = ?`, [userEmail]);
    if (user.length === 0) {
        throw "invalid credentials.";
    }
}

async function updatePassword(userEmail, UserPassword) {
    return await queryDB(`UPDATE user 
                                SET password = ? 
                                WHERE email = ?`, [UserPassword, userEmail]);
}

async function checkIfUserExists(userId) {

    let user = await queryDB(`SELECT *
                                FROM user
                                WHERE id = ?`, [userId]);
    if (user.length === 0) {
        throw "User doesn't exist.";
    }
}

async function getAllUsers() {
    let users = await queryDB(`SELECT id, name, admin, active, email, username, avatar, banner, registered, total_playlists, total_videos, total_views
                                 FROM user
                                 ORDER BY registered DESC`);
    if(users.length === 0) {
        throw "No user created yet."
    }
    return users;
}

async function getUserTags(userId) {
    // TODO: confirmar qual o critério para mostrar os tags do user
    return await queryDB(`SELECT id, tag
                                FROM tag
                                WHERE id_user = ?
                                GROUP BY tag LIMIT 10`, [userId]);
}

async function getUserUnlockedAchievements(userId) {
    return await queryDB(`SELECT a.id, a.title, a.description, ua.level, ua.visible, ua.date, a.max_level
                                FROM achievement a
                                JOIN user_has_achievement ua ON ua.id_achievement = a.id
                                WHERE ua.id_user = ?`, [userId]);
}

async function getUserLockedAchievements(userId) {
    return await queryDB(`SELECT  a.id, a.title, a.description, a.max_level
                                FROM    achievement a
                                WHERE   a.id NOT IN
                                    (SELECT  ua.id_achievement
                                    FROM    user_has_achievement ua
                                    WHERE ua.id_user = ?)`, [userId]);
}

async function getUserVideos(userId, limit, offset) {

    return await queryDB(`SELECT v.id, v.thumbnail, v.length, v.title, v.views, v.uploaded/*, t.id*/, GROUP_CONCAT(t.tag) AS tags 
                                FROM video v
                                LEFT JOIN tag t ON t.id_video = v.id
                                WHERE v.id_user = ? AND v.available = 1
                                GROUP BY v.id
                                LIMIT ${limit} OFFSET ${offset}`, [userId]);
}

async function getTotalUserVideos(userId) {
    return await queryDB(`SELECT COUNT(*) AS total_videos
                                FROM video
                                WHERE id_user = ? AND video.available = 1`, [userId]);
}

async function adminGetTotalUserVideos(userId) {
    return await queryDB(`SELECT COUNT(*) AS total_videos
                                FROM video
                                WHERE id_user = ?`, [userId]);
}

async function getUserPlaylists(userId) {
    return await queryDB(`SELECT p.id AS playlist_id, p.title, p.description, p.type, p.total_time, p.created, p.modified, up.owner, v.id, v.thumbnail
                                FROM playlist p
                                JOIN user_has_playlist up ON up.id_playlist = p.id
                                JOIN playlist_has_video pv ON pv.id_playlist = p.id
                                JOIN video v ON v.id = pv.id_video
                                WHERE up.id_user = ?
                                GROUP BY p.id`, [userId]);
}

async function getUserSubscriptions(userId) {
    let subscriptions = await queryDB(`SELECT u.id, u.name, u.username, u.avatar, u.banner, s.date
                                 FROM subscription s 
                                 JOIN user u ON u.id = s.subscribed 
                                 WHERE s.subscriber = ?
                                 ORDER BY s.date DESC`, [userId]);
    if(subscriptions.length === 0) {
        throw "user doesn't have subscriptions"
    }
    return subscriptions
}

async function getUserPageSubscribers(userId) {
    return await queryDB(`SELECT u.id, u.name, u.avatar
                                FROM subscription s
                                JOIN user u ON u.id = s.subscriber
                                WHERE s.subscribed = ?
                                ORDER BY s.date DESC LIMIT 5`, [userId]);
}

async function getUserSubscribers(userId) {
    return await queryDB(`SELECT u.id, u.name 
                                FROM subscription s 
                                JOIN user u ON u.id = s.subscriber 
                                WHERE s.subscribed = ?`, [userId]);
}

async function updateUser(update, userSession) {
    return await queryDB(`UPDATE user SET ? WHERE id = ?`, [update, userSession]);
}

async function deleteUser(userId) {
    // TODO: colocar todo null. Arranjar um nome melhor:
    return await queryDB(`UPDATE user SET username = 'deleted user' 
                                WHERE id = ?`, [userId])
}

async function checkSubscription(userSubscriberId, userSubscribedId, insert) {

    let subscription = await getSubscriptionId(userSubscriberId, userSubscribedId);
    if(userSubscriberId === userSubscribedId && insert) {  // Insert error
        throw "User cannot subscribe himself.";
    } else if (subscription.length > 0 && insert) { // Insert error
        throw "Subscription already exists.";
    } else if (subscription.length === 0 && !insert) { // Delete error
        throw "There is no subscription.";
    }
}

async function getSubscriptionId(userSubscriberId, userSubscribedId) {
    return await queryDB(`SELECT id
                                FROM subscription 
                                WHERE subscriber = ? AND subscribed = ?`, [userSubscriberId, userSubscribedId])
}

async function deleteSubscription(SubscriptionId) {
    return await queryDB(`DELETE FROM subscription WHERE id = ?`, [SubscriptionId])
}

async function insertSubscription(userSubscribedId, userSubscriberId) {
    return await queryDB(`INSERT INTO subscription SET ?`, {
        subscribed: userSubscribedId, subscriber: userSubscriberId
    });
}

async function getUserSearch(userId) {
    return await queryDB(`SELECT s.id, s.keyword, s.date
                                FROM search s
                                JOIN user u ON u.id = ?`, [userId]);
}

async function insertUserHistory(userId, videoId) {
    //TODO: atualizar startstamp, stopstamp e time
    return await queryDB(`INSERT INTO video_history SET ?`, {
        id_video: videoId, id_user: userId
    });
}

async function getUserHistory(userId) {
    return await queryDB(`SELECT vh.id, vh.id_video, vh.time, vh.startstamp, vh.stopstamp, u.name, u.avatar, v.thumbnail, v.title
                                FROM video_history vh
                                JOIN video v ON v.id = vh.id_video
                                JOIN user u ON u.id = v.id_user
                                WHERE vh.id_user = ?
                                ORDER BY vh.startstamp DESC`, [userId]);
}

async function getSuggestedChannels(userId, limit, offset) {

    let suggestedChannels = [];
    let suggestedVideos = [];
    // Get tags videos from user history
    let tagsHistory = await videoService.getTagsVideosFromHistory(userId);
    // Checks if the user has history
    if (tagsHistory.length > 0) {
        // Store videos ids with the same tags
        suggestedVideos = await videoService.getVideosByTags(tagsHistory.map(t => t), limit, offset);
        // Store users/channels from suggestedVideos
        suggestedChannels = await getUsersFromVideos(suggestedVideos, limit, offset);
    }
    // Check if the total of suggested users/channels matches the limit
    if (suggestedChannels.length < limit) {
        // Calculates the amount of suggestions missing
        let auxTotalChannels = limit - suggestedChannels.length;
        // Get users/channels, excluding suggestions based on history
        let randomChannels = await getUsersByCreationDate(auxTotalChannels, offset, suggestedChannels.map(u => u));
        // Update suggestedVideos
        suggestedChannels = suggestedChannels.concat(randomChannels);
    }
    return suggestedChannels;
}

async function getUsersFromVideos(videos, limit, offset) {
    let users = [];
    let auxUser = await queryDB(`SELECT v.id_user, u.name, u.avatar, u.username
                                       FROM video v
                                       JOIN user u ON u.id = v.id_user
                                       WHERE v.id IN (?)
                                       ORDER BY v.uploaded DESC
                                       LIMIT ${limit} OFFSET ${offset}`, [videos]);

    for (let videoId = 0; videoId < videos.length; videoId++) {
        if (!users.includes(auxUser[0].user_id_user)) {
            users.push(auxUser[0]);
        }
    }
    return users;
}

async function getUsersByCreationDate(limit, offset, exclude) {

    let users = [];
    let auxUsers = [];

    if(exclude.length > 0) {
        auxUsers = await queryDB(`SELECT id, name, avatar, username
                                        FROM user
                                        WHERE id NOT IN (?)
                                        ORDER BY registered DESC
                                        LIMIT ${limit} OFFSET ${offset}`, [exclude]);
    } else {
        //TODO: verificar erro na linha: LIMIT ${limit} OFFSET ${offset}`);
        auxUsers = await queryDB(`SELECT id, name, avatar, username
                                        FROM user
                                        ORDER BY registered DESC`);
                                        //LIMIT ${limit} OFFSET ${offset}`);
    }
    for (let id = 0; id < auxUsers.length; id++) {
        users.push(auxUsers[id]);
    }
    return users;
}

module.exports = {
    userSession,
    getUserPageInfoById,
    getUserInfoById,
    getUserSessionInfoById,
    checkIfEmailIsAvailable,
    insertUser,
    getUserInfoByEmail,
    userLogin,
    checkIfUserExistsByEmail,
    updatePassword,
    checkIfUserExists,
    getAllUsers,
    getUserTags,
    getUserUnlockedAchievements,
    getUserLockedAchievements,
    getUserVideos,
    getTotalUserVideos,
    adminGetTotalUserVideos,
    getUserPlaylists,
    getUserSubscriptions,
    getUserPageSubscribers,
    getUserSubscribers,
    updateUser,
    deleteUser,
    checkSubscription,
    getSubscriptionId,
    deleteSubscription,
    insertSubscription,
    getUserSearch,
    insertUserHistory,
    getUserHistory,
    getSuggestedChannels,
    getUsersByCreationDate
};