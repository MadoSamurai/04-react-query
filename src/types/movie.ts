export interface Movie {
  id: number;
  poster_path: string;
  backdrop_path: string;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface FetchMovieResponse {
  results: Movie[];
  total_pages: number;
  page: number;
  total_results: number;
}
