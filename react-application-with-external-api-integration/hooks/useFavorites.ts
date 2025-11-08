// Custom hook to manage favorite movies using localStorage

import { useState, useEffect } from 'react';
import { MovieSearchResult } from '@/lib/types';

const FAVORITES_KEY = 'movieFavorites'; // Key for localStorage

export function useFavorites() {
  // State to hold the list of favorite movies
  const [favorites, setFavorites] = useState<MovieSearchResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // Track if we've loaded from localStorage

  // Load favorites from localStorage when the hook first runs
  useEffect(() => {
    // Check if we're on the client (localStorage only works in browser)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setFavorites(parsed);
        } catch (error) {
          console.error('Failed to load favorites:', error);
        }
      }
      setIsLoaded(true); // Mark as loaded
    }
  }, []); // Empty array means this only runs once when component mounts

  // Save favorites to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]); // Runs whenever 'favorites' changes

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
