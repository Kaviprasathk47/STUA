// // import {adminLoginService} from "../services/adminService.js";
// import admin from "../config/fireBaseConfig.js";
// import {postLoginUsingFireBaseService} from "../services/userService.js";

//  const adminLoginController = async (req,res)=>{
//     try {
//         const {email,password} = req.body;
//         const result = await adminLoginService(email,password);
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(500).json({message:error.message});
//     }
// };
// const adminLOginFireBase = async(req,res) => {
//    try{
//     const {token} = req.body;
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     const {name,email} = decodedToken;
//     const {userFound,refreshToken,accessToken} = await postLoginUsingFireBaseService({name,email});
//     res.cookie("refreshToken",refreshToken,{
//         httpOnly:true,
//         secure:true,
//         sameSite:"strict"
//     });
//     res.status(201).json({
//         message:"Login using Firebase successful",
//         data:{
//             accessToken:accessToken
//         }
//     });
//    }
//    catch(err){
//         res.status(500).json({
//             message:"Error in Admin Login 'FIREBASE'",
//             error:err.message
//         })
//    }


// }

// export default { adminLoginController,adminLOginFireBase}