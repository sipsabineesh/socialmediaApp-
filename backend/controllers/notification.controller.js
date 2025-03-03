import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.id, isRead: false }).sort({ createdAt: -1 })
            .populate('senderId', 'username profilePicture');

        return res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const markNotificationsAsRead = async (req, res) => {
    try {
        console.log("IN markNotificationsAsRead FN")
        await Notification.updateMany({ userId: req.id, isRead: false }, { isRead: true });
        return res.status(200).json({ success: true, message: "Notifications marked as read" });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
