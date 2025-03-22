const { fetchMovieCast } = require('../services/tmdbService');
const { movies, actors } = require('../../dataForQuestions');

const getMoviesPerActorController = async (req, res) => {
  try {
    const results = {};

    for (const actorName of actors) {
      results[actorName] = await fetchActorMovies(actorName);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const fetchActorMovies = async (actorName) => {
  const results = [];

  // optimization: call Object.entries function only once instead call it every loop oteration
  const movieKeyValue = Object.entries(movies);

  for (const [movieName, movieId] of movieKeyValue) {
    const cast = await fetchMovieCast(movieId);
    
    if (cast.some((member) => member.name === actorName || member.original_name === actorName)) {
      results.push(movieName);
    }
  }

  return results;
};

const optimizedGetMoviesPerActorController = async (req, res) => {
  try {
    const results = {};

    console.log('moviesPerActorController -> optimizedGetMoviesPerActorController: Start fetching actor movies');
    const actorMoviesMap = await optimizedFetchActorMovies();
    console.log('moviesPerActorController -> optimizedGetMoviesPerActorController: Finish fetching actor movies');

    const actorNamesSet = new Set(Object.keys(actorMoviesMap));

    for (const actorName of actors) {
      const movieNames = actorMoviesMap[actorName];

      if (actorNamesSet.has(actorName)) {
        results[actorName] = movieNames;
      }
    }

    res.json(results);
  } catch (error) {
    console.error('moviesPerActorController -> optimizedGetMoviesPerActorController: Failed to return actor movies. error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const optimizedFetchActorMovies = async () => {
  const actorMoviesMap = {};

  const movieMap = Object.entries(movies);

  for (const [movieName, movieId] of movieMap) {
    const cast = await fetchMovieCast(movieId);

    cast.forEach((member) => {
      if (!actorMoviesMap[member.name]) {
        actorMoviesMap[member.name] = [];
      }
      
      actorMoviesMap[member.name].push(movieName);
    });
    
  }

  return actorMoviesMap;
};

module.exports = { getMoviesPerActorController, optimizedGetMoviesPerActorController };
