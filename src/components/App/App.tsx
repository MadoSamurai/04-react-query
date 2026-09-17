import { useState } from 'react';
import styles from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import fetchMovies from '../../services/movieService';
import type { Movie } from '../../types/movie';
import toast, { Toaster } from 'react-hot-toast';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import { useQuery } from '@tanstack/react-query';
// import ReactPaginate from 'react-paginate';

import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import type { ComponentType } from 'react';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

// Далі в jsx використувуємо компонент ReactPaginate звичайним чином.

function App() {
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<boolean>(false);
  // const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // async function handleSearch(query: string) {
  //   setMovies([]);
  //   setError(false);
  //   setLoading(true);
  //   try {
  //     const data = await fetchMovies(query);
  //     if (data.length === 0) {
  //       toast.error('No movies found for your request.');
  //       return;
  //     }
  //     setMovies(data);
  //   } catch (error) {
  //     setError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  // function handleCloseModal() {
  //   setSelectedMovie(null);
  // }
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movie', searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: Boolean(searchQuery),
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };
  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const movies = data?.results ?? [];
  const totalPage = data?.total_pages ?? 0;
  return (
    <>
      <div className={styles.app}>
        <Toaster position="top-right" />
        <SearchBar onSubmit={handleSearch} />
        {totalPage > 1 && !isLoading && (
          <ReactPaginate
            pageCount={totalPage}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={styles.pagination}
            activeClassName={styles.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}
        {isError && <ErrorMessage />}
        {isLoading && <Loader />}
        {movies.length > 0 && !isLoading && (
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
        )}

        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </div>
    </>
  );
}

export default App;
