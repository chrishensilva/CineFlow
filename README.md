## TMDB Connection Setup

To use dynamic movie data, you need to provide a TMDB API key:

1.  Get an API Key from [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api).
2.  Open the `.env` file in the root directory.
3.  Replace `your_tmdb_api_key_here` with your actual API Key.
4.  Restart the development server if it's running.

The website now fetches:
- **Trending Now**: Daily trending movies.
- **New Releases**: Upcoming movie releases.
- **Genre Sections**: Dynamic action and sci-fi collections.
- **Search**: Real-time search using TMDB's extensive library.
- **Movie Details**: Full details including high-res backdrops and YouTube trailers.
