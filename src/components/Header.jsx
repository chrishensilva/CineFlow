import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, User, Search, X } from 'lucide-react';
import { tmdb } from '../services/tmdb';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim().length > 2) {
                const results = await tmdb.searchMovies(query);
                setSuggestions(results.slice(0, 8)); // Limit to 8 suggestions
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (movieId) => {
        navigate(`/movie/${movieId}`);
        setQuery('');
        setShowSuggestions(false);
    };

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container header-container">
                <Link to="/" className="logo">
                    <Film className="logo-icon" size={28} />
                    <span>Cine<span className="text-highlight">Flow</span></span>
                </Link>

                <nav className="nav-links">
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                    <Link to="/movies" className={location.pathname === '/movies' ? 'active' : ''}>Movies</Link>
                    <Link to="/search?q=Marvel" className={location.pathname === '/search' ? 'active' : ''}>Marvel</Link>
                    <Link to="/movies" className={location.pathname === '/movies' ? 'active' : ''}>Popular</Link>
                </nav>

                <div className="header-actions">
                    <div className="search-wrapper" ref={searchRef}>
                        <div className="search-bar">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                onFocus={() => query.trim().length > 2 && setShowSuggestions(true)}
                            />
                            {query && (
                                <X
                                    size={16}
                                    className="clear-search"
                                    onClick={() => { setQuery(''); setSuggestions([]); }}
                                />
                            )}
                        </div>

                        {showSuggestions && suggestions.length > 0 && (
                            <div className="search-suggestions">
                                {suggestions.map(movie => (
                                    <div
                                        key={movie.id}
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(movie.id)}
                                    >
                                        <img
                                            src={tmdb.getImageUrl(movie.poster_path, 'w92') || 'https://via.placeholder.com/45x68?text=No+Img'}
                                            alt={movie.title}
                                        />
                                        <div className="suggestion-info">
                                            <div className="suggestion-title">{movie.title}</div>
                                            <div className="suggestion-meta">
                                                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'} • ★{movie.vote_average?.toFixed(1)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/*<button className="user-btn">
                        <User size={20} />
                    </button>*/}
                </div>
            </div>
        </header>
    );
};

export default Header;
