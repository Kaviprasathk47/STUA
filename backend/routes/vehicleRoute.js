import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { posttheVehicleDetailsCntrl, getTheVehicleDetailsCntrl, getTheVehicleDetailsAllCntrl, updateVehicleDetailsCntrl, deleteVehicleDetailsCntrl } from "../controllers/vehicleController.js";
import { validateVehicle } from "../middleware/validation.js";

const router = Router();

//CREATING THE Vehicle DETAILS
router.post("/create", protect, validateVehicle, posttheVehicleDetailsCntrl);

//GETTING THE Vehicle DETAILS (by id ,by name , all)
router.get("/get/all", protect, getTheVehicleDetailsAllCntrl);

router.get("/get/:identifier", protect, getTheVehicleDetailsCntrl); // -> sending the common name parameter can be enough to overcome the id or name issuses

//UPDATING THE Vehicle DETAILS
router.put("/update/:id", protect, validateVehicle, updateVehicleDetailsCntrl);

//DELETING THE Vehicle
router.delete("/delete/:id", protect, deleteVehicleDetailsCntrl);

export default router;
