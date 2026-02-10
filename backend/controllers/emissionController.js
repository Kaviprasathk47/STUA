import { calculateEmissionService } from "../services/emissionService.js";

export const calculateEmissionFn = async (req, res) => {
    try {
        const { mode, distance, vehicleDetails } = req.body;

        const result = await calculateEmissionService(
            mode,
            distance,
            vehicleDetails
        );

        res.status(200).json({
            message: "Emission calculated successfully",
            data: result
        });
    } catch (error) {
        console.error("Emission Calculation Error:", error);
        res.status(400).json({
            message: "Calculation failed",
            error: error.message
        });
    }
};
