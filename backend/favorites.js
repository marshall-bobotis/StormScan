const { getDb } = require("./mongo");

const updateFavorite = async (req, res, next) => {
    try {
        const db = await getDb();
        const { userId, cityName } = req.body;

        if (!userId || !cityName) {
            return res.status(400).json({ status: 400, message: "User ID and city name are required." });
        }

        let result;
        if (req.method === 'POST') {
            result = await db.collection("favorites").updateOne(
                { userId },
                { $addToSet: { favorites: cityName } },
                { upsert: true }
            );
        } else if (req.method === 'DELETE') {
            result = await db.collection("favorites").updateOne(
                { userId },
                { $pull: { favorites: cityName } }
            );
        }

        res.status(200).json({
            status: 200,
            message: req.method === 'POST' ? "Favorite added successfully" : "Favorite removed successfully",
            data: { userId, cityName }
        });
    } catch (error) {
        console.error("Error updating favorite:", error);
        next(error);
    }
};

const getFavorites = async (req, res, next) => {
    try {
        const db = await getDb();
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ status: 400, message: "User ID is required." });
        }

        const result = await db.collection("favorites").findOne({ userId });

        res.status(200).json({
            status: 200,
            data: { favorites: result ? result.favorites : [] }
        });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        next(error);
    }
};

module.exports = { updateFavorite, getFavorites };