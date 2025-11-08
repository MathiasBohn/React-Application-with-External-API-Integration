import Link from 'next/link';
import Image from 'next/image';
import { MovieSearchResult } from '@/lib/types';

interface MovieCardProps {
  movie: MovieSearchResult;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const hasPoster = movie.Poster !== 'N/A';

  return (
    <Link href={`/movie/${movie.imdbID}`}>
      <div className="group relative bg-zinc-900 rounded-xl overflow-hidden border-2 border-zinc-800 hover:border-yellow-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-600/20 film-strip">
        {/* Movie Poster */}
        <div className="relative h-96 bg-zinc-950 overflow-hidden">
          {hasPoster ? (
            <Image
              src={movie.Poster}
              alt={`${movie.Title} poster`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              unoptimized={!movie.Poster.includes('media-amazon.com')}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-zinc-900 to-zinc-950">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto text-zinc-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <p className="text-zinc-600 text-sm">No Poster</p>
              </div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Movie Info with Ticket Style */}
        <div className="p-4 bg-gradient-to-br from-zinc-900 to-zinc-950">
          <h3 className="font-bold text-lg mb-1 text-yellow-500 group-hover:text-yellow-400 transition-colors line-clamp-2">
            {movie.Title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="inline-block px-3 py-1 bg-zinc-800 text-yellow-600 rounded-full text-sm font-semibold border border-yellow-600/30">
              {movie.Year}
            </span>
            <span className="text-xs text-zinc-500 capitalize px-2 py-1 bg-zinc-800/50 rounded">
              {movie.Type}
            </span>
          </div>
        </div>

        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 pointer-events-none"></div>
      </div>
    </Link>
  );
}
