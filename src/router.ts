import { startShopSession } from "controller";
import customerSignin from "controller/customer-signin.controller";
import { Router } from "express";
import { body } from 'express-validator';

const router = Router();

const validateSignin = body("email").isEmail().withMessage("Invalid email") && body("password").isLength({ min: 8 }).withMessage("Password must be at least 6 characters");
router.post("/customer-signin", validateSignin, customerSignin);

const validateShopSignin = body("shopId");
router.post("/shop-signin", validateShopSignin, startShopSession);

export default router;
