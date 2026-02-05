import { Router } from "express";
import {getUserDetailsController,postUserDetailsController} from "../controllers/userController.js";
const router = Router();
//signUp:route here
router.post("/signup",postUserDetailsController);

//Login:route here
router.post("/login",getUserDetailsController);

//

export default router;
