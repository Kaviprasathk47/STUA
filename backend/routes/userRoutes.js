import { Router } from "express";
import {getUserDetailsController,postUserDetailsController ,postLoginUsingFireBaseCntrl} from "../controllers/userController.js";
const router = Router();
//signUp:route here
router.post("/signup",postUserDetailsController);

//Login:route here
router.post("/login",getUserDetailsController);

//
router.post("/auth/firebase",postLoginUsingFireBaseCntrl);
export default router;
