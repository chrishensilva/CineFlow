import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Check, HardDrive, Zap } from 'lucide-react';
import './DownloadModal.css';

const qualities = [
    { id: '720p', label: '720p', badge: 'HD', badgeClass: 'hd', size: '1.2 GB', format: 'MP4 x264' },
    { id: '1080p', label: '1080p', badge: 'FHD', badgeClass: 'fhd', size: '2.4 GB', format: 'MP4 x265' },
    { id: '4k', label: '2160p', badge: '4K UHD', badgeClass: 'uhd', size: '5.8 GB', format: 'MKV HEVC' },
];

const DownloadModal = ({ movie, isOpen, onClose }) => {
    const [selectedQuality, setSelectedQuality] = useState('1080p');
    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [complete, setComplete] = useState(false);
    const [speed, setSpeed] = useState('0');
    const intervalRef = useRef(null);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') handleClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleClose = () => {
        // Reset state on close
        setDownloading(false);
        setProgress(0);
        setComplete(false);
        setSpeed('0');
        if (intervalRef.current) clearInterval(intervalRef.current);
        onClose();
    };

    const startDownload = () => {
        setDownloading(true);
        setProgress(0);
        setComplete(false);

        // Simulate download progress
        intervalRef.current = setInterval(() => {
            setProgress(prev => {
                // Randomize speed for realism
                const randomSpeed = (Math.random() * 15 + 5).toFixed(1);
                setSpeed(randomSpeed);

                const increment = Math.random() * 4 + 1;
                const newProgress = prev + increment;

                if (newProgress >= 100) {
                    clearInterval(intervalRef.current);
                    setComplete(true);
                    setDownloading(false);
                    return 100;
                }
                return newProgress;
            });
        }, 200);
    };

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    if (!movie) return null;

    const selected = qualities.find(q => q.id === selectedQuality);

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleClose}>
            <div className="download-modal" onClick={(e) => e.stopPropagation()}>
                <div className="download-header">
                    <h3>Download Movie</h3>
                    <button className="close-btn" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="download-body">
                    {/* Movie Info */}
                    <div className="movie-download-info">
                        <img src={movie.poster} alt={movie.title} />
                        <div className="info-text">
                            <h4>{movie.title}</h4>
                            <p>{movie.year} • {movie.genre.join(', ')}</p>
                        </div>
                    </div>

                    {!complete ? (
                        <>
                            {/* Quality Selection */}
                            <div className="quality-options">
                                {qualities.map(q => (
                                    <div
                                        key={q.id}
                                        className={`quality-option ${selectedQuality === q.id ? 'selected' : ''}`}
                                        onClick={() => !downloading && setSelectedQuality(q.id)}
                                    >
                                        <div className="quality-left">
                                            <div className="radio-circle">
                                                <div className="radio-circle-inner"></div>
                                            </div>
                                            <div>
                                                <span className="quality-label">{q.label}</span>
                                                <span className={`quality-badge ${q.badgeClass}`}>{q.badge}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className="quality-size">{q.size}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#666' }}>{q.format}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Torrent-style info */}
                            <div className="torrent-info">
                                <div className="torrent-stat">
                                    <div className="stat-value seeds">142</div>
                                    <div className="stat-label">Seeds</div>
                                </div>
                                <div className="torrent-stat">
                                    <div className="stat-value peers">38</div>
                                    <div className="stat-label">Peers</div>
                                </div>
                                <div className="torrent-stat">
                                    <div className="stat-value" style={{ color: '#60a5fa' }}>{selected?.format}</div>
                                    <div className="stat-label">Format</div>
                                </div>
                                <div className="torrent-stat">
                                    <div className="stat-value" style={{ color: '#e0e0e0' }}>{selected?.size}</div>
                                    <div className="stat-label">Size</div>
                                </div>
                            </div>

                            {/* Download Progress */}
                            {downloading && (
                                <div className="download-progress">
                                    <div className="progress-header">
                                        <span className="progress-percent">{Math.round(progress)}%</span>
                                        <span className="progress-speed">
                                            <Zap size={14} style={{ marginRight: '4px' }} />
                                            {speed} MB/s
                                        </span>
                                    </div>
                                    <div className="progress-bar-track">
                                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <div className="progress-details">
                                        <span><HardDrive size={12} style={{ marginRight: '4px' }} /> {selected?.size}</span>
                                        <span>ETA: ~{Math.max(1, Math.round((100 - progress) / 5))}s</span>
                                    </div>
                                </div>
                            )}

                            {/* Download Button */}
                            {!downloading && (
                                <button className="download-start-btn" onClick={startDownload} style={{ marginTop: '20px' }}>
                                    <Download size={22} />
                                    Download {selectedQuality.toUpperCase()} — {selected?.size}
                                </button>
                            )}
                        </>
                    ) : (
                        /* Download Complete */
                        <div className="download-complete">
                            <div className="check-circle">
                                <Check size={32} color="white" />
                            </div>
                            <h4>Download Complete!</h4>
                            <p>"{movie.title}" ({selectedQuality.toUpperCase()}) is ready.</p>
                            <div className="flex-center" style={{ gap: '10px', marginTop: '20px' }}>
                                <button className="download-start-btn" onClick={handleClose}>
                                    Done
                                </button>
                                {movie.downloadLink && movie.downloadLink !== "#" && (
                                    <a
                                        href={movie.downloadLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="download-start-btn"
                                        style={{ background: 'var(--primary-color)' }}
                                    >
                                        <Download size={20} /> Save File
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DownloadModal;
