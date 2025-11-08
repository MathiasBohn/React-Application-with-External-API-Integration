'use client';

import { useState } from 'react';
import Link from 'next/link';
import { searchMovies } from '@/lib/omdb';
import { MovieSearchResult } from '@/lib/types';
import MovieCard from '@/components/MovieCard';
import { useFavorites } from '@/hooks/useFavorites';

export default function Home() {
  // State: 
  const [query, setQuery] = useState(''); // What user types in search box
  const [movies, setMovies] = useState<MovieSearchResult[]>([]); // Search results
  const [loading, setLoading] = useState(false); // Fetching data
  const [error, setError] = useState(''); // Any error messages

  // Get favorites count
  const { favorites } = useFavorites();

  // User submits  search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Don't reload the page

    if (!query.trim()) return;

    setLoading(true); // Show loading state
    setError(''); // Clear any previous errors

    try {
      // Call our API function
      const data = await searchMovies(query);

      // Check if API found movies
      if (data.Response === 'True') {
        setMovies(data.Search); // Save the movies
      } else {
        setError('No movies found. Try a different search.');
        setMovies([]); // Clear results
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setMovies([]);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="min-h-screen p-8 spotlight">
      <div className="max-w-7xl mx-auto">
        {/* Cinematic Header */}
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-transparent bg-clip-text">
            🎬 CINEMA VAULT
          </h1>
          <p className="text-yellow-600/80 text-lg tracking-widest mb-8">YOUR PREMIERE MOVIE COLLECTION</p>

          {/* Navigation */}
          <div className="flex justify-center gap-3">
            <Link
              href="/compare"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 font-semibold transition-all glow-purple border border-purple-500/30"
            >
              ⚖️ Compare Movies
            </Link>
            <Link
              href="/favorites"
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 font-semibold transition-all glow-red border border-red-500/30"
            >
              ❤️ Favorites ({favorites.length})
            </Link>
          </div>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="max-w-3xl mx-auto relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies, series, episodes..."
              className="w-full px-6 py-4 bg-zinc-900 border-2 border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20 transition-all text-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 disabled:from-zinc-700 disabled:to-zinc-800 disabled:text-zinc-500 transition-all glow-gold"
            >
              {loading ? '⏳ Searching...' : '🔍 Search'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-950/50 border border-red-900 rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {movies.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-yellow-500 mb-6">
              🎞️ Search Results
              <span className="ml-3 text-lg text-zinc-500">({movies.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && movies.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-zinc-900/50 rounded-2xl border-2 border-zinc-800 border-dashed">
              <svg className="w-24 h-24 mx-auto text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <h3 className="text-xl font-semibold text-zinc-400 mb-2">Welcome to Cinema Vault</h3>
              <p className="text-zinc-500">Start your cinematic journey by searching above</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
