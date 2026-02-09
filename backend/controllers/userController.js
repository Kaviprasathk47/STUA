import {
  getUserDetails,
  postUserDetails,
  postLoginUsingFireBaseService,
} from "../services/userService.js";
import { accessToken_generate, verifyRefreshToken } from "../utils/tokenGenerator.js";
import User from "../models/User.js";
import admin from "../config/fireBaseConfig.js";
const postUserDetailsController = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;
    const response = await postUserDetails({
      name,
      userName,
      email,
      password,
    });
    res.status(201).json({
      message: "User details posted successfully Redirecting to login...",
    });
  } catch (error) {
    res.status(500).json({
      message: `Error posting user details: ${error.message}`,
    });
  }
};
const getUserDetailsController = async (req, res) => {
  try {
    const { userDetail, password } = req.body;
    const { userFound, refreshToken, accessToken } = await getUserDetails({
      userDetail,
      password,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({
      message: "Login successful",
      data: {
        accessToken: accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user details",
      error: error.message,
    });
  }
};

const postLoginUsingFireBaseCntrl = async (req, res) => {
  // To be implemented
  const { token } = req.body; //fire base token
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { name, email } = decodedToken;
    const userRecord = await postLoginUsingFireBaseService({ name, email });

    // before sending response generate tokens if needed:
    res.status(201).json({
      message: "Login using Firebase successful",
      data: userRecord,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      Error: err.message,
      message: "Error : Login using Firebase failed ",
    });
  }
};

/** GET /auth/me — validate current access token (protected) */
const getMeController = async (req, res) => {
  res.status(200).json({ ok: true, userId: req.user });
};

/** POST /auth/refresh — issue new access token using refresh cookie */
const refreshController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }
    const userId = verifyRefreshToken(refreshToken);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const newAccessToken = accessToken_generate(user);
    res.status(200).json({ data: { accessToken: newAccessToken } });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

export {
  postUserDetailsController,
  getUserDetailsController,
  postLoginUsingFireBaseCntrl,
  getMeController,
  refreshController,
};



