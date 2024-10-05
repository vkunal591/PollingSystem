const jwt = require("jsonwebtoken");
const JWT_SEACTET = "4ucsKunal"

const fetchadmin = (req, res, next) => {
    // Get the user from the jwt token and add id to req object

    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({
            error: "please Authenticate using a valid token"
        })
    }

    try {
        const data = jwt.verify(token, JWT_SEACTET);
        req.admin = data.admin;
        next();

    } catch (error) {
        res.status(401).send({
            error: "please Authenticate using a valid token"
        })
    }
}


module.exports = fetchadmin;