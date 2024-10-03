const express = require('express');
const router = express.Router();
const handlers = require('../handlers');

router.post('/register', handlers.addUser);
router.post('/login', handlers.loginUser);
router.post('/favorites', handlers.addFavorite);
router.get('/favorites/:userId', handlers.getFavorites);

module.exports = router;