const checkIDParams = async (req, res, next) => {
    // only works when endpoint uses :id_video, :id_user or both, WITHOUT any other parameter requested
    try {
        if(!req.params) {throw `missing params`;}
        if(!req.params.id_user) {throw `missing params`;}
        if (req.params.id_user === "") {throw `missing params`;}
        if (req.params.id_user === 0) {throw `missing params`;}
        if (req.params.id_user === false) {throw `missing params`;}
        if (req.params.id_user === null) {throw `missing params`;}
        if (req.params.id_user === undefined) {throw `missing params`;}
        if (req.params.id_user === "id_user") {throw `missing params`;}
        if (req.params.id_user === ":id_user") {throw `missing params`;}
        if(!req.params.id_video) {throw `missing params`;}
        if (req.params.id_video === "id_user") {throw `missing params`;}
        if (req.params.id_video === "") {throw `missing params`;}
        if (req.params.id_video === 0) {throw `missing params`;}
        if (req.params.id_video === false) {throw `missing params`;}
        if (req.params.id_video === null) {throw `missing params`;}
        if (req.params.id_video === undefined) {throw `missing params`;}
        if (req.params.id_video === "id_user") {throw `missing params`;}
        if (req.params.id_video === ":id_user") {throw `missing params`;}
        next();
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
}

module.exports = checkIDParams;