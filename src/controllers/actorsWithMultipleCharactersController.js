const { fetchMovieCast } = require('../services/tmdbService');
const { movies, actors } = require('../../dataForQuestions');

const getActorsWithMultipleCharactersController = async (req, res) => {
  try {
    const results = {};

    console.log('actorsWithMultipleCharactersController -> getActorsWithMultipleCharactersController: Start fetching actor characters ');
    const actorCharactersMap = await fetchActorCharacters();
    console.log('actorsWithMultipleCharactersController -> getActorsWithMultipleCharactersController: Finish fetching actor characters ');

    const actorNamesSet = new Set(Object.keys(actorCharactersMap));

    for (const actorName of actors) {
      const actorWithMultipleCharacters = actorCharactersMap[actorName]?.length > 1;

      if (actorNamesSet.has(actorName) && actorWithMultipleCharacters) {
        results[actorName] = actorCharactersMap[actorName];
      }
    }

    res.json(results);
  } catch (error) {
    console.error('actorsWithMultipleCharactersController -> getActorsWithMultipleCharactersController: Failed to return actor characters. error: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const fetchActorCharacters = async () => {
  const actorCharactersMap = {};

  // optimization: call Object.entries function only once instead call it every loop oteration
  const movieKeyValue = Object.entries(movies);

  for (const [movieName, movieId] of movieKeyValue) {
    const cast = await fetchMovieCast(movieId);

    cast.forEach((member) => {
      if (!actorCharactersMap[member.name]) {
        actorCharactersMap[member.name] = [];
      }
      
      actorCharactersMap[member.name].push({ movieName, characterName: member.character });
    });
  }

  return actorCharactersMap;
};

module.exports = { getActorsWithMultipleCharactersController };