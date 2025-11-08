'use client';

import { useFavorites } from '@/hooks/useFavorites';
import MovieCard from '@/components/MovieCard';
import Link from 'next/link';

export default function FavoritesPage() {
  // Get favorites from our custom hook
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen p-8 spotlight bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Cinematic Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-red-500 text-transparent bg-clip-text mb-2">
                ❤️ MY FAVORITES
              </h1>
              <p className="text-red-600/80 text-lg tracking-wide">YOUR PERSONAL COLLECTION</p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all glow-gold"
            >
              🎬 Back to Search
            </Link>
          </div>

          {/* Show count */}
          <div className="inline-block px-6 py-3 bg-zinc-900 border-2 border-red-600/30 rounded-lg">
            <p className="text-red-400 font-semibold">
              {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved
            </p>
          </div>
        </div>

        {/* Display favorites or empty state */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-12 bg-zinc-900/50 rounded-2xl border-2 border-zinc-800 border-dashed">
              <svg className="w-32 h-32 mx-auto text-zinc-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-zinc-400 mb-3">
                No favorites yet!
              </h3>
              <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                Search for movies and click the heart button to save them to your personal collection.
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-500 hover:to-red-600 transition-all glow-red border border-red-500/30"
              >
                🎬 Start Searching
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
