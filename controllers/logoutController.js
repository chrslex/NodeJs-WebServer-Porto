const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {
        this.users = data
    }
}
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
    // Delete refresh token on cookies, and the client should also delete the access token.
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204); //No content
    }

    const refreshToken = cookies.jwt;

    //Check refresh token exist in db or not ? if not clear access token
    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie("jwt", {httpOnly: true});
        return res.sendStatus(403); //Forbidden
    }

    //Delete refresh token in db
    const otherUsers = userDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''};
    userDB.setUsers([...otherUsers, currentUser]);

    //Write in json
    await fsPromises.writeFile(
        path.join(__dirname,"..", "model", "users.json"),
        JSON.stringify(userDB.users),
    )

    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: true, sameSite: 'None' });
    res.sendStatus(204);
}

module.exports = { handleLogout };