import express from "express"
import { superAdminLogin } from "../controllers/superadmin.controller.js";
const router = express.Router();

router.post('/superAdminLogin', superAdminLogin)

export default router