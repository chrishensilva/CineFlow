import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import Footer from '../components/Footer';
import { tmdb } from '../services/tmdb';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [trending, setTrending] = useState([]);
    const [newReleases, setNewReleases] = useState([]);
    const [actionMovies, setActionMovies] = useState([]);
    const [scifiMovies, setScifiMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [trendingRes, upcomingRes, actionRes, scifiRes] = await Promise.all([
                    tmdb.getTrending(),
                    tmdb.getUpcoming(),
                    tmdb.getMoviesByGenre(28),
                    tmdb.getMoviesByGenre(878)
                ]);

                const formattedTrending = (trendingRes.results || []).map(tmdb.formatMovie);
                const formattedUpcoming = upcomingRes.map(tmdb.formatMovie);
                const formattedAction = (actionRes.results || []).map(tmdb.formatMovie);
                const formattedScifi = (scifiRes.results || []).map(tmdb.formatMovie);

                setTrending(formattedTrending);
                setNewReleases(formattedUpcoming);
                setActionMovies(formattedAction);
                setScifiMovies(formattedScifi);

                if (formattedTrending.length > 0) {
                    // Fetch full details for the featured movie to get the trailer
                    const fullFeatured = await tmdb.getMovieDetails(formattedTrending[0].id);
                    if (fullFeatured) {
                        setFeaturedMovie(tmdb.formatMovie(fullFeatured));
                    } else {
                        setFeaturedMovie(formattedTrending[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '100vh', background: '#0a0a0a', color: 'white' }}>
                <div className="loader">Loading Cinematic Experience...</div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>FilmStack | Discover & Stream Latest Movies</title>
                <meta name="description" content="Explore trending movies, upcoming releases, and action blockbusters on FilmStack. Your automated movie discovery portal." />
            </Helmet>
            <Header />
            <Hero movie={featuredMovie} />

            <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
                <MovieRow title="Trending Now" movies={trending} id="trending" />
                <MovieRow title="New Releases" movies={newReleases} id="movies" />
                <MovieRow title="Action Blockbusters" movies={actionMovies} id="action" />
                <MovieRow title="Sci-Fi Wonders" movies={scifiMovies} id="scifi" />
            </div>

            <Footer />
        </>
    );
};

export default Home;
