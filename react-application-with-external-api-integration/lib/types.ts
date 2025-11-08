// This file defines the shape of data we get from the OMDb API

// When we search for movies, each result looks like this (simplified)
export interface MovieSearchResult {
  imdbID: string;      // Unique ID like "tt1234567"
  Title: string;       // Movie title
  Year: string;        // Release year
  Poster: string;      // URL to poster image
  Type: string;        // "movie", "series", or "episode"
}

// When we get full details about a movie, we get more information
export interface MovieDetails {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;       // Rating like "PG-13", "R", etc.
  Released: string;    // Full release date
  Runtime: string;     // Like "148 min"
  Genre: string;       // Comma-separated genres
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;        // Movie summary
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];   // Array of different ratings
  Metascore: string;
  imdbRating: string;  // The main IMDb rating
  imdbVotes: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;    // "True" or "False" from API
}

// Each rating source (IMDb, Rotten Tomatoes, etc.)
export interface Rating {
  Source: string;      // Name like "Internet Movie Database"
  Value: string;       // Rating like "8.5/10"
}

// The response when we search (contains multiple movies)
export interface SearchResponse {
  Search: MovieSearchResult[];
  totalResults: string;
  Response: string;
}
