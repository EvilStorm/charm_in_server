require("dotenv").config();
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;
const tokenDate = process.env.JWT_TIME;
const refreshTokenDate = process.env.JWT_REFRESH_TIME;

function tokenPayLoad(userId, joinType) {
  return {
    userId: userId,
    joinType: joinType,
  };
}
/**
 * Create JWT Token
 * @param {} payload create used tokenPayLoad
 * @returns
 */
function makeToken(payload) {
  console.log(`tokenDate: ${tokenDate}`);
  const option = { expiresIn: tokenDate };
  const refreshOption = { expiresIn: refreshTokenDate };

  return {
    token: jwt.sign(payload, secretKey, option),
    refreshToken: jwt.sign(payload, secretKey, refreshOption),
  };
}

function decodePayload(token) {
  return jwt.verify(token, secretKey);
}

module.exports = { tokenPayLoad, makeToken, decodePayload };
