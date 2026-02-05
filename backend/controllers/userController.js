import { getUserDetails, postUserDetails } from '../services/userService.js';

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
export { postUserDetailsController, getUserDetailsController };
