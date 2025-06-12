import axios from 'axios';
import type { Movie } from '../types/movie';

interface ResponseMovie {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const BASE_URL = 'https://api.themoviedb.org/3';
const myToken = import.meta.env.VITE_TMDB_API_TOKEN;

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await axios.get<ResponseMovie>(`${BASE_URL}/search/movie`, {
    params: { 
      query,
      language: 'en-US',
      include_adult: false,
},
    headers: {
      Authorization: `Bearer ${myToken}`,
    },
  });

  return response.data.results;
};