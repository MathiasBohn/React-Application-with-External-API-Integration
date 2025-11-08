'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { searchMovies } from '@/lib/omdb';
import { MovieSearchResult, MovieDetails } from '@/lib/types';
import { useComparison } from '@/hooks/useComparison';

export default function ComparePage() {
  const {
    comparisonMovies,
    removeFromComparison,
    clearComparison,
  } = useComparison();

  // Search states for adding movies
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSlot, setActiveSlot] = useState<0 | 1 | null>(null); // Which slot to fill

  const [movie1, movie2] = comparisonMovies;

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || activeSlot === null) return;

    setLoading(true);
    try {
      const data = await searchMovies(searchQuery);
      if (data.Response === 'True') {
        setSearchResults(data.Search.slice(0, 5));
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Close search modal
  const closeSearch = () => {
    setActiveSlot(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Movie comparison card component with improved design
  const MovieCard = ({ movie, index }: { movie: MovieDetails; index: 0 | 1 }) => {
    const getRatingColor = (rating: string) => {
      const num = parseFloat(rating);
      if (num >= 8) return 'bg-green-900/50 text-green-400 border-green-600/30';
      if (num >= 6) return 'bg-yellow-900/50 text-yellow-400 border-yellow-600/30';
      return 'bg-red-900/50 text-red-400 border-red-600/30';
    };

    return (
      <div className="bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border-2 border-zinc-800 film-strip">
        {/* Header with remove button */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">🎬 Movie {index + 1}</h2>
          <button
            onClick={() => removeFromComparison(index)}
            className="text-white hover:text-red-300 transition-colors"
            title="Remove movie"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Poster */}
        <div className="relative h-80">
          {movie.Poster !== 'N/A' ? (
            <Image
              src={movie.Poster}
              alt={`${movie.Title} poster`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized={!movie.Poster.includes('media-amazon.com')}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-zinc-900 to-zinc-950">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto text-zinc-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <p className="text-zinc-500 text-sm">No Poster</p>
              </div>
            </div>
          )}
          {/* IMDb Rating Badge */}
          <div className={`absolute top-4 right-4 px-3 py-2 rounded-lg font-bold text-lg border-2 ${getRatingColor(movie.imdbRating)}`}>
            ⭐ {movie.imdbRating}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 bg-gradient-to-br from-zinc-900 to-zinc-950">
          <div>
            <h3 className="text-2xl font-bold text-yellow-500 mb-1">{movie.Title}</h3>
            <p className="text-yellow-600/80">{movie.Year} • {movie.Runtime} • {movie.Rated}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {movie.Genre.split(', ').map((genre, i) => (
              <span key={i} className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm font-medium border border-purple-600/30">
                {genre}
              </span>
            ))}
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex">
              <span className="font-semibold text-yellow-500 w-24">Director:</span>
              <span className="text-zinc-300 flex-1">{movie.Director}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-yellow-500 w-24">Cast:</span>
              <span className="text-zinc-300 flex-1">{movie.Actors}</span>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-3">
            <p className="font-semibold text-yellow-500 mb-2">Plot:</p>
            <p className="text-zinc-300 text-sm leading-relaxed">{movie.Plot}</p>
          </div>

          {/* All Ratings */}
          {movie.Ratings && movie.Ratings.length > 0 && (
            <div className="border-t border-zinc-800 pt-3">
              <p className="font-semibold text-yellow-500 mb-2">Ratings:</p>
              <div className="space-y-2">
                {movie.Ratings.map((rating, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-zinc-400">{rating.Source}</span>
                    <span className="font-semibold text-zinc-200">{rating.Value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Empty slot component
  const EmptySlot = ({ index }: { index: 0 | 1 }) => (
    <div className="bg-zinc-900/50 rounded-xl border-2 border-dashed border-zinc-700 p-12 flex flex-col items-center justify-center min-h-[500px]">
      <div className="text-zinc-700 mb-6">
        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-zinc-400 mb-2">🎬 Movie {index + 1}</h3>
      <p className="text-zinc-500 mb-6">No movie selected</p>
      <button
        onClick={() => setActiveSlot(index)}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 font-semibold transition-all glow-purple border border-purple-500/30"
      >
        Select Movie
      </button>
    </div>
  );

  return (
    <div className="min-h-screen p-8 spotlight bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500 text-transparent bg-clip-text mb-2">
                ⚖️ COMPARE MOVIES
              </h1>
              <p className="text-purple-600/80 text-lg tracking-wide">SIDE-BY-SIDE ANALYSIS</p>
            </div>
            <div className="flex gap-3">
              {(movie1 || movie2) && (
                <button
                  onClick={clearComparison}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 font-semibold transition-all glow-red border border-red-500/30"
                >
                  Clear All
                </button>
              )}
              <Link
                href="/"
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all glow-gold"
              >
                🎬 Back
              </Link>
            </div>
          </div>
        </div>

        {/* Two-column layout for comparison */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Movie 1 */}
          <div>
            {movie1 ? <MovieCard movie={movie1} index={0} /> : <EmptySlot index={0} />}
          </div>

          {/* Movie 2 */}
          <div>
            {movie2 ? <MovieCard movie={movie2} index={1} /> : <EmptySlot index={1} />}
          </div>
        </div>

        {/* Comparison Summary (shown when both movies are selected) */}
        {movie1 && movie2 && (
          <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 rounded-xl p-8 border-2 border-purple-600/30">
            <h2 className="text-3xl font-bold text-yellow-500 mb-8 text-center">⚡ Quick Comparison</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-zinc-900 rounded-lg p-5 shadow-lg border border-zinc-800">
                <h3 className="font-semibold text-yellow-500 text-sm mb-4 text-center">IMDb Rating</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-medium">Movie 1:</span>
                    <span className="font-bold text-lg text-zinc-200">{movie1.imdbRating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 font-medium">Movie 2:</span>
                    <span className="font-bold text-lg text-zinc-200">{movie2.imdbRating}</span>
                  </div>
                  <div className="text-center pt-2 border-t border-zinc-800">
                    <span className="text-green-400 font-bold text-sm">
                      {parseFloat(movie1.imdbRating) > parseFloat(movie2.imdbRating)
                        ? '↑ Movie 1 Higher'
                        : parseFloat(movie2.imdbRating) > parseFloat(movie1.imdbRating)
                        ? '↑ Movie 2 Higher'
                        : '= Tied'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-5 shadow-lg border border-zinc-800">
                <h3 className="font-semibold text-yellow-500 text-sm mb-4 text-center">Runtime</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-medium">Movie 1:</span>
                    <span className="font-bold text-zinc-200">{movie1.Runtime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 font-medium">Movie 2:</span>
                    <span className="font-bold text-zinc-200">{movie2.Runtime}</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-5 shadow-lg border border-zinc-800">
                <h3 className="font-semibold text-yellow-500 text-sm mb-4 text-center">Release Year</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-medium">Movie 1:</span>
                    <span className="font-bold text-zinc-200">{movie1.Year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 font-medium">Movie 2:</span>
                    <span className="font-bold text-zinc-200">{movie2.Year}</span>
                  </div>
                  <div className="text-center pt-2 border-t border-zinc-800">
                    <span className="text-blue-400 font-bold text-sm">
                      {parseInt(movie1.Year) < parseInt(movie2.Year)
                        ? `${parseInt(movie2.Year) - parseInt(movie1.Year)} years apart`
                        : parseInt(movie1.Year) > parseInt(movie2.Year)
                        ? `${parseInt(movie1.Year) - parseInt(movie2.Year)} years apart`
                        : 'Same year'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-5 shadow-lg border border-zinc-800">
                <h3 className="font-semibold text-yellow-500 text-sm mb-4 text-center">Genre Match</h3>
                <div className="space-y-2">
                  {(() => {
                    const genres1 = movie1.Genre.split(', ');
                    const genres2 = movie2.Genre.split(', ');
                    const common = genres1.filter(g => genres2.includes(g));
                    return (
                      <>
                        <div className="text-center">
                          <span className="font-bold text-3xl text-purple-400">{common.length}</span>
                          <p className="text-xs text-zinc-500 mt-1">Genres in common</p>
                        </div>
                        {common.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-center pt-2">
                            {common.map((genre, i) => (
                              <span key={i} className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded text-xs font-medium border border-purple-600/30">
                                {genre}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Modal */}
        {activeSlot !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border-2 border-zinc-800 rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-yellow-500">🎬 Select Movie {activeSlot + 1}</h2>
                <button
                  onClick={closeSearch}
                  className="text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a movie..."
                    className="flex-1 px-4 py-3 bg-zinc-950 border-2 border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 disabled:from-zinc-700 disabled:to-zinc-800 disabled:text-zinc-500 font-semibold transition-all glow-purple"
                  >
                    {loading ? '⏳ Searching...' : '🔍 Search'}
                  </button>
                </div>
              </form>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400 mb-3">Select a movie from results:</p>
                  {searchResults.map((result) => (
                    <Link
                      key={result.imdbID}
                      href={`/movie/${result.imdbID}`}
                      onClick={closeSearch}
                      className="block p-4 bg-zinc-950 rounded-lg hover:bg-zinc-800 border-2 border-zinc-800 hover:border-purple-600 transition-all"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-16 h-24 flex-shrink-0">
                          {result.Poster !== 'N/A' ? (
                            <Image
                              src={result.Poster}
                              alt={result.Title}
                              fill
                              sizes="64px"
                              className="object-cover rounded border border-zinc-700"
                              unoptimized={!result.Poster.includes('media-amazon.com')}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-zinc-900 rounded border border-zinc-700">
                              <svg className="w-8 h-8 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-yellow-500">{result.Title}</p>
                          <p className="text-sm text-zinc-400">{result.Year} • {result.Type}</p>
                          <p className="text-xs text-purple-400 mt-2">Click to view details and add to comparison</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
