const addUser = require("./addUser");
const loginUser = require("./loginUser");
const { updateFavorite, getFavorites } = require("./favorites");
const changePassword = require("./changePassword");
const deleteAccount = require("./deleteAccount");

module.exports = {
    addUser,
    loginUser,
    updateFavorite,
    getFavorites,
    changePassword,
    deleteAccount
};