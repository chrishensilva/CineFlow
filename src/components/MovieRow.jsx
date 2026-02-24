import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './MovieRow.css';

gsap.registerPlugin(ScrollTrigger);

const MovieRow = ({ title, movies, id }) => {
    const rowRef = useRef(null);

    // Optional: Add simple enter animation when the row comes into view
    useEffect(() => {
        gsap.fromTo(rowRef.current,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: rowRef.current,
                    start: "top 85%",
                }
            }
        );
    }, []);

    return (
        <div className="row" ref={rowRef} id={id}>
            <h2 className="row-title">{title}</h2>

            <div className="row-posters">
                {movies.map(movie => (
                    <div key={movie.id} className="movie-card">
                        <Link to={`/movie/${movie.id}`}>
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                loading="lazy"
                            />
                            <div className="movie-info">
                                <p className="movie-title">{movie.title}</p>
                                <span className="movie-rating">★ {movie.rating}</span>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieRow;
