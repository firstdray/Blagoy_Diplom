function checkAdminRights(req) {
    if (!req.session || !req.session.isAdmin) {
        throw new Error("Admin rights required");
    }
}

module.exports = {checkAdminRights};