const { getActorsWithMultipleCharactersController } = require('../src/controllers/actorsWithMultipleCharactersController');
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

describe('getActorsWithMultipleCharactersController Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return actors who played multiple characters', async () => {
    const req = {};
    const res = { json: jest.fn() };

    fetchMovieCast.mockImplementation((movieId) => {
      if (movieId === 1) return Promise.resolve([{ name: 'Actor X', character: 'Character X' }]);
      if (movieId === 2) return Promise.resolve([{ name: 'Actor X', character: 'Character Y' }]);
      return Promise.resolve([]);
    });

    await getActorsWithMultipleCharactersController(req, res);

    expect(res.json).toHaveBeenCalledWith({
      'Actor X': [
        { movieName: 'Movie A', characterName: 'Character X' },
        { movieName: 'Movie B', characterName: 'Character Y' },
      ],
    });
  });

  test('should return empty object if no actors have multiple characters', async () => {
    const req = {};
    const res = { json: jest.fn() };

    fetchMovieCast.mockImplementation((movieId) => {
      if (movieId === 1) return Promise.resolve([{ name: 'Actor Y', character: 'Character Z' }]);
      return Promise.resolve([]);
    });

    await getActorsWithMultipleCharactersController(req, res);

    expect(res.json).toHaveBeenCalledWith({});
  });

  test('should handle errors gracefully', async () => {
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    fetchMovieCast.mockRejectedValue(new Error('API Error'));

    await getActorsWithMultipleCharactersController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
