const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
import { customLinks } from '../data/movieLinks';

const fetchFromTMDB = async (endpoint, params = {}) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', API_KEY);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('TMDB Fetch Error:', error);
        return null;
    }
};

export const tmdb = {
    getTrending: async (page = 1) => {
        const data = await fetchFromTMDB('/trending/movie/day', { page });
        return data || { results: [], total_pages: 0 };
    },
    getPopular: async (page = 1) => {
        const data = await fetchFromTMDB('/movie/popular', { page });
        return data || { results: [], total_pages: 0 };
    },
    getUpcoming: async () => {
        const data = await fetchFromTMDB('/movie/upcoming');
        return data?.results || [];
    },
    getMoviesByGenre: async (genreId, page = 1) => {
        const data = await fetchFromTMDB('/discover/movie', { with_genres: genreId, page });
        return data || { results: [], total_pages: 0 };
    },
    getDiscover: async (params = {}) => {
        const data = await fetchFromTMDB('/discover/movie', params);
        return data || { results: [], total_pages: 0 };
    },
    getGenres: async () => {
        const data = await fetchFromTMDB('/genre/movie/list');
        return data?.genres || [];
    },
    getMovieDetails: async (movieId) => {
        const data = await fetchFromTMDB(`/movie/${movieId}`, { append_to_response: 'videos,credits,watch/providers,external_ids' });
        return data;
    },
    searchMovies: async (query) => {
        const data = await fetchFromTMDB('/search/movie', { query });
        return data?.results || [];
    },
    getImageUrl: (path, size = 'original') => {
        if (!path) return null;
        return `${IMAGE_BASE_URL}/${size}${path}`;
    },
    formatMovie: (movie) => {
        const custom = customLinks[movie.id.toString()] || {};

        // Get watch provider link (preferring US locale but fallback to any available)
        const watchData = movie['watch/providers'] || movie.watch_providers;
        const watchProviders = watchData?.results;
        const watchLink = watchProviders?.US?.link || (watchProviders && Object.values(watchProviders)[0]?.link) || null;

        return {
            id: movie.id,
            title: movie.title || movie.name,
            year: new Date(movie.release_date || movie.first_air_date).getFullYear() || 'N/A',
            rating: movie.vote_average?.toFixed(1) || 'N/A',
            genre: movie.genres ? movie.genres.map(g => g.name) : [],
            description: movie.overview,
            runtime: movie.runtime,
            status: movie.status,
            revenue: movie.revenue,
            budget: movie.budget,
            production_countries: movie.production_countries?.map(c => c.name) || [],
            cast: movie.credits?.cast?.slice(0, 12).map(c => ({
                id: c.id,
                name: c.name,
                character: c.character,
                profile: tmdb.getImageUrl(c.profile_path, 'w185')
            })) || [],
            backdrop: tmdb.getImageUrl(movie.backdrop_path),
            poster: tmdb.getImageUrl(movie.poster_path, 'w500'),
            trailer: movie.videos?.results?.find(v => v.type === 'Trailer')?.key
                ? `https://www.youtube.com/watch?v=${movie.videos.results.find(v => v.type === 'Trailer').key}`
                : null,
            watchLink: watchLink,
            imdbId: movie.external_ids?.imdb_id || movie.imdb_id,
            downloadLink: custom.download || "#",
            streamLink: custom.stream || "#"
        };
    }
};
