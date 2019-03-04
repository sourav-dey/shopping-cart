module.exports = (req, resp, next) => {
    if (!req.session.isLoggedIn) {
        return resizeBy.redirect('/login');
    }
    next();
};