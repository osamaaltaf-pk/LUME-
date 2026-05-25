import express from 'express'
import { register, login, refreshAccessToken, logout, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js';
import { validateSignUp, validateLogin } from '../middlewares/validationMiddleware.js'


const router = express.Router();

router.post('/register', validateSignUp, register);
router.post('/verify-otp', verifyEmail);
router.post('/login', validateLogin, login);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
