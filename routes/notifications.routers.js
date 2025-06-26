import * as controller from "../controllers/notifications.controller.js"
import router from "./professionals.routes.js";
import {authMiddleware} from "../middleware/middleware.js";


router.post('/user/send-push',authMiddleware, controller.sendNotificationToUser);
router.post('/token', authMiddleware, controller.registerToken);
export default router;