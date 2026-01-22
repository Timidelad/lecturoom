import express from 'express';
import { waitlist } from '../controllers/waitlist.controller.js';
const router = express.Router();

router.post('/', waitlist)

export default router;