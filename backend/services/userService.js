import bcrypt from "bcryptjs";
import User from "../models/User.js";
import AppError from "../utils/appError.js";
import { refreshToken_generate, accessToken_generate } from "../utils/tokenGenerator.js";

const postUserDetails = async ({ name, userName, email, password }) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (existingUser) {
    throw new AppError("User already exists", 409);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name: name,
    userName: userName,
    email: email,
    password: hashedPassword,
    date_login: new Date(),
  });
  const savedUser = await user.save();
  console.log("User saved successfully:", savedUser);
  return savedUser;
};
const getUserDetails = async ({ userDetail, password }) => {
  const userFound = await User.findOne({
    $or: [{ email: userDetail }, { userName: userDetail }],
  });
  if (!userFound) {
    throw new AppError("User not found", 404);
  }
  const isPasswordValid = await bcrypt.compare(password, userFound.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid password", 401);
  }
  const refreshToken = refreshToken_generate(userFound);
  const accessToken = accessToken_generate(userFound);
  return {
    userFound,
    refreshToken: refreshToken,
    accessToken: accessToken
  };
};

const postLoginUsingFireBaseService = async ({ name, email }) => {
  let user = await User.findOne({ email: email });
  if (!user) {
    user = new User({ name: name, userName: name, email: email, password: "", date_login: new Date() });
    await user.save();
  }
  const refreshToken = refreshToken_generate(user);
  const accessToken = accessToken_generate(user);
  return {
    user,
    refreshToken: refreshToken,
    accessToken: accessToken
  };
};
const updateUser = async (userId, updateData) => {
  // Check if username/email is being updated and if it's already taken
  if (updateData.userName || updateData.email) {
    const existing = await User.findOne({
      $or: [
        { userName: updateData.userName },
        { email: updateData.email }
      ],
      _id: { $ne: userId } // Exclude current user
    });

    if (existing) {
      if (existing.userName === updateData.userName) throw new AppError("Username already taken", 409);
      if (existing.email === updateData.email) throw new AppError("Email already taken", 409);
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  return updatedUser;
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // If user has no password (e.g. Google login), they might need to set one directly?
  // Assuming standard flow requires old password verification if one exists
  if (user.password) {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new AppError("Incorrect current password", 401);
    }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return { message: "Password updated successfully" };
};

export { postUserDetails, getUserDetails, postLoginUsingFireBaseService, updateUser, changePassword };
