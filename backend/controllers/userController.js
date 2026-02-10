import {
  getUserDetails,
  postUserDetails,
  postLoginUsingFireBaseService,
  updateUser,
  changePassword
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
    res.status(error.statusCode || 500).json({
      message: error.message,
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
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

const postLoginUsingFireBaseCntrl = async (req, res) => {
  const { token } = req.body; //fire base token
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { name, email } = decodedToken;
    const { userFound, refreshToken, accessToken } = await postLoginUsingFireBaseService({ name, email });

    // before sending response generate tokens if needed:
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(201).json({
      message: "Login using Firebase successful",
      data: {
        accessToken: accessToken
      }
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

/** GET /auth/me — validate current access token (protected) */
const getMeController = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password -__v"); // Exclude password and version
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ ok: true, user: user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details" });
  }
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

const updateUserProfileController = async (req, res) => {
  try {
    const userId = req.user;
    const updateData = req.body;

    // Prevent updating password through this route
    delete updateData.password;

    const updatedUser = await updateUser(userId, updateData);

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message
    });
  }
};

const changePasswordController = async (req, res) => {
  try {
    const userId = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    await changePassword(userId, currentPassword, newPassword);

    res.status(200).json({
      message: "Password changed successfully"
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message
    });
  }
};

const completeOnboardingController = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findByIdAndUpdate(
      userId,
      { isOnboarded: true },
      { new: true }
    ).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Onboarding completed successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error completing onboarding"
    });
  }
};

export {
  postUserDetailsController,
  getUserDetailsController,
  postLoginUsingFireBaseCntrl,
  getMeController,
  refreshController,
  updateUserProfileController,
  changePasswordController,
  completeOnboardingController
};
