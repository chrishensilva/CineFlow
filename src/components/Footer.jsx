import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import './Footer.css';

const Footer = ({ movie }) => {
    const getSubtitleLink = () => {
        if (!movie) return "https://www.opensubtitles.org";

        if (movie.imdbId) {
            return `https://www.opensubtitles.org/en/search2/sublanguageid-all/imdbid-${movie.imdbId.replace('tt', '')}`;
        }

        return `https://www.opensubtitles.org/en/search2/sublanguageid-all/moviename-${encodeURIComponent(movie.title)}`;
    };

    return (
        <footer className="footer">
            <div className="container footer-content">
                {/*<div className="social-icons">
                    <a href="#"><Facebook size={24} /></a>
                    <a href="#"><Instagram size={24} /></a>
                    <a href="#"><Twitter size={24} /></a>
                    <a href="#"><Youtube size={24} /></a>
                </div>

                <div className="footer-links">
                    <ul>
                        <li><a href={getSubtitleLink()} target="_blank" rel="noreferrer">Subtitles</a></li>
                        <li><a href="#">Media Center</a></li>
                        <li><a href="#">Privacy</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                    <ul>
                        <li><a href="#">Audio Description</a></li>
                        <li><a href="#">Investor Relations</a></li>
                        <li><a href="#">Legal Notices</a></li>
                    </ul>
                    <ul>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Jobs</a></li>
                        <li><a href="#">Cookie Preferences</a></li>
                    </ul>
                    <ul>
                        <li><a href="#">Gift Cards</a></li>
                        <li><a href="#">Terms of Use</a></li>
                        <li><a href="#">Corporate Information</a></li>
                    </ul>
                </div>*/}

                <div className="copyright">
                    &copy; {new Date().getFullYear()} FilmStack. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
