import bcrypt from "bcryptjs";
import User from "../models/User.js";
import AppError from "../utils/appError.js";
import {refreshToken_generate, accessToken_generate} from "../utils/tokenGenerator.js";

const postUserDetails = async ({ name, userName, email, password }) => {
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      throw new AppError("User already exists", 409);
    }
    const hashedPassword = await bcrypt.hash(password,10);
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
const getUserDetails = async ({userDetail,password}) => {
    const userFound = await User.findOne({
      $or: [{ email:userDetail }, { userName:userDetail}],
    });
    if(!userFound) {
      throw new AppError("User not found", 404);
    }
    const isPasswordValid = await bcrypt.compare(password,userFound.password);
    if(!isPasswordValid) {
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

const postLoginUsingFireBaseService = async ({name,email}) => {
  let user = await User.findOne({email:email});
  if(!user) {
    user = new User({ name:name,userName:name, email:email, password:"", date_login: new Date() });
    await user.save();
  }
  return user;
};

export { postUserDetails,getUserDetails ,postLoginUsingFireBaseService};
