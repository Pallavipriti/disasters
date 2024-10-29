import express from 'express';
import { logoutUser, registerUser, signinUser, registerAdmin, signinAdmin, logoutAdmin } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/user/register', registerUser);
router.post('/user/signin', signinUser);
router.post('/user/logout', logoutUser);

router.post('/admin/register', registerAdmin);
router.post('/admin/signin', signinAdmin);
router.post('/admin/logout', logoutAdmin);

export default router;