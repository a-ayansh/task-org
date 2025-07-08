import { Router } from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateUser,
    deleteUser,
    refreshAccessToken 
} from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
        
// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);


// Protected Routes (require JWT)
router.use(verifyJWT);

router.get("/me", getCurrentUser);
router.patch("/update", updateUser);
router.delete("/delete", deleteUser);
router.post("/logout", logoutUser);

export default router;
