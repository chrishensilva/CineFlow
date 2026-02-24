import React, { useEffect, useRef, useState } from 'react';
import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import StreamModal from './StreamModal';
import './Hero.css';

const Hero = ({ movie }) => {
    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const imageRef = useRef(null);
    const [showStream, setShowStream] = useState(false);

    useEffect(() => {
        if (!movie || !imageRef.current || !titleRef.current || !contentRef.current) return;

        const tl = gsap.timeline();

        tl.fromTo(
            imageRef.current,
            { scale: 1.1, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }
        )
            .fromTo(
                titleRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
                "-=1"
            )
            .fromTo(
                contentRef.current.children,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" },
                "-=0.5"
            );

        return () => tl.kill();
    }, [movie]);

    if (!movie) return null;

    return (
        <>
            <div className="hero">
                <img
                    ref={imageRef}
                    src={movie.backdrop}
                    alt={movie.title}
                    className="hero-image"
                />
                <div className="hero-overlay"></div>

                <div className="hero-content" ref={contentRef}>
                    <h1 className="hero-title" ref={titleRef}>{movie.title}</h1>

                    <div className="hero-meta">
                        <span className="hero-rating">★ {movie.rating}</span>
                        <span>{movie.year}</span>
                        <span>{movie.genre.join(', ')}</span>
                    </div>

                    <p className="hero-desc">
                        {movie.description}
                    </p>

                    <div className="hero-actions">
                        <button className="btn btn-primary" onClick={() => setShowStream(true)}>
                            <Play size={24} fill="currentColor" /> Watch Trailer
                        </button>
                        <Link to={`/movie/${movie.id}`} className="btn btn-outline">
                            <Info size={24} /> More Info
                        </Link>
                    </div>
                </div>
            </div>

            <StreamModal movie={movie} isOpen={showStream} onClose={() => setShowStream(false)} />
        </>
    );
};

export default Hero;
