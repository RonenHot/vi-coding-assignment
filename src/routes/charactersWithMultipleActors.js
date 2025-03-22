const express = require('express');
const { getCharactersWithMultipleActorsController } = require('../controllers/charactersWithMultipleActorsController');

const router = express.Router();
router.get('/', getCharactersWithMultipleActorsController);
module.exports = router;