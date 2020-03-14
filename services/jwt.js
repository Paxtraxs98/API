const jwt = require("jwt-simple");
const moment = require("moment");
const secret = "musify";
const secret2="validacion"
exports.createToken = function (user) {
  const payload = {
      sub: user._id,
      name: user.name,      
      email: user.email,
      role: user.role,      
      iat: moment().unix(),
      exp: moment().add(1, "day").unix()
  };

  return jwt.encode(payload, secret);
};
exports.createTokenValidation = function (user) {
  console.log(user)
  const payload = {
      sub: user._id,
      name: user.name,      
      email: user.email,
      role: user.role,      
      iat: moment().unix(),
      exp: moment().add(5, "minute").unix()
  };

  return jwt.encode(payload, secret2);
};