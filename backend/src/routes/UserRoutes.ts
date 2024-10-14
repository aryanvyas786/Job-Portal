import { Router } from "express";
import { upload } from "../middeware/multer";
import {dashboard, getAgency, getAgencyDetails, getJobSeekers, loginUser, registerUser} from '../controllers/userController'
import { authMiddleware } from "../middeware/auth";
const router = Router();

router.post('/register', upload,  registerUser);
router.post("/login", loginUser);
router.get("/agencies", getAgency);
router.get("/dashboard",dashboard);

router.get('/jobseekers', authMiddleware, getJobSeekers);
router.get('/agency', authMiddleware, getAgencyDetails);


export default router;