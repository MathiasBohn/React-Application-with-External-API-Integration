# Cinema Vault

A modern, cinematic movie search and comparison application built with Next.js 16, React 19, and the OMDb API. Search for movies, save your favorites, and compare multiple films side-by-side.

## Features

- **Movie Search**: Search for movies, series, and episodes using the OMDb API
- **Detailed Movie View**: View comprehensive movie details including plot, cast, ratings, and more
- **Favorites System**: Save your favorite movies to local storage for quick access
- **Movie Comparison**: Compare multiple movies side-by-side to see ratings, plot, cast, and other details
- **Responsive Design**: Beautiful, cinematic UI with Tailwind CSS 4 and film-themed styling
- **Next.js App Router**: Modern Next.js architecture with Server and Client Components
- **Error Boundary**: Graceful error handling prevents app crashes and provides helpful feedback
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation, and screen reader support
- **Environment-Based Configuration**: Secure API key management via environment variables

## Tech Stack

- **Framework**: Next.js 16.0.1 (App Router)
- **React**: 19.2.0
- **TypeScript**: Type-safe development
- **Styling**: Tailwind CSS 4
- **API**: OMDb API (Open Movie Database)
- **Font Optimization**: Next.js font optimization with Geist Sans & Geist Mono

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-application-with-external-api-integration
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your OMDb API key
# Get a free API key at: http://www.omdbapi.com/apikey.aspx
NEXT_PUBLIC_OMDB_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Create an optimized production build
- `npm run start` - Start the production server (requires build first)
- `npm run lint` - Run ESLint to check code quality

## API Information

### OMDb API (Open Movie Database)

**Base URL**: `http://www.omdbapi.com/`

**API Key**: Currently hardcoded in `lib/omdb.ts` (see Known Issues)

#### Endpoints Used

1. **Search Movies**
   - **Endpoint**: `/?apikey={API_KEY}&s={query}`
   - **Example**: `http://www.omdbapi.com/?apikey=3c76c1c&s=Inception`
   - **Purpose**: Search for movies by title
   - **Returns**: Array of movie search results with basic info (title, year, poster, IMDb ID)

2. **Get Movie Details**
   - **Endpoint**: `/?apikey={API_KEY}&i={imdbID}`
   - **Example**: `http://www.omdbapi.com/?apikey=3c76c1c&i=tt1375666`
   - **Purpose**: Get full details for a specific movie using its IMDb ID
   - **Returns**: Complete movie information including plot, cast, ratings, awards, etc.

3. **Get Movie by Title**
   - **Endpoint**: `/?apikey={API_KEY}&t={title}`
   - **Example**: `http://www.omdbapi.com/?apikey=3c76c1c&t=Inception`
   - **Purpose**: Search for an exact movie title match
   - **Returns**: Full movie details

**API Documentation**: [http://www.omdbapi.com/](http://www.omdbapi.com/)

## Project Structure

```
react-application-with-external-api-integration/
├── app/
│   ├── layout.tsx              # Root layout with fonts, metadata, and ErrorBoundary
│   ├── page.tsx                # Home page with movie search
│   ├── globals.css             # Global Tailwind styles and accessibility utilities
│   ├── movie/
│   │   └── [imdbID]/
│   │       └── page.tsx        # Dynamic route for movie details
│   ├── favorites/
│   │   └── page.tsx            # Favorites collection page
│   └── compare/
│       └── page.tsx            # Movie comparison page
├── components/
│   ├── MovieCard.tsx           # Reusable movie card component
│   └── ErrorBoundary.tsx       # Error boundary for graceful error handling
├── lib/
│   ├── omdb.ts                 # OMDb API functions
│   └── types.ts                # TypeScript type definitions
├── hooks/
│   ├── useFavorites.ts         # Custom hook for favorites management
│   └── useComparison.ts        # Custom hook for comparison feature
├── .env.example                # Example environment variables
├── .env.local                  # Local environment variables (gitignored)
└── public/                     # Static assets
```

## Features in Detail

### Search Functionality
- Real-time movie search using OMDb API
- Search for movies, TV series, and episodes
- Responsive grid layout displaying search results
- Error handling for failed searches or no results

### Movie Details Page
- Dynamic routing with IMDb ID (`/movie/[imdbID]`)
- Displays comprehensive movie information:
  - Poster image with fallback placeholder
  - Title, year, rating, runtime
  - Genre, plot, director, writers, cast
  - Multiple rating sources (IMDb, Rotten Tomatoes, Metacritic)
  - Awards, language, country information
- Add to favorites and comparison directly from detail page

### Favorites System
- Uses browser localStorage for persistence
- Add/remove movies from favorites
- View all favorites in dedicated page
- Favorites counter in navigation

### Movie Comparison
- Compare up to multiple movies side-by-side
- Visual comparison of ratings, plot, cast, and details
- Add movies to comparison from search results or detail pages
- Clear comparison list functionality

## Known Issues & Challenges

### 1. API Key Management ✅ **RESOLVED**
**Previous Issue**: The OMDb API key was hardcoded in `lib/omdb.ts`

**Solution Implemented**:
- API key now loaded from environment variables (`NEXT_PUBLIC_OMDB_API_KEY`)
- `.env.example` file provided for easy setup
- `.env.local` automatically ignored by git for security
- See installation steps above for setup instructions

### 2. Image Optimization
**Challenge**: OMDb returns external image URLs from various sources

**Current Solution**: The app uses `unoptimized={!movie.Poster.includes('media-amazon.com')}` to handle external images

**Note**: Next.js Image optimization works best with configured domains in `next.config.ts`

### 3. API Rate Limits
**Issue**: Free OMDb API has rate limits (1,000 requests per day)

**Impact**: Heavy usage could hit rate limits

**Mitigation**: Consider implementing request caching or upgrading to paid API plan for production

### 4. Client-Side State
**Challenge**: Favorites and comparison lists use localStorage (client-side only)

**Impact**:
- State not shared across devices
- No server-side rendering of favorites
- Data lost if localStorage is cleared

**Future Enhancement**: Consider implementing a backend database for user accounts and persistent state

### 5. Error Handling ✅ **IMPROVED**
**Current State**:
- Error Boundary component catches and displays React errors gracefully
- API error handling with user-friendly messages
- Loading states for all async operations
- Validation for missing environment variables

**Implementation**:
- `<ErrorBoundary>` wrapper in root layout prevents app crashes
- Dedicated error UI with "Try Again" and "Back to Home" options
- Detailed error information available for developers (expandable)

**Future Enhancement**: Could add error reporting service integration (e.g., Sentry) and retry logic for network failures

## Browser Compatibility

- Modern browsers with ES6+ support
- localStorage API required for favorites and comparison features
- Tested on Chrome, Firefox, Safari, and Edge

## Future Enhancements

- User authentication and cloud-saved favorites
- Advanced search filters (year, genre, rating)
- Movie recommendations based on viewing history
- Share favorite lists with shareable links
- Dark/light theme toggle
- Pagination for search results
- Movie trailers integration (YouTube API)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is created for educational purposes as part of the Flatiron School curriculum.

## Acknowledgments

- Movie data provided by [OMDb API](http://www.omdbapi.com/)
- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
