const jwt = require("jwt-simple");
const moment = require("moment");
const secret = "musify";

exports.createToken = function (user) {
  const payload = {
      sub: user._id,
      name: user.name,      
      email: user.email,
      role: user.role,      
      iat: moment().unix(),
      exp: moment().add(1, "day").unix
  };

  return jwt.encode(payload, secret);
};