import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Download, Star, Calendar, Clock } from 'lucide-react';
import gsap from 'gsap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StreamModal from '../components/StreamModal';
import DownloadModal from '../components/DownloadModal';
import { tmdb } from '../services/tmdb';
import { Helmet } from 'react-helmet-async';
import './MovieDetail.css';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showStream, setShowStream] = useState(false);
    const [showDownload, setShowDownload] = useState(false);
    const posterRef = useRef(null);
    const infoRef = useRef(null);
    const castRef = useRef(null);

    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            try {
                const data = await tmdb.getMovieDetails(id);
                if (data) {
                    setMovie(tmdb.formatMovie(data));
                }
            } catch (error) {
                console.error("Error fetching movie details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (movie && posterRef.current && infoRef.current) {
            const tl = gsap.timeline();

            tl.fromTo(posterRef.current,
                { opacity: 0, scale: 0.9, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }
            )
                .fromTo(infoRef.current.children,
                    { opacity: 0, x: 20 },
                    { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
                    "-=0.4"
                );

            if (castRef.current) {
                tl.fromTo(castRef.current.children,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "back.out(1.7)" },
                    "-=0.2"
                );
            }

            return () => tl.kill();
        }
    }, [movie]);

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatRuntime = (minutes) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '100vh', color: 'white' }}>
                <div className="loader">Loading Movie...</div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="flex-center" style={{ height: '100vh', color: 'white' }}>
                <h2>Movie not found.</h2>
            </div>
        );
    }

    return (
        <div className="detail-page-wrapper">
            <Helmet>
                <title>{movie.title} | CineFlow</title>
                <meta name="description" content={movie.description?.slice(0, 160)} />
                <meta property="og:title" content={`${movie.title} | CineFlow`} />
                <meta property="og:description" content={movie.description?.slice(0, 160)} />
                <meta property="og:image" content={movie.backdrop || movie.poster} />
            </Helmet>
            <Header />
            <div className="movie-detail">
                <div className="detail-backdrop">
                    <img src={movie.backdrop} alt={movie.title} className="backdrop-image" />
                    <div className="overlay-gradient"></div>
                </div>

                <div className="container detail-content">
                    <img
                        ref={posterRef}
                        src={movie.poster}
                        alt={movie.title}
                        className="detail-poster"
                    />

                    <div className="detail-info" ref={infoRef}>
                        <h1 className="detail-title">{movie.title}</h1>

                        <div className="detail-meta">
                            <span className="rating-badge flex-center">
                                <Star size={16} fill="white" style={{ marginRight: '4px' }} />
                                {movie.rating}
                            </span>
                            <span className="flex-center">
                                <Calendar size={18} style={{ marginRight: '6px' }} />
                                {movie.year}
                            </span>
                            <span className="flex-center">
                                <Clock size={18} style={{ marginRight: '6px' }} />
                                {formatRuntime(movie.runtime)}
                            </span>
                            <span>{movie.genre.join(', ')}</span>
                        </div>

                        <p className="detail-description">
                            {movie.description}
                        </p>

                        <div className="detail-actions">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => {
                                    if (movie.watchLink) {
                                        window.open(movie.watchLink, '_blank');
                                    } else {
                                        setShowStream(true);
                                    }
                                }}
                            >
                                <Play fill="currentColor" size={24} /> Stream Now
                            </button>
                            <button
                                className="btn btn-outline btn-lg"
                                onClick={() => {
                                    if (movie.watchLink) {
                                        window.open(movie.watchLink, '_blank');
                                    } else {
                                        setShowDownload(true);
                                    }
                                }}
                            >
                                <Download size={24} /> Download Now
                            </button>
                        </div>

                        <div className="extra-details">
                            <div className="detail-item">
                                <span className="detail-label">Status</span>
                                <span className="detail-value">{movie.status || 'Released'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Production</span>
                                <span className="detail-value">{movie.production_countries.join(', ') || 'Global'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Budget</span>
                                <span className="detail-value">{formatCurrency(movie.budget)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Revenue</span>
                                <span className="detail-value">{formatCurrency(movie.revenue)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container cast-section">
                    <h2 className="section-title">Top Cast</h2>
                    <div className="cast-grid" ref={castRef}>
                        {movie.cast.map((person) => (
                            <div key={person.id} className="cast-card">
                                <img
                                    src={person.profile || 'https://via.placeholder.com/185x185?text=No+Image'}
                                    alt={person.name}
                                    className="cast-image"
                                />
                                <div className="cast-name">{person.name}</div>
                                <div className="cast-character">{person.character}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <StreamModal movie={movie} isOpen={showStream} onClose={() => setShowStream(false)} />
            <DownloadModal movie={movie} isOpen={showDownload} onClose={() => setShowDownload(false)} />

            <Footer movie={movie} />
        </div>
    );
};

export default MovieDetail;
