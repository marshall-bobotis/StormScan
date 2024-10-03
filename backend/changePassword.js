const { getDb } = require("./mongo");
const bcrypt = require("bcrypt");

const changePassword = async (req, res, next) => {
    try {
        const db = await getDb();
        const { userId, newPassword } = req.body;

        if (!userId || !newPassword) {
            return res.status(400).json({ status: 400, message: "User ID and new password are required." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await db.collection("users").updateOne(
            { userId },
            { $set: { password: hashedPassword } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ status: 404, message: "User not found." });
        }

        res.status(200).json({
            status: 200,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Error changing password:", error);
        next(error);
    }
};

module.exports = changePassword;
