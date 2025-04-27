import User from "../models/User.model.js"

export const isAdminMiddleware = async (req, res, next) => {
    try {
        const email = req.headers.email; // Extract email from headers instead of req.body

        // Identify the user and check if they are an admin
        const user = await User.findOne({ email });
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: "Access unauthorized for non-admins" });
        }
        // Allow access if user is admin
        next(); 

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};