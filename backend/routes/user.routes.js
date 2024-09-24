import express from 'express';
import  { registerUser,loginUser, logoutUser, refreshAcessToken }  from "../controllers/user.controller.js";
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT } from '../middleware/auth.middleware.js';


const router = express.Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }

    ]),  // It takes input as array of objects
    registerUser
)

router.route("/login").post(loginUser)

//Secured ROutes

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAcessToken)

export default router;