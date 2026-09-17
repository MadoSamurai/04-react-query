import axios from 'axios';
import type { Movie } from '../types/movie';

interface FetchMovieResponse {
  results: Movie[];
}

async function fetchMovies(query: string): Promise<Movie[]> {
  const response = await axios.get<FetchMovieResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: { query },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );
  return response.data.results;
}

export default fetchMovies;
