const express = require('express');
const { getActorsWithMultipleCharactersController } = require('../controllers/actorsWithMultipleCharactersController');

const router = express.Router();
router.get('/', getActorsWithMultipleCharactersController);
module.exports = router;