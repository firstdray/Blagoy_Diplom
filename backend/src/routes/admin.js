const router = require("express").Router();

router.post("/login", (req, res) => {
    const {login, password} = req.body;

    if (login === process.env.ADMIN_LOGIN && password === process.env.ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        req.session.login = login;
        req.session.save((err) => {
            if (err) {
                console.error('Session save error', err);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to save session'
                })
            }
        })

        res.status(200).json({
            success: true,
            message: 'Login successfully',
            sessionId: req.session.id
        })
    } else {
        res.status(401).json({success: false, error: 'Invalid credentials'});
    }
})

module.exports = router;