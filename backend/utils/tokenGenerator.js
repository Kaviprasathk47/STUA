import jwt from "jsonwebtoken";

const refreshToken_generate = (userFound) => {
  const refreshToken = jwt.sign(
    { userID: userFound._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
  return refreshToken;
};

const accessToken_generate = (userFound) => {
  const accessToken = jwt.sign(
    { userId: userFound._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
  return accessToken;
};

const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  return decoded.userID;
};

export { refreshToken_generate, accessToken_generate, verifyRefreshToken };