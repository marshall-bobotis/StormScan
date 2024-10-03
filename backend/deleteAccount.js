const { getDb } = require("./mongo");

const deleteAccount = async (req, res, next) => {
    try {
        const db = await getDb();
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ status: 400, message: "User ID is required." });
        }

        const result = await db.collection("users").deleteOne({ userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ status: 404, message: "User not found." });
        }

        await db.collection("favorites").deleteOne({ userId });

        res.status(200).json({
            status: 200,
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting account:", error);
        next(error);
    }
};

module.exports = deleteAccount;