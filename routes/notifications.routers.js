import * as controller from "../controllers/notifications.controller.js"
import express from "express";
const router = express.Router();
import {authMiddleware} from "../middleware/middleware.js";

router.post('/test', controller.tryPushNotificationService);
router.post('/user/send-push',authMiddleware, controller.sendNotificationToUser);
router.post('/token', authMiddleware, controller.registerToken);
export default router;