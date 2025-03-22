const express = require('express');
const { getMoviesPerActorController, optimizedGetMoviesPerActorController } = require('../controllers/moviesPerActorController');

const router = express.Router();
router.get('/', optimizedGetMoviesPerActorController);
module.exports = router;