import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import Footer from '../components/Footer';
import { tmdb } from '../services/tmdb';
import { Helmet } from 'react-helmet-async';

import { useQuery } from '@tanstack/react-query';

const Home = () => {
    const { data, isLoading: loading } = useQuery({
        queryKey: ['homeData'],
        queryFn: async () => {
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

            let featured = formattedTrending[0] || null;
            if (featured) {
                const fullFeatured = await tmdb.getMovieDetails(featured.id);
                if (fullFeatured) {
                    featured = tmdb.formatMovie(fullFeatured);
                }
            }

            return {
                trending: formattedTrending,
                newReleases: formattedUpcoming,
                actionMovies: formattedAction,
                scifiMovies: formattedScifi,
                featuredMovie: featured
            };
        }
    });

    const {
        trending = [],
        newReleases = [],
        actionMovies = [],
        scifiMovies = [],
        featuredMovie = null
    } = data || {};

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
                <title>CineFlow – Discover & Stream Latest Movies</title>
                <meta name="description" content="Explore trending movies, upcoming releases, and action blockbusters on CineFlow. Your automated movie discovery portal." />
                <link rel="canonical" href="https://cineflow.live/" />
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
