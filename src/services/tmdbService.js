const axios = require('axios');

const TMDB_API_KEY = process.env.API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// optimization: to reduce the number of calls to the url and use in-memory cache
const movieIdCastMap = new Map();

const fetchMovieCast = async (movieId) => {
  if (!movieIdCastMap.has(movieId)) {
    const url = `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`;
    const response = await axios.get(url);

    movieIdCastMap.set(movieId, response.data.cast);
  }

  return movieIdCastMap.get(movieId);
};

module.exports = { fetchMovieCast, movieIdCastMap };
