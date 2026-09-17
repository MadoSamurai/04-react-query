import axios from 'axios';
import type { FetchMovieResponse } from '../types/movie';

// interface FetchMovieResponse {
//   results: Movie[];
// }

async function fetchMovies(
  query: string,
  page: number
): Promise<FetchMovieResponse> {
  const response = await axios.get<FetchMovieResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: { query, page },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );
  return response.data;
}

export default fetchMovies;
