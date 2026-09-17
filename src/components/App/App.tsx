import { useEffect, useState } from 'react';
import styles from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import fetchMovies from '../../services/movieService';
import type { Movie } from '../../types/movie';
import toast, { Toaster } from 'react-hot-toast';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import type { ComponentType } from 'react';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery({
    queryKey: ['movie', searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    placeholderData: keepPreviousData,
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
  useEffect(() => {
    if (isSuccess && !isFetching && movies.length === 0 && searchQuery) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, movies.length, searchQuery, page]);
  return (
    <>
      <div className={styles.app}>
        <Toaster position="top-right" />
        <SearchBar onSubmit={handleSearch} />
        {isError && <ErrorMessage />}
        {isLoading && <Loader />}

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
