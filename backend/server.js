"use strict";

const express = require("express");
const morgan = require("morgan");
const dotenv = require('dotenv');
const path = require('path');
const handlers = require("./handlers");

dotenv.config();

express()
    .use(morgan("dev"))
    .use(express.json())

    .use(express.static(path.join(__dirname, '../frontend/build')))

    .post("/api/register", handlers.addUser)
    .post("/api/login", handlers.loginUser)
    .post("/api/favorites", handlers.updateFavorite)
    .delete("/api/favorites", handlers.updateFavorite)
    .get("/api/favorites/:userId", handlers.getFavorites)

    .post("/api/change-password", handlers.changePassword)
    .delete("/api/delete-account", handlers.deleteAccount)

    .get("/", (req, res) => {
        if (process.env.NODE_ENV !== 'production') {
            res.send("Server is running.");
        } else {
            res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
        }
    })

    .get("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    })

    .listen(8000, () => console.log(`Listening on port 8000`));