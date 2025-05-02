import { MovieDetails, SearchResponse } from "../types/movie";

const API_KEY = import.meta.env.VITE_MOV_API_KEY;
const BASE_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

export const searchMovies = async (
  query: string,
  page = 1
): Promise<SearchResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}&s=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await response.json();

    if (data.Response === "False") {
      throw new Error(data.Error || "Failed to fetch movies");
    }

    return data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const getMovieById = async (imdbId: string): Promise<MovieDetails> => {
  try {
    const response = await fetch(`${BASE_URL}&i=${imdbId}&plot=full`);
    const data = await response.json();

    if (data.Response === "False") {
      throw new Error(data.Error || "Failed to fetch movie details");
    }

    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const getPosterUrl = (posterPath: string): string => {
  if (posterPath === "N/A") {
    return "/poster1.jpg";
  }
  return posterPath;
};
