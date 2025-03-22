const { fetchMovieCast } = require('../services/tmdbService');
const { movies } = require('../../dataForQuestions');

const getCharactersWithMultipleActorsController = async (req, res) => {
  try {
    const characterActorsMap = await fetchCharacterActors();
    const characterActorsKeyValue = Object.entries(characterActorsMap);
    
    const resultsEntries = characterActorsKeyValue.filter(([_, actors]) => actors.length > 1);
    const results = Object.fromEntries(resultsEntries);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const fetchCharacterActors = async () => {
  const characterActorsMap = {};

  // optimization: call Object.entries function only once instead call it every loop oteration
  const movieKeyValue = Object.entries(movies);

  for (const [movieName, movieId] of movieKeyValue) {
    const cast = await fetchMovieCast(movieId);

    cast.forEach((member) => {
      if (!characterActorsMap[member.character]) {
        characterActorsMap[member.character] = [];
      }
      
      characterActorsMap[member.character].push({ movieName, actorName: member.name });
    });
  }

  return characterActorsMap;
};

module.exports = { getCharactersWithMultipleActorsController };