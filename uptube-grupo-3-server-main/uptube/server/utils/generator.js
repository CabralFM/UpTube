function idGen(l) { // generates id_video
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < l; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function tokenGen(l) { // generates token
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < l; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}

module.exports = {idGen, tokenGen};