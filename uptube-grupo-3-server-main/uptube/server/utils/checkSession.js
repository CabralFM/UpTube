const checkSession = (req, res, next) => {
    if(req.session.id_user){
        return next();
    }
    res.status(401).json({success: false, error: "not_authenticated"})
}

module.exports = {checkSession};