import  { Router } from 'express';
import * as authController from '../controllers/auth.controller.js'

const authRouter = Router();

/**
 * Post /api/auth/register
 */
authRouter.post("/register",authController.register)

export default authRouter;

/**
 * post/api/auth/login
 */
authRouter.post("/login",authController.login)

/**
 * Post/api/auth/get-me
 * 
 */
authRouter.get("/get-me",authController.getMe)

/**
 * Get/api/auth/refresh-token
 */

authRouter.get("/refresh-token",authController.refreshToken)

/**
 * Get/api/auth/logout
 */

authRouter.get("/logout",authController.logout)

/**
 * Get/api/auth/logout-all
 */
authRouter.get("/logout-all",authController.logoutAll)
