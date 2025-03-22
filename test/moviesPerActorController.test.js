const { getMoviesPerActorController, optimizedGetMoviesPerActorController } = require('../src/controllers/moviesPerActorController');
const { fetchMovieCast } = require('../src/services/tmdbService');

jest.mock('../src/services/tmdbService', () => ({
  fetchMovieCast: jest.fn(),
}));

jest.mock('../dataForQuestions', () => ({
  movies: {
    'Movie A': 1,
    'Movie B': 2
  },
  actors: ['Actor X', 'Actor Y']
}));

describe('Movies Per Actor Controllers Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getMoviesPerActorController should return movies per actor', async () => {
    const req = {};
    const res = { json: jest.fn() };

    fetchMovieCast.mockImplementation((movieId) => {
      if (movieId === 1) return Promise.resolve([{ name: 'Actor X' }]);
      if (movieId === 2) return Promise.resolve([{ name: 'Actor Y' }]);
      return Promise.resolve([]);
    });

    await getMoviesPerActorController(req, res);

    expect(res.json).toHaveBeenCalledWith({
      'Actor X': ['Movie A'],
      'Actor Y': ['Movie B'],
    });
  });

  test('optimizedGetMoviesPerActorController should return optimized movies per actor', async () => {
    const req = {};
    const res = { json: jest.fn() };

    fetchMovieCast.mockImplementation((movieId) => {
      if (movieId === 1) return Promise.resolve([{ name: 'Actor X' }]);
      if (movieId === 2) return Promise.resolve([{ name: 'Actor Y' }]);
      return Promise.resolve([]);
    });

    await optimizedGetMoviesPerActorController(req, res);

    expect(res.json).toHaveBeenCalledWith({
      'Actor X': ['Movie A'],
      'Actor Y': ['Movie B'],
    });
  });

  test('should handle errors gracefully', async () => {
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    fetchMovieCast.mockRejectedValue(new Error('API Error'));

    await getMoviesPerActorController(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
