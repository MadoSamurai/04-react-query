import axios from 'axios';
import type { Movie } from '../types/movie';

export interface FetchMovieResponse {
  results: Movie[];
  total_pages: number;
  page: number;
  total_results: number;
}

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
