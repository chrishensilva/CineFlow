import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Pagination from '../components/Pagination';
import { tmdb } from '../services/tmdb';
import { Link } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import './MoviesPage.css';

import Filters from '../components/Filters';

const MoviesPage = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [apiKeyMissing, setApiKeyMissing] = useState(false);

    // Filter states
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [sortBy, setSortBy] = useState('popularity.desc');

    useEffect(() => {
        const fetchGenres = async () => {
            const data = await tmdb.getGenres();
            setGenres(data);
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            if (import.meta.env.VITE_TMDB_API_KEY === 'your_tmdb_api_key_here' || !import.meta.env.VITE_TMDB_API_KEY) {
                setApiKeyMissing(true);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const params = {
                    page,
                    sort_by: sortBy,
                    with_genres: selectedGenre,
                    primary_release_year: selectedYear
                };

                const data = await tmdb.getDiscover(params);
                if (data) {
                    setMovies(data.results.map(tmdb.formatMovie));
                    setTotalPages(Math.min(data.total_pages, 500));
                }
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        fetchMovies();
    }, [page, selectedGenre, selectedYear, sortBy]);

    const handleReset = () => {
        setSelectedGenre('');
        setSelectedYear('');
        setSortBy('popularity.desc');
        setPage(1);
    };

    return (
        <>
            <Helmet>
                <title>Explore Movies | FilmStack - Discover Your Next Favorite Film</title>
                <meta name="description" content="Browse our extensive collection of movies. Filter by genre, year, and popularity to find exactly what you're looking for." />
            </Helmet>
            <Header />
            <div className="container movies-page">
                <div className="section-header">
                    <h1 className="section-title">Explore Movies</h1>
                    <p className="section-subtitle">Browse through our extensive collection of cinema</p>
                </div>

                {!apiKeyMissing && (
                    <Filters
                        genres={genres}
                        selectedGenre={selectedGenre}
                        onGenreChange={(val) => { setSelectedGenre(val); setPage(1); }}
                        selectedYear={selectedYear}
                        onYearChange={(val) => { setSelectedYear(val); setPage(1); }}
                        sortBy={sortBy}
                        onSortChange={(val) => { setSortBy(val); setPage(1); }}
                        onReset={handleReset}
                    />
                )}

                {loading ? (
                    <div className="flex-center" style={{ height: '50vh' }}>
                        <div className="loader">Loading Movies...</div>
                    </div>
                ) : apiKeyMissing ? (
                    <div className="no-api-notice animate-fade-in">
                        <h2>TMDB API Key Required</h2>
                        <p>To browse all movies, please add your TMDB API key to the <code>.env</code> file.</p>
                        <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ marginTop: '20px' }}>
                            Get API Key
                        </a>
                    </div>
                ) : (
                    <>
                        <div className="movies-grid">
                            {movies.map(movie => (
                                <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card-v2 animate-fade-in">
                                    <div className="card-image-wrapper">
                                        <img src={movie.poster} alt={movie.title} loading="lazy" />
                                        <div className="card-overlay">
                                            <span className="rating-tag">
                                                <Star size={14} fill="currentColor" /> {movie.rating}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-info">
                                        <h3 className="card-title">{movie.title}</h3>
                                        <div className="card-meta">
                                            <span>{movie.year}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {movies.length === 0 && !loading && (
                            <div className="no-results" style={{ padding: '40px' }}>
                                <h3>No movies found matching these filters.</h3>
                                <p>Try adjusting your genre, year, or sorting options.</p>
                            </div>
                        )}

                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default MoviesPage;
