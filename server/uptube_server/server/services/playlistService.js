const {queryDB} = require("../connection");

async function checkIfPlaylistExists(playlistID) {
    let playlist = await queryDB(`SELECT *
                                            FROM user_has_playlist
                                            WHERE id_playlist = ?`, [playlistID])
    if (playlist.length === 0) throw 'playlist does not exist';
}

async function checkIfUserInSessionOwnsPlaylist(userSessionID, playlistID) {
    let checkOwner = await queryDB(`SELECT *
                                        FROM user_has_playlist
                                                 JOIN playlist ON playlist.id = user_has_playlist.id_playlist
                                        WHERE owner = 1
                                          AND id_user = ?
                                          AND id_playlist = ?`, [userSessionID, playlistID])
    if (checkOwner.length === 0) throw `user does not own the playlist`;
}
module.exports = {
    checkIfPlaylistExists,
    checkIfUserInSessionOwnsPlaylist
}
