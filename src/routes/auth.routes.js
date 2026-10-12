import  { Router } from 'express';
import * as authController from '../controllers/auth.controller.js'

const authRouter = Router();

/**
 * Post /api/auth/register
 */
authRouter.post("/register",authController.register)

export default authRouter;

/**
 * Post/api/auth/get-me
 * 
 */
authRouter.get("/get-me",authController.getMe)
