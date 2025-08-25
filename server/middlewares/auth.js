exports.auth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; //bearer token

        if (token == null) {
            return res.sendStatus(401);
        }
        const secret = process.env.JWT_SECRET;
        jwt.verify(token, secret, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.user = user;
            next();
        });
    } catch(error){
        console.error('authentication error', error);
    res.status(500).json({ message: 'Server error during authentication.' });
    }
}