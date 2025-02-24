const jwtauthenticate = (req,res,next) => {
    const token = req.header('Authorization').split(" ")[1];

    if(!token){
        return res.json({"message":"token is absent"})
    }

    try {
        const decoded = jwt.verify(process.env.JWT_TOKEN);
        req.username = decoded
    } catch (error) {
        return res.status(401).json({"message":"Invalid Token"})
    }


}

module.exports = jwtauthenticate