import { getUserDetails, postUserDetails,postLoginUsingFireBaseService } from '../services/userService.js';
import admin from '../config/fireBaseConfig.js';
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
      message: "User details posted successfully",
      data: response,
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
    const { user, refreshToken, accessToken } = await getUserDetails({ userDetail, password });
    res.status(201).json({
      message: "User details fetched successfully",
      user, refreshToken, accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user details",
      error: error.message,
    });
  }
};

const postLoginUsingFireBaseCntrl = async (req,res) => {
  // To be implemented
    const { token } = req.body;//fire base token
    try{
      const decodedToken = await admin.auth().verifyIdToken(token);
      const {name, email} = decodedToken;
      const userRecord = await postLoginUsingFireBaseService({name,email});
      res.status(201).json({
        message: "Login using Firebase successful",
        data: userRecord,
      });
    }
    catch(err)  {
      res.status(err.statusCode || 500).json({
        Error:err.message,
        message:"Error : Login using Firebase failed ",
      })
    }
}


export { postUserDetailsController, getUserDetailsController,postLoginUsingFireBaseCntrl };
