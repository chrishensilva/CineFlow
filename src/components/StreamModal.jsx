import React, { useEffect } from 'react';
import { X, Wifi, Eye, Clock } from 'lucide-react';
import './StreamModal.css';

const StreamModal = ({ movie, isOpen, onClose }) => {
    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!movie) return null;

    // Convert YouTube watch URL to embed URL
    const getEmbedUrl = (url) => {
        if (!url) return '';
        const match = url.match(/(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (match) {
            return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
        }
        return url;
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="stream-modal" onClick={(e) => e.stopPropagation()}>
                <div className="stream-header">
                    <h3>
                        <span className="live-dot"></span>
                        Now Streaming: {movie.title}
                    </h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="video-container">
                    {isOpen && (
                        <iframe
                            src={getEmbedUrl(movie.trailer)}
                            title={movie.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}
                </div>

                <div className="stream-info">
                    <div className="stream-meta">
                        <span><Wifi size={16} /> Streaming</span>
                        <span><Eye size={16} /> 2.4K watching</span>
                        <span><Clock size={16} /> {movie.year}</span>
                    </div>
                    <span className="stream-quality-badge">HD 1080p</span>
                </div>
            </div>
        </div>
    );
};

export default StreamModal;
