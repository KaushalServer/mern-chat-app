import User from "../models/user.models.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id

        const allUsers = await User.find({
            _id: {
                $ne : loggedInUserId // not equal to logged in user
            }
        }).select("-password")

        res.status(200).json(allUsers)

    } catch (error) {
        console.log("Error from Sidebar Users: ", error.message);
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}