// This file contains functions to fetch data from the OMDb API

import { MovieDetails, SearchResponse } from './types';

// API key from environment variables for security
// Make sure to set NEXT_PUBLIC_OMDB_API_KEY in your .env.local file
const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

// Validate API key exists
if (!API_KEY) {
  console.error('⚠️ OMDB API key is missing! Please add NEXT_PUBLIC_OMDB_API_KEY to your .env.local file');
}

/**
 * Search for movies by title
 * @param query - The movie title to search for (e.g., "Inception")
 * @returns A list of movies matching the search
 */
export async function searchMovies(query: string): Promise<SearchResponse> {
  // Build the URL with our search query
  // Example: http://www.omdbapi.com/?apikey=3c76c1c&s=Inception
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;

  // Fetch data from the API
  const response = await fetch(url);

  // Convert the response to JSON
  const data = await response.json();

  return data;
}

/**
 * Get full details about a specific movie using its IMDb ID
 * @param imdbID - The IMDb ID (e.g., "tt1375666")
 * @returns Full movie details including plot, ratings, cast, etc.
 */
export async function getMovieDetails(imdbID: string): Promise<MovieDetails> {
  // Build the URL with the movie ID
  // Example: http://www.omdbapi.com/?apikey=3c76c1c&i=tt1375666
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}`;

  // Fetch and return the data
  const response = await fetch(url);
  const data = await response.json();

  return data;
}

/**
 * Search for a movie by exact title
 * @param title - Exact movie title
 * @returns Full movie details
 */
export async function getMovieByTitle(title: string): Promise<MovieDetails> {
  // Use 't' parameter for exact title match
  const url = `${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
}
