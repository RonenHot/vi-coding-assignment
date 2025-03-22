const axios = require('axios');
const { fetchMovieCast, movieIdCastMap } = require('../src/services/tmdbService');

jest.mock('axios');

describe('TMDB Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    movieIdCastMap.clear();
  });

  test('should fetch movie cast from API when not cached', async () => {
    const movieId = 123;
    const mockCast = [{ name: 'Actor 1', character: 'Character 1' }];
    axios.get.mockResolvedValueOnce({ data: { cast: mockCast } });

    const result = await fetchMovieCast(movieId);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`/movie/${movieId}/credits`));
    expect(result).toEqual(mockCast);
  });

  test('should return cached data for repeated calls with same movieId', async () => {
    const movieId = 123;
    const mockCast = [{ name: 'Actor 1', character: 'Character 1' }];
    axios.get.mockResolvedValueOnce({ data: { cast: mockCast } });

    await fetchMovieCast(movieId);
    
    // Second call should use cache
    const result = await fetchMovieCast(movieId);

    expect(axios.get).toHaveBeenCalledTimes(1); // API should only be called once
    expect(result).toEqual(mockCast);
  });

  test('should make separate API calls for different movie IDs', async () => {
    const movieId1 = 123;
    const movieId2 = 456;

    const mockCast1 = [{ name: 'Actor 1', character: 'Character 1' }];
    const mockCast2 = [{ name: 'Actor 2', character: 'Character 2' }];
    
    axios.get.mockResolvedValueOnce({ data: { cast: mockCast1 } });
    axios.get.mockResolvedValueOnce({ data: { cast: mockCast2 } });

    // Call with first movie ID
    const result1 = await fetchMovieCast(movieId1);
    
    // Call with second movie ID
    const result2 = await fetchMovieCast(movieId2);

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenNthCalledWith(1, expect.stringContaining(`/movie/${movieId1}/credits`));
    expect(axios.get).toHaveBeenNthCalledWith(2, expect.stringContaining(`/movie/${movieId2}/credits`));
    expect(result1).toEqual(mockCast1);
    expect(result2).toEqual(mockCast2);
  });

  test('should handle API errors properly', async () => {
    const movieId = 123;
    axios.get.mockRejectedValueOnce(new Error('API Error'));
    
    await expect(fetchMovieCast(movieId)).rejects.toThrow('API Error');
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});