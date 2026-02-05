import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";


const postUserDetails = async ({ name, userName, email, password }) => {
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      throw new Error(`Error on SignUP "User already exists"`);
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
      throw new Error(`Error on SignIN "User not found"`);
    }
    const isPasswordValid = await bcrypt.compare(password,userFound.password);
    if(!isPasswordValid) {
      throw new Error(`Error on SignIN "Invalid password"`);
    }
    const refreshToken = jwt.sign(
      {userID:userFound._id},
      process.env.JWT_REFRESH_SECRET,
      {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    );
    const accessToken = jwt.sign(
      {userId:userFound._id},
      process.env.JWT_ACCESS_SECRET,
      {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );
    return {
      userFound,
      refreshToken: refreshToken,
      accessToken: accessToken
    };
};

export { postUserDetails,getUserDetails };
