

import { useState } from 'react';
import { useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import css from './App.module.css'
import toast, { Toaster } from 'react-hot-toast';

 

export default function App() {

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const { data,  isLoading, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: keepPreviousData,

  })
 
   const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };

   const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie); 
  };

  const handleCloseModal = () => {
    setSelectedMovie(null); 
  };

   useEffect(() => {
    if (data && data.results.length === 0) {
      toast(`👽 Something went wrong!`);
    }
  }, [data]);

  return (
    <>
      <Toaster position="top-right"/>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.results.length > 0 && (
        <>
         <MovieGrid movies={data.results.slice(0, 15)} onSelect={handleSelectMovie} />
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </>
  );
}
