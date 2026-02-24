import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Meh, Star, Calendar } from 'lucide-react';
import { tmdb } from '../services/tmdb';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './SearchPage.css';

const SearchPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';

    useEffect(() => {
        const fetchResults = async () => {
            if (query) {
                setLoading(true);
                try {
                    const data = await tmdb.searchMovies(query);
                    if (data) {
                        setResults(data.map(tmdb.formatMovie));
                    }
                } catch (error) {
                    console.error("Error searching movies:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        };

        fetchResults();
        window.scrollTo(0, 0);
    }, [query]);

    return (
        <>
            <Helmet>
                <title>{query ? `Search Results for "${query}"` : 'Search Movies'} | FilmStack</title>
                <meta name="description" content={`Find the best movies related to ${query || 'your favorite genres'} on FilmStack.`} />
            </Helmet>
            <Header />
            <div className="container search-page">
                <div className="search-header">
                    {query ? (
                        <h1 className="search-title">
                            Results for: <span className="search-query">"{query}"</span>
                        </h1>
                    ) : (
                        <h1 className="search-title">Search Movies</h1>
                    )}
                    <p style={{ marginTop: '10px', color: '#888' }}>
                        {loading ? 'Searching...' : `Found ${results.length} result${results.length !== 1 ? 's' : ''}`}
                    </p>
                </div>

                {loading ? (
                    <div className="flex-center" style={{ height: '50vh', color: 'white' }}>
                        <div className="loader">Searching...</div>
                    </div>
                ) : results.length > 0 ? (
                    <div className="search-grid">
                        {results.map(movie => (
                            <Link to={`/movie/${movie.id}`} key={movie.id} className="search-card animate-fade-in">
                                <img src={movie.poster} alt={movie.title} loading="lazy" />
                                <div className="search-card-info">
                                    <h3 className="search-card-title">{movie.title}</h3>
                                    <div className="search-card-meta">
                                        <span className="flex-center">
                                            <Star size={14} fill="var(--primary-color)" stroke="none" style={{ marginRight: '4px' }} />
                                            {movie.rating}
                                        </span>
                                        <span className="flex-center">
                                            <Calendar size={14} style={{ marginRight: '4px' }} />
                                            {movie.year}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="no-results animate-fade-in">
                        <Meh size={64} style={{ marginBottom: '20px', opacity: 0.5 }} />
                        <h3>No movies found matching "{query}"</h3>
                        <p>Try searching for "Action", "Dune", "2024", etc.</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default SearchPage;
