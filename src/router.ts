import { customerSignin, startShopSession, validateShopSession } from "controller";
import { Router } from "express";
import { body } from 'express-validator';
import { reconstructToken, verifyToken } from "middleware";

const router = Router();

const validateCustomerSigninBody = body("email").isEmail().withMessage("Invalid email") && body("password").isLength({ min: 8 }).withMessage("Password must be at least 6 characters");
router.post("/customer-signin", validateCustomerSigninBody, customerSignin);

const validateShopSigninBody = body("shopId");
router.post("/start-shop-session", validateShopSigninBody, startShopSession);

const validateSesionBody = 
    body("shopId").isString().withMessage("Invalid shopId") 
    && body("timeLoggedIn").isString().withMessage("Invalid timeLoggedIn")
    && body("email").isEmail().withMessage("Invalid email");
router.get("/validate-shop-session", reconstructToken, verifyToken, validateSesionBody, validateShopSession);

export default router;
