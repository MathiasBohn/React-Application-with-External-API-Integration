'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getMovieDetails } from '@/lib/omdb';
import { MovieDetails } from '@/lib/types';
import { useFavorites } from '@/hooks/useFavorites';
import { useComparison } from '@/hooks/useComparison';

export default function MovieDetailPage() {
  const params = useParams(); // Get URL parameters
  const router = useRouter(); // For navigation
  const imdbID = params.imdbID as string; // The movie ID from URL

  // Favorites hook
  const { isFavorite, toggleFavorite } = useFavorites();

  // Comparison hook
  const { addToComparison, isInComparison, comparisonCount } = useComparison();

  // State for the movie data
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch movie details when page loads
  useEffect(() => {
    async function fetchMovie() {
      try {
        const data = await getMovieDetails(imdbID);

        if (data.Response === 'True') {
          setMovie(data);
        } else {
          setError('Movie not found');
        }
      } catch {
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [imdbID]); // Run when imdbID changes

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="text-center">
          <div className="inline-block p-8 bg-zinc-900/50 rounded-2xl border-2 border-yellow-600/30">
            <p className="text-2xl text-yellow-500 font-semibold">⏳ Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="text-center">
          <div className="inline-block p-8 bg-zinc-900/50 rounded-2xl border-2 border-red-600/30">
            <p className="text-xl text-red-400 mb-4">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all glow-gold"
            >
              🎬 Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle favorite button click
  const handleFavoriteClick = () => {
    // Create a simplified movie object for favorites list
    const movieForFavorites = {
      imdbID: movie!.imdbID,
      Title: movie!.Title,
      Year: movie!.Year,
      Poster: movie!.Poster,
      Type: movie!.Type,
    };
    toggleFavorite(movieForFavorites);
  };

  // Handle compare button click
  const handleCompareClick = () => {
    if (movie) {
      addToComparison(movie);
      // Navigate to compare page
      router.push('/compare');
    }
  };

  // Check if this movie is favorited
  const favorited = isFavorite(imdbID);

  // Check if this movie is already in comparison
  const inComparison = isInComparison(imdbID);

  // Display the movie details
  return (
    <div className="min-h-screen p-8 spotlight bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="max-w-6xl mx-auto">
        {/* Back Button, Favorite Button, and Compare Button */}
        <div className="mb-8 flex gap-3 flex-wrap">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 border border-zinc-700 transition-all font-semibold"
          >
            ← Back
          </button>

          <button
            onClick={handleFavoriteClick}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              favorited
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 glow-red border border-red-500/30'
                : 'bg-zinc-900 border-2 border-red-500 text-red-400 hover:bg-zinc-800'
            }`}
          >
            {favorited ? '❤️ Favorited' : '🤍 Add to Favorites'}
          </button>

          <button
            onClick={handleCompareClick}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              inComparison
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600 glow-purple border border-purple-500/30'
                : 'bg-zinc-900 border-2 border-purple-500 text-purple-400 hover:bg-zinc-800'
            }`}
          >
            {inComparison ? '⚖️ In Comparison' : '⚖️ Add to Compare'}
          </button>

          {comparisonCount > 0 && (
            <span className="px-4 py-3 bg-purple-900/50 text-purple-300 rounded-lg text-sm font-semibold border border-purple-500/30">
              {comparisonCount} movie{comparisonCount > 1 ? 's' : ''} ready to compare
            </span>
          )}
        </div>

        {/* Movie Content */}
        <div className="bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border-2 border-zinc-800 film-strip">
          <div className="md:flex">
            {/* Poster */}
            <div className="md:w-2/5 relative min-h-[600px]">
              {movie.Poster !== 'N/A' ? (
                <Image
                  src={movie.Poster}
                  alt={`${movie.Title} poster`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  unoptimized={!movie.Poster.includes('media-amazon.com')}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-zinc-900 to-zinc-950">
                  <div className="text-center">
                    <svg className="w-32 h-32 mx-auto text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                    <p className="text-zinc-500 text-lg">No Poster Available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="md:w-3/5 p-8 bg-gradient-to-br from-zinc-900 to-zinc-950">
              <h1 className="text-4xl font-bold mb-3 text-yellow-500">{movie.Title}</h1>
              <p className="text-yellow-600/80 mb-6 text-lg">
                {movie.Year} • {movie.Rated} • {movie.Runtime}
              </p>

              {/* Genre */}
              <div className="mb-6">
                <span className="font-semibold text-yellow-500">Genre: </span>
                <span className="text-zinc-300">{movie.Genre}</span>
              </div>

              {/* Plot */}
              <div className="mb-6">
                <h2 className="font-semibold text-xl mb-3 text-yellow-500">🎬 Plot</h2>
                <p className="text-zinc-300 leading-relaxed">{movie.Plot}</p>
              </div>

              {/* Cast & Crew */}
              <div className="mb-6 space-y-2">
                <p className="text-zinc-300">
                  <span className="font-semibold text-yellow-500">Director: </span>
                  {movie.Director}
                </p>
                <p className="text-zinc-300">
                  <span className="font-semibold text-yellow-500">Writers: </span>
                  {movie.Writer}
                </p>
                <p className="text-zinc-300">
                  <span className="font-semibold text-yellow-500">Cast: </span>
                  {movie.Actors}
                </p>
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <h2 className="font-semibold text-xl mb-3 text-yellow-500">⭐ Ratings</h2>
                <div className="flex gap-4 flex-wrap">
                  {/* IMDb Rating */}
                  {movie.imdbRating !== 'N/A' && (
                    <div className="bg-yellow-600/20 border border-yellow-600/30 px-5 py-3 rounded-lg">
                      <p className="text-sm text-yellow-600/80 mb-1">IMDb</p>
                      <p className="text-2xl font-bold text-yellow-500">{movie.imdbRating}/10</p>
                    </div>
                  )}

                  {/* Other Ratings */}
                  {movie.Ratings && movie.Ratings.map((rating, index) => (
                    <div key={index} className="bg-zinc-800 border border-zinc-700 px-5 py-3 rounded-lg">
                      <p className="text-sm text-zinc-400 mb-1">{rating.Source}</p>
                      <p className="text-lg font-bold text-zinc-200">{rating.Value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-sm text-zinc-400 space-y-1 bg-zinc-800/50 p-4 rounded-lg border border-zinc-800">
                <p><span className="font-semibold text-yellow-500">Language:</span> {movie.Language}</p>
                <p><span className="font-semibold text-yellow-500">Country:</span> {movie.Country}</p>
                {movie.Awards !== 'N/A' && (
                  <p><span className="font-semibold text-yellow-500">Awards:</span> {movie.Awards}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
