
const jwt = require("jwt-simple");
const moment = require("moment");
const secret = "musify";

exports.ensureAuth = function(req,res,next) {

    if(!req.headers.authorization){
        return res.status(403).send({message: "la peticion no es autorizado"});
    }

    const token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({message: "El token ha expirado"});
        }
    } catch (ex) {
        //console.log(ex);
        return res.status(404).send({message: "El token no es valido"});
    }

    req.user = payload;
    next();
};