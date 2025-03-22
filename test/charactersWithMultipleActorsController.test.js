const { getCharactersWithMultipleActorsController } = require('../src/controllers/charactersWithMultipleActorsController');
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

describe('getCharactersWithMultipleActorsController Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return characters played by multiple actors', async () => {
    const req = {};
    const res = { json: jest.fn() };

    fetchMovieCast.mockImplementation((movieId) => {
      if (movieId === 1) return Promise.resolve([{ name: 'Actor X', character: 'Character X' }]);
      if (movieId === 2) return Promise.resolve([{ name: 'Actor Y', character: 'Character X' }]);
      return Promise.resolve([]);
    });

    await getCharactersWithMultipleActorsController(req, res);

    expect(res.json).toHaveBeenCalledWith({
      'Character X': [
        { movieName: 'Movie A', actorName: 'Actor X' },
        { movieName: 'Movie B', actorName: 'Actor Y' },
      ],
    });
  });

  test('should return empty object if no characters have multiple actors', async () => {
    const req = {};
    const res = { json: jest.fn() };

    fetchMovieCast.mockImplementation((movieId) => {
      if (movieId === 1) return Promise.resolve([{ name: 'Actor X', character: 'Character Y' }]);
      return Promise.resolve([]);
    });

    await getCharactersWithMultipleActorsController(req, res);

    expect(res.json).toHaveBeenCalledWith({});
  });

  test('should handle errors gracefully', async () => {
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    fetchMovieCast.mockRejectedValue(new Error('API Error'));

    await getCharactersWithMultipleActorsController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
