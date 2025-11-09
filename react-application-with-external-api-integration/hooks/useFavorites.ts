// Custom hook to manage favorite movies using localStorage

import { useState, useEffect } from 'react';
import { MovieSearchResult } from '@/lib/types';

const FAVORITES_KEY = 'movieFavorites'; // Key for localStorage

// Load initial state from localStorage
const loadInitialFavorites = (): MovieSearchResult[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = localStorage.getItem(FAVORITES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      return [];
    }
  }
  return [];
};

export function useFavorites() {
  // State to hold the list of favorite movies - use lazy initialization
  const [favorites, setFavorites] = useState<MovieSearchResult[]>(loadInitialFavorites);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites]); // Runs whenever 'favorites' changes

  // Add a movie to favorites
  const addFavorite = (movie: MovieSearchResult) => {
    // Check if it's already favorited (avoid duplicates)
    const exists = favorites.find(fav => fav.imdbID === movie.imdbID);
    if (!exists) {
      setFavorites([...favorites, movie]);
    }
  };

  // Remove a movie from favorites
  const removeFavorite = (imdbID: string) => {
    setFavorites(favorites.filter(movie => movie.imdbID !== imdbID));
  };

  // Check if a movie is in favorites
  const isFavorite = (imdbID: string): boolean => {
    return favorites.some(movie => movie.imdbID === imdbID);
  };

  // Toggle favorite (add if not favorited, remove if already favorited)
  const toggleFavorite = (movie: MovieSearchResult) => {
    if (isFavorite(movie.imdbID)) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
}
