"use strict";

const { getDb } = require("./mongo");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const addUser = async (req, res, next) => {
    try {
        const db = await getDb();
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ status: 400, message: "All fields are required." });
        }

        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return res.status(409).json({ status: 409, message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        const newUser = { userId, name, email, password: hashedPassword };

        await db.collection("users").insertOne(newUser);

        res.status(201).json({
            status: 201,
            data: { userId, name, email },
            message: "User registered successfully.",
        });
    } catch (error) {
        console.error("Error adding user:", error);
        next(error);
    }
};

module.exports = addUser;