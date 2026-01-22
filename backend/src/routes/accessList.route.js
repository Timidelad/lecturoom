import express from 'express';
const router = express.Router();
import { verifyAdminToken } from '../middlewares/verifyTokenAdmin.js';
import { accessList } from '../controllers/accessList.controller.js';

router.post('/', verifyAdminToken, accessList)

export default router;