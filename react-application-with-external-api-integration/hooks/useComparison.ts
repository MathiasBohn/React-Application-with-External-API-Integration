// Custom hook to manage movies selected for comparison using localStorage

import { useState, useEffect } from 'react';
import { MovieDetails } from '@/lib/types';

const COMPARISON_KEY = 'movieComparison'; // Key for localStorage

export function useComparison() {
  // State to hold up to 2 movies for comparison
  const [comparisonMovies, setComparisonMovies] = useState<(MovieDetails | null)[]>([null, null]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load comparison movies from localStorage when the hook first runs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(COMPARISON_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setComparisonMovies(parsed);
        } catch (error) {
          console.error('Failed to load comparison movies:', error);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save comparison movies to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(COMPARISON_KEY, JSON.stringify(comparisonMovies));
    }
  }, [comparisonMovies, isLoaded]);

  // Add a movie to comparison (fills first empty slot)
  const addToComparison = (movie: MovieDetails) => {
    if (!comparisonMovies[0]) {
      // First slot empty
      setComparisonMovies([movie, comparisonMovies[1]]);
    } else if (!comparisonMovies[1]) {
      // Second slot empty
      setComparisonMovies([comparisonMovies[0], movie]);
    } else {
      // Both full, replace second slot
      setComparisonMovies([comparisonMovies[0], movie]);
    }
  };

  // Remove a movie from comparison by index
  const removeFromComparison = (index: 0 | 1) => {
    const newMovies = [...comparisonMovies];
    newMovies[index] = null;
    setComparisonMovies(newMovies as [MovieDetails | null, MovieDetails | null]);
  };

  // Clear all comparison movies
  const clearComparison = () => {
    setComparisonMovies([null, null]);
  };

  // Check if a movie is already in comparison
  const isInComparison = (imdbID: string): boolean => {
    return comparisonMovies.some(movie => movie?.imdbID === imdbID);
  };

  // Get count of movies in comparison
  const comparisonCount = comparisonMovies.filter(movie => movie !== null).length;

  return {
    comparisonMovies,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    comparisonCount,
  };
}
