const User = require("../model/User");

const handleLogout = async (req, res) => {
    // Delete refresh token on cookies, and the client should also delete the access token.
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        console.log("debug no cookies");
        return res.sendStatus(204); //No content
    }

    const refreshToken = cookies.jwt;

    //Check refresh token exist in db or not ? if not clear access token
    const foundUser = await User.findOne({ refreshToken }).exec();;
    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'None' });
        return res.sendStatus(403); //Forbidden
    }

    //Delete refresh token in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'None' });
    res.sendStatus(204);
}

module.exports = { handleLogout };