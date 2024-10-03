"use strict";

const { getDb } = require("./mongo");
const bcrypt = require("bcrypt");

/**
 * email and password verification
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next - middleware function
 */
const loginUser = async (req, res, next) => {
    try {
        const db = await getDb();
        const { email, password } = req.body;

        // Validates input
        if (!email || !password) {
            return res.status(400).json({ status: 400, message: "Email and password are required." });
        }

        // Finds user by email
        const user = await db.collection("users").findOne({ email });
        if (!user) {
            return res.status(401).json({ status: 401, message: "Invalid email or password." });
        }

        // Compares passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 401, message: "Invalid email or password." });
        }


        res.status(200).json({
            status: 200,
            data: { userId: user.userId, name: user.name, email: user.email },
            message: "Login successful.",
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        next(error);
    }
};

module.exports = loginUser;