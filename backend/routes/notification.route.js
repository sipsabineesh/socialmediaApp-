import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getNotifications, markNotificationsAsRead } from "../controllers/notification.controller.js";
const router = express.Router();

router.route('/all').get(isAuthenticated, getNotifications);
router.route('/read').put(isAuthenticated, markNotificationsAsRead);

export default router;