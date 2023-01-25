const {queryDB} = require("../connection");
const {stringify} = require("nodemon/lib/utils");

async function checkIfVideoExists(videoId) {

    let video = await queryDB(`SELECT *
                               FROM video
                               WHERE id = ?`, [videoId]);
    if (video.length === 0) {
        throw "video doesn't exist";
    }
}

async function checkIfVideoIsAvailable(videoId) {

    let video = await queryDB(`SELECT v.available
                               FROM video v
                               WHERE id = ?`, [videoId]);
    if (video[0].available === 0) throw 'video is not available';
}

async function updateTotalViewsVideo(videoId) {
    return await queryDB(`UPDATE video
                          SET views = views + 1
                          WHERE video.id = ?`, [videoId]);
}

async function getSuggestedVideos(userId, limit, offset) {

    let suggestedVideos = [];
    // Get tags videos from user history
    let tagsHistory = await getTagsVideosFromHistory(userId);
    // Checks if the user has history
    if (tagsHistory.length > 0) {
        // Store videos ids with the same tags
        suggestedVideos = await getVideosByTags(tagsHistory.map(t => t), limit, offset);
    }
    // Check if the total of suggested videos matches the limit
    if (suggestedVideos.length < limit) {
        // Calculates the amount of suggestions missing
        let auxLimitVideos = limit - suggestedVideos.length;
        // Get videos, excluding suggestions based on history
        let randomVideos = await getVideosByPublication(auxLimitVideos, offset, suggestedVideos.map(v => v));
        // Update suggestedVideos
        suggestedVideos = suggestedVideos.concat(randomVideos);
    }
    return suggestedVideos;
}

async function getTagsVideosFromHistory(userId) {

    let tags = [];
    let auxTags = await queryDB(`SELECT DISTINCT t.tag
                                 FROM tag t
                                          JOIN video_history vh ON vh.id_video = t.id_video
                                 WHERE t.id_user = ?`, [userId]);
    for (let id = 0; id < auxTags.length; id++) {
        tags.push(auxTags[id].tag);
    }
    return tags;
}

async function getVideosByTags(tags, limit, offset) {

    let videos = [];
    let auxVideos = await queryDB(`SELECT v.id,
                                          v.thumbnail,
                                          v.length,
                                          v.title,
                                          v.uploaded,
                                          v.total_comments,
                                          v.total_likes,
                                          v.views,
                                          u.avatar,
                                          u.name
                                   FROM video v
                                            JOIN tag t ON t.id_video = v.id
                                            JOIN user u ON u.id = v.id_user
                                   WHERE t.tag IN (?)
                                   GROUP BY v.id
                                   ORDER BY v.uploaded DESC
                                   LIMIT ${limit} OFFSET ${offset}`, [tags]);
    for (let id = 0; id < auxVideos.length; id++) {
        videos.push(auxVideos[id]);
    }
    return videos;
}

async function getVideosByPublication(limit, offset, exclude) {

    let videos = [];
    let auxVideos = [];

    if (exclude.length > 0) {
        auxVideos = await queryDB(`SELECT v.id,
                                          v.thumbnail,
                                          v.length,
                                          v.title,
                                          v.uploaded,
                                          v.total_comments,
                                          v.total_likes,
                                          v.views,
                                          u.avatar,
                                          u.name
                                   FROM video v
                                   JOIN user u ON u.id = v.id_user
                                   WHERE v.available = 1 AND u.id NOT IN (?)
                                   ORDER BY v.uploaded DESC
                                   LIMIT ${limit} OFFSET ${offset}`, [exclude]);
    } else {
        auxVideos = await queryDB(`SELECT v.id,
                                          v.thumbnail,
                                          v.length,
                                          v.title,
                                          v.uploaded,
                                          v.total_comments,
                                          v.total_likes,
                                          v.views,
                                          u.avatar,
                                          u.name
                                   FROM video v
                                   JOIN user u ON u.id = v.id_user
                                   WHERE v.available = 1
                                   ORDER BY v.uploaded DESC
                                   LIMIT ${limit} OFFSET ${offset}`);

    }
    for (let id = 0; id < auxVideos.length; id++) {
        videos.push(auxVideos[id]);
    }
    return videos;
}

module.exports = {
    checkIfVideoExists,
    checkIfVideoIsAvailable,
    updateTotalViewsVideo,
    getSuggestedVideos,
    getTagsVideosFromHistory,
    getVideosByTags,
    getVideosByPublication
};