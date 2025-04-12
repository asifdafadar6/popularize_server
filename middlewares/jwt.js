const jwt = require("jsonwebtoken");

const generateJwtToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "48h" });
};

const generateJwtTokenForget = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "10m" });
};

module.exports = { generateJwtTokenForget, generateJwtToken };
